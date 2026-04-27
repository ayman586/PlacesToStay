import { Router } from "express";
import { db } from "../db";

const router = Router();

type DBUser = {
    id: number;
    username: string;
    password: string;
};

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    try {
        const stmt = db.prepare(
            "SELECT * FROM users WHERE username = ? AND password = ?"
        );

        const user = stmt.get(username, password) as DBUser | undefined;

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.user = {
            id: user.id,
            username: user.username
        };

        return res.json({
            message: "Login successful",
            user: user.username
        });

    } catch {
        return res.status(500).json({ error: "Server error" });
    }
});

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false });
    }

    return res.json({
        loggedIn: true,
        user: req.session.user.username
    });
});

export default router;