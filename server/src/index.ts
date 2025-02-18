import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import connectDB from "./config/db";
import allRoutes from "./routes/route"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({ origin: "*", credentials: true }));

app.use("/api", allRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
