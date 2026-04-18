import express from "express";
import accommodationRoutes from "./routes/accommodation";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("PlacesToStay API is running 🚀");
});

/* Routes */
app.use("/accommodation", accommodationRoutes);

/* Debug test route (VERY USEFUL) */
app.get("/test", (_req, res) => {
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});