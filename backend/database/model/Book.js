import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    isbn: { type: String },
    publicationYear: { type: Number },
    coverImage: { type: String },
    description: { type: String },
    status: { type: String, enum: ["Available", "Borrowed"], default: "Available" },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null }
}, { timestamps: true })

const Book = mongoose.model("Book", bookSchema)

export default Book;