import Book from "../../../../database/model/Book.js"


export const addBook = async (bookData) => {
    const newBook = new Book(bookData)
    return await newBook.save()
}

export const editBook = async (bookId, bookData) => {
    return await Book.findByIdAndUpdate(bookId, { ...bookData },
        { new: true, runValidators: true }
    )
}

export const removeBook = async (bookId) => {
    return await Book.findByIdAndDelete(bookId)
}

export const findBook = async (bookId) => {
    return Book.findById(bookId)
}

export const allBooks = async () => {
    return Book.find()
}
