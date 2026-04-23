import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./places.db", (err) => {
    if (err) {
        console.error("DB error:", err.message);
    } else {
        console.log("SQLite connected");
    }
});