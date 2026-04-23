import express from "express";
import cors from "cors";

import accommodationRoutes from "./routes/accommodationRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/accommodation", accommodationRoutes);
app.use("/book", bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});