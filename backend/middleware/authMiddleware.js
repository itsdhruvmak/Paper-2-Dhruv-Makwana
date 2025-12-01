import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Token not provided" })
        }

        const token = authHeader.split(" ")[1].replace(/"/g, "")

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        req.user = {
            id: decoded.id,
            role: decoded.role
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}