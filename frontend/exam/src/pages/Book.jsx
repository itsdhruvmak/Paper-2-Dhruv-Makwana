import React, { useEffect, useState } from 'react';
import { allBooks, createBook, getBook, updateBook, deleteBook } from '../services/book';

const Book = () => {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);

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

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;

        try {
            await deleteBook(id);
            fetchBooks();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <h3>{editingId ? "Edit Book" : "Add Book"}</h3>

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                /><br />

                <input
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    onChange={handleChange}
                /><br />

                <input
                    name="genre"
                    placeholder="Genre"
                    value={form.genre}
                    onChange={handleChange}
                /><br />

                <input
                    name="isbn"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={handleChange}
                /><br />

                <input
                    name="publicationYear"
                    placeholder="Publication Year"
                    value={form.publicationYear}
                    onChange={handleChange}
                /><br />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                ></textarea><br />

                <button type="submit">
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
                    }}>
                        Cancel
                    </button>
                )}
            </form>

            {/* Book List */}
            <div>
                <h3>Book List</h3>
                {books.length === 0 && <p>No books found</p>}

                <ul>
                    {books.map((b) => (
                        <li key={b._id} style={{ marginBottom: "10px" }}>
                            <strong>{b.title}</strong> — {b.author} ({b.genre})

                            <button onClick={() => handleEdit(b._id)} style={{ marginLeft: "10px" }}>
                                Edit
                            </button>

                            <button onClick={() => handleDelete(b._id)} style={{ marginLeft: "5px" }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default Book;
