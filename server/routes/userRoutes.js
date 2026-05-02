import express from "express";
import {login,signUp} from "../controllers/userControllers.js";
import {protectRoute} from "../middleware/auth.js"; 

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile);
userRouter.get("/check-auth",protectRoute,checkAuth);

export default userRouter;