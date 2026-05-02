import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//sign up a new user 
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({
                success: false,
                message: "please fill all the input fields"
            });
        }

        const user = await User.findOne({ email: email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            bio: bio,
        });

        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal Server Error" });
    }
};

//controller to login a user 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email: email });

        if (!userData) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(userData._id);

        res.json({ success: true, userData: userData, token, message: "Login successful" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal Server Error" });
    }
};

//controller to update user profile details 
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profilePic, fullName, bio } = req.body;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true }).select("-password");
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                fullName,
                bio
            }, { new: true }).select("-password");
        }
        res.json({ success: true, updatedData: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};