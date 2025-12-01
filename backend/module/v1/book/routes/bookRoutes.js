import express from 'express'
import { createBook, deleteBook, getAllBooks, getBook, updateBook } from '../controllers/bookController.js'
import { verifyToken } from '../../../../middleware/authMiddleware.js'

const router = express.Router()

router.post("/add-book", verifyToken, createBook)
router.put("/update/:id", verifyToken, updateBook)
router.delete("/delete/:id", verifyToken, deleteBook)
router.get("/all-books", verifyToken, getAllBooks)
router.get("/get-book/:id", verifyToken, getBook)

export default router