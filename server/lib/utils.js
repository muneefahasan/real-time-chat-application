import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.js"

//function to generate a token for a user 
export const generateToken =(userId )=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET);
    return token;
    
}