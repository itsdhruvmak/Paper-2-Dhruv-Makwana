import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    borrowedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
    dueDate: { type: Date },
    status: { type: String, enum: ["Borrowed", "Returned"], default: "Borrowed" }
}, { timestamps: true })

const Borrow = mongoose.model("Borrow", borrowSchema)

export default Borrow;