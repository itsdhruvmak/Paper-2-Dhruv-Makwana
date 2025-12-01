import express from 'express'
import { borrowBook, returnBook } from '../controller/borrowController.js'
import { verifyToken } from '../../../../middleware/authMiddleware.js'

const router = express.Router()

router.post("/borrow-book/:id", verifyToken, borrowBook)
router.post("/return-book/:id", verifyToken, returnBook)

export default router