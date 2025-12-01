import { bookReturned, borrowHistory, findBook } from "../module/borrowModule.js";


export const borrowBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookId = req.params.id;

        if (userRole !== "User") {
            return res.status(403).json({ message: "Only users can borrow books" });
        }

        const book = await findBook(bookId)
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.status !== "Available") {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 7)

        book.status = "Borrowed"
        book.borrowedBy = userId
        book.dueDate = dueDate

        await book.save()

        await borrowHistory(userId, bookId, dueDate)

        return res.status(200).json({
            message: "Book borrowed successfully",
            data: book
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const returnBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookId = req.params.id;

        if (userRole !== "User") {
            return res.status(403).json({ message: "Only users can return books" });
        }

        const book = await findBook(bookId)

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.borrowedBy?.toString() !== userId) {
            return res.status(400).json({ message: "You have not borrowed this book" });
        }

        book.status = "Available";
        book.borrowedBy = null;
        book.dueDate = null;
        await book.save();

        await bookReturned(userId, bookId)

        return res.status(200).json({
            message: "Book returned successfully",
            data: book
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}