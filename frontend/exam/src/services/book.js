import api from "./api";

export const createBook = async (data) => {
    const res = await api.post("/api/book/add-book", data)
    return res.data;
}

export const updateBook = async (id, data) => {
    const res = await api.put(`/api/book/update/${id}`, data)
    return res.data
}

export const deleteBook = async (id) => {
    const res = await api.delete(`/api/book/delete/${id}`)
    return res.data
}

export const getBook = async (id) => {
    const res = await api.get(`/api/book/get-book/${id}`)
    return res.data
}

export const allBooks = async () => {
    const res = await api.get("/api/book/all-books")
    return res.data
}


export const searchBooks = async (filters) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            params.append(key, filters[key])
        }
    })
    const res = await api.get(`/api/book/search?${params.toString()}`)
    return res.data
}

export const bulkDeleteBooks = async (bookIds) => {
    const res = await api.post("/api/book/bulk-delete", { bookIds })
    return res.data
}