import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("database/places.db");

export const db = new Database(dbPath, {
  verbose: console.log
});