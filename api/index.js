import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";  // Import cors

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly set the path to the .env file in the project root
const envPath = path.resolve(__dirname, '..', '.env');

console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });

const app = express();
app.use(express.json());
// app.use(cors());  // Use cors middleware

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Connected to DB");
            console.log("Server is running on port " + PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to DB", error);
});

app.use("/api", router);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error:", message, "Details:", err);  // Log the error for debugging
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

