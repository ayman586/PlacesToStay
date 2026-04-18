import express from "express";
import accommodationRoutes from "./routes/accommodation";

const app = express();

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.send("PlacesToStay API is running 🚀");
});

// Routes
app.use("/accommodation", accommodationRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});