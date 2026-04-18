import { Router } from "express";
import { db } from "../db";
import { z } from "zod";

const router = Router();

// Validation
const locationSchema = z.string().min(1);

// GET /accommodation?location=London
router.get("/", (req, res) => {
  const parsed = locationSchema.safeParse(req.query.location);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Location is required and must be a string"
    });
  }

  const location = parsed.data;

  try {
    const stmt = db.prepare(
      `SELECT * FROM accommodation WHERE location LIKE ?`
    );

    const results = stmt.all(`%${location}%`);

    res.json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error"
    });
  }
});

export default router;