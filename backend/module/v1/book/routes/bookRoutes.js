import express from 'express'
import { bulkDelete, createBook, deleteBook, getAllBooks, getBook, searchBooks, updateBook } from '../controllers/bookController.js'
import { verifyToken } from '../../../../middleware/authMiddleware.js'

const router = express.Router()

router.post("/add-book", verifyToken, createBook)
router.put("/update/:id", verifyToken, updateBook)
router.delete("/delete/:id", verifyToken, deleteBook)
router.get("/all-books", verifyToken, getAllBooks)
router.get("/get-book/:id", verifyToken, getBook)
router.get("/search", searchBooks)
router.post("/bulk-delete", verifyToken, bulkDelete)

export default router