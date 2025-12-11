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
    const [selectedIds, setSelectedIds] = useState([]); // array of selected book ids

    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        publicationYear: "",
        description: "",
        isbn: ""
    });

    // Fetch all books
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

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit (Create / Update)
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

            // Refresh list
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

    // Edit handler
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

    // Delete single handler
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;

        try {
            await deleteBook(id);
            // remove from selectedIds if present
            setSelectedIds(prev => prev.filter(x => x !== id));
            fetchBooks();
        } catch (error) {
            console.log(error);
        }
    };

    // Selection handlers for bulk delete
    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isAllSelected = books.length > 0 && selectedIds.length === books.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(books.map(b => b._id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one book to delete.");
            return;
        }

        if (!window.confirm(`Delete ${selectedIds.length} selected book(s)?`)) return;

        try {
            const res = await bulkDeleteBooks(selectedIds);
            alert(res.message || `${res.deletedCount || selectedIds.length} books deleted`);
            setSelectedIds([]);
            fetchBooks();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Bulk delete failed");
        }
    };

    return (
        <div className='min-h-screen p-4'>
            <div className='flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='flex flex-col m-6 md:m-10 border-2 border-black p-6 w-full max-w-xl'>
                    <h3 className='mb-2 text-lg'>{editingId ? "Edit Book" : "Add Book"}</h3>

                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    />

                    <input
                        name="author"
                        placeholder="Author"
                        value={form.author}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    />

                    <input
                        name="genre"
                        placeholder="Genre"
                        value={form.genre}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    />

                    <input
                        name="isbn"
                        placeholder="ISBN"
                        value={form.isbn}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    />

                    <input
                        name="publicationYear"
                        placeholder="Publication Year"
                        value={form.publicationYear}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className='border p-2 mb-2'
                    ></textarea>

                    <div className='flex gap-2'>
                        <button type="submit" className='bg-black text-white px-3 py-1 rounded'>
                            {editingId ? "Update" : "Add"}
                        </button>

                        {editingId && (
                            <button type="button" onClick={() => {
                                setEditingId(null);
                                setForm({
                                    title: "",
                                    author: "",
                                    genre: "",
                                    publicationYear: "",
                                    description: "",
                                    isbn: ""
                                });
                            }} className='px-3 py-1 border rounded'>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Book List + Bulk actions */}
            <div className='mt-6 max-w-4xl mx-auto'>
                <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-lg font-medium'>Book List</h3>

                    <div className='flex items-center gap-2'>
                        <label className='flex items-center gap-1'>
                            <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
                            <span className='text-sm'>Select All</span>
                        </label>

                        {selectedIds.length > 0 && (
                            <button onClick={handleBulkDelete} className='bg-red-600 text-white px-3 py-1 rounded'>
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>

                {books.length === 0 && <p>No books found</p>}

                <ul>
                    {books.map((b) => (
                        <li key={b._id} className='mb-3 flex items-start gap-3'>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(b._id)}
                                    onChange={() => toggleSelect(b._id)}
                                />
                            </label>

                            <div className='flex-1'>
                                <strong>{b.title}</strong> — {b.author} ({b.genre})
                            </div>

                            <div className='flex items-center gap-2'>
                                <button onClick={() => handleEdit(b._id)} className='px-2 py-1 border rounded text-sm'>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(b._id)} className='px-2 py-1 border rounded text-sm'>
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
