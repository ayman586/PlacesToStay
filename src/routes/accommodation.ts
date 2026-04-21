import { Router } from "express";
import { db } from "../db";
import { z } from "zod";

const router = Router();

router.get("/", (req, res) => {
  const location = (req.query.location as string)?.trim();

  if (!location) {
    return res.status(400).json({ error: "location is required" });
  }

  try {
    const stmt = db.prepare(`
      SELECT * FROM accommodation
      WHERE LOWER(location) LIKE LOWER('%' || ? || '%')
    `);

    const results = stmt.all(location);

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});


router.get("/search", (req, res) => {
  const location = (req.query.location as string)?.trim();
  const type = (req.query.type as string)?.trim();

  if (!location || !type) {
    return res.status(400).json({
      error: "location and type are required"
    });
  }

  try {
    const stmt = db.prepare(`
      SELECT * FROM accommodation
      WHERE LOWER(location) LIKE LOWER('%' || ? || '%')
      AND LOWER(type) = LOWER(?)
    `);

    const results = stmt.all(location, type);

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});


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

    const check = db.prepare(`
      SELECT availability FROM acc_dates
      WHERE accID = ? AND thedate = ?
    `).get(accID, thedate);

    if (!check) {
      return res.status(404).json({
        error: "No availability for this date"
      });
    }

  
    db.prepare(`
      INSERT INTO acc_bookings (accID, thedate, userID, npeople)
      VALUES (?, ?, ?, ?)
    `).run(accID, thedate, 1, npeople);

  
    db.prepare(`
      UPDATE acc_dates
      SET availability = availability - ?
      WHERE accID = ? AND thedate = ?
    `).run(npeople, accID, thedate);

    return res.json({ message: "booking successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "booking failed" });
  }
});

export default router;