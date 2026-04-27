import express from "express";
import cors from "cors";

import accommodationRoutes from "./routes/accommodationRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import authRoutes from "./routes/authRoutes";
import session from "express-session";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/accommodation", accommodationRoutes);
app.use("/book", bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});