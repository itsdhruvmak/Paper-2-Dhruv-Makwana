import Book from "../../../../database/model/Book.js"
import Borrow from "../../../../database/model/Borrow.js"

export const findBook = async (bookId) => {
    return Book.findById(bookId)
}

export const borrowHistory = async (userId, bookId, dueDate) => {
    return await Borrow.create({
        userId, bookId, dueDate, borrowedAt: new Date(), status: "Borrowed"
    })
}

export const bookReturned = async (userId, bookId) => {
    return await Borrow.findOneAndUpdate(
        { userId, bookId, status: "Borrowed" },
        {
            returnedAt: new Date(),
            status: "Returned"
        },
        { new: true }
    )
}