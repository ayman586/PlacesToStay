import { Router } from "express";
import { db } from "../db";

const router = Router();

router.post("/", (req, res) => {

    const { accID, thedate, npeople, apiID } = req.body;

    if (!accID || !thedate || !npeople) {
        return res.status(400).json({
            error: "Missing booking data"
        });
    }

    if (apiID !== "0x574144") {
        return res.status(403).json({
            error: "Invalid API ID"
        });
    }
    try{
          const insertBooking = `
        INSERT INTO acc_bookings (accID, thedate, userID, npeople)
        VALUES (?, ?, 1, ?)

    `;

    db.prepare(insertBooking).run(accID, thedate, npeople);
      return res.json({
            message: "Booking successful"
        });

    } catch (err) {
        return res.status(500).json({
            error: "Database error",
            details: err
        });
    }
});

export default router;