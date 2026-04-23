import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", (req, res) => {
    const location = req.query.location;

    if (!location) {
        return res.status(400).json({ error: "location required" });
    }

    const sql = `
        SELECT * FROM accommodation
        WHERE location = ?
    `;

    db.all(sql, [location], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

router.get("/type", (req, res) => {
    const { location, type } = req.query;

    if (!location || !type) {
        return res.status(400).json({ error: "missing params" });
    }

    const sql = `
        SELECT * FROM accommodation
        WHERE location = ? AND type = ?
    `;

    db.all(sql, [location, type], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

export default router;