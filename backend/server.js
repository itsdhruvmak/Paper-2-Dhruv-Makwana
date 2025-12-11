import express from 'express'
import dotenv from "dotenv"
import connectDB from './database/config/db.js'
import cors from 'cors'
import authRouter from './module/v1/auth/routes/authRoutes.js'
import bookRouter from './module/v1/book/routes/bookRoutes.js'
import borrowRouter from './module/v1/borrow/routes/borrowRoute.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())

app.use(cors({
    origin: "https://paper-2-dhruv-makwana.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/book", bookRouter)
app.use("/api/borrow", borrowRouter)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Hey i'm here on PORT ${PORT}`);
    })
})