import { Router } from "express";
import { db } from "../db";

const router = Router();

router.post("/", (req, res) => {

    const { accID, thedate, npeople, apiID } = req.body;

    if (apiID !== "0x574144") {
        return res.status(403).json({ error: "Invalid API ID" });
    }

    if (!accID || !thedate || !npeople) {
        return res.status(400).json({ error: "Missing booking data" });
    }

    const insertBooking = `
        INSERT INTO acc_bookings (accID, thedate, userID, npeople)
        VALUES (?, ?, 1, ?)
    `;

    db.run(insertBooking, [accID, thedate, npeople], function (err) {
        if (err) return res.status(500).json(err);

        const updateAvailability = `
            UPDATE acc_dates
            SET availability = availability - ?
            WHERE accID = ? AND thedate = ?
        `;

        db.run(updateAvailability, [npeople, accID, thedate], function (err2) {
            if (err2) return res.status(500).json(err2);

            res.json({ message: "Booking successful" });
        });
    });
});

export default router;