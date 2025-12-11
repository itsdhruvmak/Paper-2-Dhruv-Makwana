import { generateRefreshToken } from "../../../../utils/jwt.js"
import { findSocialUser, findUserByEmail } from "../modules/authModule.js"
import bcrypt from 'bcrypt'
import { createUser } from "../modules/authModule.js"

export const userSignup = async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const validRoles = ["User", "Admin"];
        userData.role = userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase();

        if (!validRoles.includes(userData.role)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        if (userData.loginType !== "N" && !userData.socialId) {
            return res.status(400).json({ message: "Social signup requires social id" });
        }

        if (userData.loginType === "N" && (!userData.email || !userData.password)) {
            return res.status(400).json({ message: "Email and password are required for normal signup" });
        }

        if (userData.loginType === "N") {
            const existingUser = await findUserByEmail(userData.email);
            if (existingUser) {
                return res.status(400).json({ message: "User already registered with this email" });
            }
        } else {
            const existingUser = await findSocialUser(userData.loginType, userData.socialId);
            if (existingUser) {
                return res.status(400).json({ message: "User already registered with this social id" });
            }
        }

        const savedUser = await createUser(userData);
        const refreshToken = generateRefreshToken(savedUser);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username,
                role: savedUser.role
            },
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const userLogin = async (req, res) => {
    try {
        const { loginType, socialId, email, password, role } = req.body;

        let user;

        // Normal Login Validation
        if (loginType === "N" && (!email || !password)) {
            return res.status(400).json({ message: "Email and password are required for normal login" });
        }

        if (loginType === "N") {
            user = await findUserByEmail(email);
            if (!user) {
                return res.status(400).json({ message: "User not found, please register first" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }
        }
        // Social Login
        else {
            user = await findSocialUser(loginType, socialId);
            if (!user) {
                return res.status(400).json({ message: "Social ID not found, please register first" });
            }
        }

        // Role Check 
        if (role && user.role && user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).json({ message: "You are not authorized to login with this role" });
        }

        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
