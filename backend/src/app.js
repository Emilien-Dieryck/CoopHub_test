import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// Middleware global d'erreurs
app.use(errorHandler);

export default app;
