// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import router from "./routes/index.js";
// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import cors from "cors";
// import cookieParser from "cookie-parser";


// // Get the directory name of the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Explicitly set the path to the .env file in the project root
// const envPath = path.resolve(__dirname, '..', '.env');

// console.log("Loading .env from:", envPath);

// dotenv.config({ path: envPath });



// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "/client/dist")));


// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });



// const PORT = process.env.PORT || 3000;

// connectDB()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log("Connected to DB");
//             console.log("Server is running on port " + PORT);
//         });
//     })
//     .catch((error) => {
//         console.error("Failed to connect to DB", error);
// });

// app.use("/api", router);

// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Internal Server Error";
//     console.error("Error:", message, "Details:", err);  // Log the error for debugging
//     res.status(statusCode).json({
//         success: false,
//         statusCode,
//         message,
//     });
// });


// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import router from "./routes/index.js";
// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // Get the directory name of the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Explicitly set the path to the .env file in the project root
// const envPath = path.resolve(__dirname, '..', '.env');

// console.log("Loading .env from:", envPath);

// dotenv.config({ path: envPath });

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// // Static files path correction
// const clientPath = path.join(__dirname, "..", "client", "dist");
// app.use(express.static(clientPath));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(clientPath, "index.html"));
// });

// const PORT = process.env.PORT || 3000;

// connectDB()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log("Connected to DB");
//             console.log("Server is running on port " + PORT);
//         });
//     })
//     .catch((error) => {
//         console.error("Failed to connect to DB", error);
//     });

// app.use("/api", router);

// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Internal Server Error";
//     console.error("Error:", message, "Details:", err);  // Log the error for debugging
//     res.status(statusCode).json({
//         success: false,
//         statusCode,
//         message,
//     });
// });

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";
import cookieParser from "cookie-parser";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly set the path to the .env file in the project root
const envPath = path.resolve(__dirname, '..', '.env');

console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API routes should be defined before static file serving
app.use("/api", router);

const clientPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientPath));

app.get("*", (req, res) => {
    const indexPath = path.join(clientPath, "index.html");
    console.log("Attempting to serve file from:", indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Failed to send index.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

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
