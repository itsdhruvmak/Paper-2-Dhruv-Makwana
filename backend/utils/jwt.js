import jwt from "jsonwebtoken"

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
    )
}