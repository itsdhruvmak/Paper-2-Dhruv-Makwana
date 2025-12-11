import api from "./api";

export const borrowBook = async (bookId) => {
    const res = await api.post(`/api/borrow/borrow-book/${bookId}`);
    return res.data
}

export const returnBook = async (bookId) => {
    const res = await api.post(`/api/borrow/return-book/${bookId}`)
    return res.data
}