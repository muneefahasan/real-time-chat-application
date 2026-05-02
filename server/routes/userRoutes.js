import express from "express";
import { login, signUp, updateProfile } from "../controllers/userControllers.js";
import { protectRoute, checkAuth } from "../middleware/auth.js"; 

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check-auth", protectRoute, checkAuth);

export default userRouter;