import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", (req, res) => {
    const location = req.query.location as string;

    if (!location) {
        return res.status(400).json({ error: "location required" });
    }
 try {
    const sql = `
        SELECT * FROM accommodation
        WHERE location = ?
    `;
const stmt = db.prepare(sql);
        const rows = stmt.all(location);

        res.json(rows);
 } catch (err) {
     res.status(500).json({ error: "Database error", details: err });
 }
    });


router.get("/type", (req, res) => {
     const location = req.query.location as string;
    const type = req.query.type as string;

    if (!location || !type) {
        return res.status(400).json({ error: "missing params" });
    }
try{
    const sql = `
        SELECT * FROM accommodation
        WHERE location = ? AND type = ?
    `;
        const stmt = db.prepare(sql);
        const rows = stmt.all(location, type);
   
        res.json(rows);
}catch(err){
     res.status(500).json({ error: "Database error", details: err });
}
    });


export default router;