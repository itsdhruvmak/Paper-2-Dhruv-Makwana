import { GENRES } from "../../../../constants/genres.js";
import { addBook, allBooks, editBook, findBook, removeBook } from "../modules/bookModule.js";

export const createBook = async (req, res) => {
    try {
        const bookData = req.body
        const userId = req.user.id
        const userRole = req.user.role;
        console.log(userRole);


        if (userRole !== "Admin") {
            return res.status(403).json({ message: "Admin can add book, user cannot" })
        }

        if (!userId) return res.status(400).json({ message: "User not found" })

        if (!GENRES.includes(bookData.genre)) {
            return res.status(400).json({ message: "Invalid genre" })
        }

        const savedBook = await addBook(bookData)

        return res.status(201).json({ message: "Book created", data: savedBook })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const updateBook = async (req, res) => {
    try {
        const bookData = req.body
        const bookId = req.params.id
        const userRole = req.user.role

        if (userRole !== "Admin") {
            return res.status(400).json({ message: "Only admin can update a books" })
        }

        if (bookData.genre && !GENRES.includes(bookData.genre)) {
            return res.status(400).json({ message: "Genre not found" })
        }

        const changedBook = await editBook(bookId, bookData)

        return res.status(201).json({ message: "Book updated successfully", data: changedBook })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const deleteBook = async (req, res) => {
    try {
        const userRole = req.user.role
        const bookId = req.params.id

        if (userRole !== "Admin") {
            return res.status(400).json({ message: "Only admin can delete a book" })
        }

        const book = await findBook(bookId)
        if (!book) return res.status(400).json({ message: "Book not found" })

        await removeBook(bookId)

        return res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getAllBooks = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) return res.status(409).json({ message: "User is not authorized" })

        const book = await allBooks()

        return res.status(200).json({ message: "All books are here", data: book })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getBook = async (req, res) => {
    try {
        const bookId = req.params.id
        const userId = req.user.id

        if (!userId) return res.status(409).json({ message: "User is not authorized" })

        const book = await findBook(bookId)

        return res.status(200).json({ message: "here's the particular blog", data: book })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}