import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
import { deleteUser, getUsers, signout, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { create, deletepost, getposts, updatepost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/google", google);
router.post("/signout",signout);


router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/post/create", verifyToken, create);
router.get("/post/getposts",getposts)
router.delete("/post/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/post/updatepost/:postId/:userId", verifyToken, updatepost)
router.get("/user/getusers", verifyToken, getUsers)

export default router;
