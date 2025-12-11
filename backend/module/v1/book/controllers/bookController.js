import { GENRES } from "../../../../constants/genres.js";
import Book from "../../../../database/model/Book.js";
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

export const searchBooks = async (req, res) => {
    try {
        let { title, author, genre, status, year, logic = "and" } = req.query;

        let conditions = [];

        // Case-insensitive title search
        if (title) {
            conditions.push({ title: { $regex: title, $options: "i" } });
        }

        // Case-insensitive author search
        if (author) {
            conditions.push({ author: { $regex: author, $options: "i" } });
        }

        // Genre (string match)
        if (genre) {
            conditions.push({ genre });
        }

        // Status fix for case sensitivity
        if (status) {
            status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            conditions.push({ status });
        }

        // Year
        if (year) {
            conditions.push({ publicationYear: Number(year) });
        }

        // No filter → return all
        if (conditions.length === 0) {
            const books = await Book.find();
            return res.status(200).json({ data: books });
        }

        // Build final query
        const query = logic === "or"
            ? { $or: conditions }
            : { $and: conditions };

        const books = await Book.find(query);

        return res.status(200).json({ data: books });

    } catch (error) {
        console.log("Search error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const bulkDelete = async (req, res) => {
    try {
        const userId = req.user.id
        const userRole = req.user.role
        const { bookIds } = req.body

        if (userRole !== "Admin") {
            return res.status(403).json({ message: "Only admin can delete books" })
        }

        if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
            return res.status(400).json({ message: "Book ids must be a non empty array" })
        }

        const result = await Book.deleteMany({ _id: { $in: bookIds } })

        return res.status(200).json({
            message: "Books deleted successfully",
            deletedCount: result.deletedCount
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}