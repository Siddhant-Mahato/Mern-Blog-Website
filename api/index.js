import express from "express";
import dotenv from "dotenv";
import connectDB from "../api/config/db.js"; // Ensure .js is added if needed
import router from "../api/routes/index.js";


dotenv.config();

const app = express();
app.use(express.json());


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
