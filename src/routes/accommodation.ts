import { Router } from "express";
import { db } from "../db";
import { z } from "zod";

const router = Router();

/* =========================================================
   1. GET ALL ACCOMMODATION BY LOCATION
========================================================= */
router.get("/", (req, res) => {
  const location = req.query.location as string;

  if (!location) {
    return res.status(400).json({ error: "location is required" });
  }

  try {
    const results = db
      .prepare(`
        SELECT * FROM accommodation
        WHERE LOWER(location) LIKE LOWER(?)
      `)
      .all(`%${location}%`);

    res.json(results);
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

/* =========================================================
   2. GET ACCOMMODATION BY TYPE + LOCATION
========================================================= */
router.get("/search", (req, res) => {
  const location = req.query.location as string;
  const type = req.query.type as string;

  if (!location || !type) {
    return res.status(400).json({
      error: "location and type are required"
    });
  }

  try {
    const results = db
      .prepare(`
        SELECT * FROM accommodation
        WHERE LOWER(location) LIKE LOWER(?)
        AND LOWER(type) = LOWER(?)
      `)
      .all(`%${location}%`, type);

    res.json(results);
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

/* =========================================================
   3. BOOK ACCOMMODATION (FIXED VERSION)
========================================================= */
router.post("/book", (req, res) => {
  const schema = z.object({
    accID: z.number(),
    npeople: z.number(),
    thedate: z.number(),
    apiID: z.string()
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "invalid request body" });
  }

  const { accID, npeople, thedate, apiID } = parsed.data;

  if (apiID !== "0x574144") {
    return res.status(403).json({ error: "invalid apiID" });
  }

  try {
    // 🔍 DEBUG (you can remove later)
    console.log("Looking for:", accID, thedate);

    const check = db.prepare(`
      SELECT availability FROM acc_dates
      WHERE accID = ? AND CAST(thedate AS INTEGER) = ?
    `).get(accID, thedate);

    console.log("DB result:", check);

    if (!check) {
      return res.status(404).json({
        error: "No availability for this date"
      });
    }

    // Insert booking
    db.prepare(`
      INSERT INTO acc_bookings (accID, thedate, userID, npeople)
      VALUES (?, ?, ?, ?)
    `).run(accID, thedate, 1, npeople);

    // Update availability
    db.prepare(`
      UPDATE acc_dates
      SET availability = availability - ?
      WHERE accID = ? AND CAST(thedate AS INTEGER) = ?
    `).run(npeople, accID, thedate);

    res.json({ message: "booking successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "booking failed" });
  }
});

export default router;