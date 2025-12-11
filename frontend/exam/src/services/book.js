import api from "./api";

export const createBook = async (data) => {
    const res = await api.post("/book/add-book", data)
    return res.data;
}

export const updateBook = async (id, data) => {
    const res = await api.put(`/book/update/${id}`, data)
    return res.data
}

export const deleteBook = async (id) => {
    const res = await api.delete(`/book/delete/${id}`)
    return res.data
}

export const getBook = async (id) => {
    const res = await api.get(`/book/get-book/${id}`)
    return res.data
}

export const allBooks = async () => {
    const res = await api.get("/book/all-books")
    return res.data
}


export const searchBooks = async (filters) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            params.append(key, filters[key])
        }
    })
    const res = await api.get(`/book/search?${params.toString()}`)
    return res.data
}

export const bulkDeleteBooks = async (bookIds) => {
    const res = await api.post("/book/bulk-delete", { bookIds })
    return res.data
}