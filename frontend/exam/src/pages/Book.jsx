import React, { useEffect, useState } from 'react';
import {
    allBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    bulkDeleteBooks
} from '../services/book';

const Book = () => {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        publicationYear: "",
        description: "",
        isbn: ""
    });

    const fetchBooks = async () => {
        try {
            const res = await allBooks();
            setBooks(res.data);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch books");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateBook(editingId, form);
                alert("Book updated");
            } else {
                await createBook(form);
                alert("Book added");
            }

            setForm({
                title: "",
                author: "",
                genre: "",
                publicationYear: "",
                description: "",
                isbn: ""
            });
            setEditingId(null);
            fetchBooks();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error");
        }
    };

    const handleEdit = async (id) => {
        try {
            const res = await getBook(id);
            const b = res.data;

            setForm({
                title: b.title || "",
                author: b.author || "",
                genre: b.genre || "",
                publicationYear: b.publicationYear || "",
                description: b.description || "",
                isbn: b.isbn || ""
            });
            setEditingId(id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            await deleteBook(id);
            setSelectedIds(prev => prev.filter(x => x !== id));
            fetchBooks();
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isAllSelected = books.length > 0 && selectedIds.length === books.length;

    const toggleSelectAll = () => {
        setSelectedIds(isAllSelected ? [] : books.map(b => b._id));
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one book to delete.");
            return;
        }

        if (!window.confirm(`Delete ${selectedIds.length} selected book(s)?`)) return;

        try {
            const res = await bulkDeleteBooks(selectedIds);
            alert(res.message || "Books deleted");
            setSelectedIds([]);
            fetchBooks();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Bulk delete failed");
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            {/* Form */}
            <div className='flex justify-center'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-3'
                >
                    <h3 className='text-xl font-semibold mb-2'>
                        {editingId ? "Edit Book" : "Add Book"}
                    </h3>

                    {["title", "author", "genre", "isbn", "publicationYear"].map(field => (
                        <input
                            key={field}
                            name={field}
                            placeholder={field.replace(/([A-Z])/g, " $1")}
                            value={form[field]}
                            onChange={handleChange}
                            className='w-full border rounded-lg px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-black'
                        />
                    ))}

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 min-h-[80px]
                        focus:outline-none focus:ring-2 focus:ring-black'
                    />

                    <div className='flex gap-3 pt-2'>
                        <button
                            type="submit"
                            className='bg-black text-white px-5 py-2 rounded-lg
                            hover:bg-gray-900 transition'
                        >
                            {editingId ? "Update" : "Add"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({
                                        title: "",
                                        author: "",
                                        genre: "",
                                        publicationYear: "",
                                        description: "",
                                        isbn: ""
                                    });
                                }}
                                className='border px-5 py-2 rounded-lg hover:bg-gray-100 transition'
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Book List */}
            <div className='mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold'>Book List</h3>

                    <div className='flex items-center gap-3'>
                        <label className='flex items-center gap-2 text-sm'>
                            <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
                            Select All
                        </label>

                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className='bg-red-600 text-white px-4 py-1.5 rounded-lg
                                hover:bg-red-700 transition'
                            >
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>

                {books.length === 0 && (
                    <p className='text-gray-500 text-sm'>No books found</p>
                )}

                <ul className='space-y-3'>
                    {books.map((b) => (
                        <li
                            key={b._id}
                            className='flex items-start gap-3 p-4 border rounded-lg
                            hover:bg-gray-50 transition'
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(b._id)}
                                onChange={() => toggleSelect(b._id)}
                            />

                            <div className='flex-1'>
                                <p className='font-semibold'>{b.title}</p>
                                <p className='text-sm text-gray-600'>
                                    {b.author} • {b.genre}
                                </p>
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    onClick={() => handleEdit(b._id)}
                                    className='px-3 py-1 text-sm border rounded-lg hover:bg-gray-100'
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(b._id)}
                                    className='px-3 py-1 text-sm border rounded-lg hover:bg-red-50 text-red-600'
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Book;
