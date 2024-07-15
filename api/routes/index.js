import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/google", google);

router.put("/update/:userId", verifyToken, updateUser);



export default router;
