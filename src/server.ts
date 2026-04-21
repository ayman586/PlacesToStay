import express from "express";
import path from "path";
import accommodationRoutes from "./routes/accommodation";

const app = express();

app.use(express.json());

/* serve PUBLIC folder */
app.use(express.static(path.join(__dirname, "../public")));

app.use("/accommodation", accommodationRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});