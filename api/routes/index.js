import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/google", google);



export default router;
