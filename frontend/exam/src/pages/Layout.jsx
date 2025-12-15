import React, { useEffect, useState } from 'react'
import { allBooks, getBook, searchBooks } from '../services/book';
import { borrowBook, returnBook } from '../services/borrow';

const Layout = () => {
    const [books, setBooks] = useState([]);
    const [selected, setSelected] = useState(null);

    const [filters, setFilters] = useState({
        title: "",
        author: "",
        genre: "",
        status: "",
        year: "",
        logic: "and"
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await allBooks();
                setBooks(res.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const loadBooks = async () => {
        const res = await allBooks();
        setBooks(res.data);
    };

    const openModal = async (id) => {
        const res = await getBook(id)
        setSelected(res.data)
    };

    const closeModal = () => setSelected(null)

    const handleBorrow = async (id) => {
        try {
            await borrowBook(id);
            alert("Book borrowed successfully");
            closeModal();
            loadBooks();
        } catch (error) {
            alert(error.response?.data?.message || "Error borrowing book");
        }
    };

    const handleReturn = async (id) => {
        try {
            await returnBook(id);
            alert("Book returned");
            closeModal();
            loadBooks();
        } catch (error) {
            alert(error.response?.data?.message || "Error returning book");
        }
    };

    const handleSearch = async () => {
        try {
            const res = await searchBooks(filters);
            setBooks(res.data);
        } catch (error) {
            alert("Error applying filters", error);
        }
    };

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <h2 className='text-2xl font-semibold mb-6'>📚 Book Library</h2>

            {/* SEARCH + FILTER */}
            <div className='bg-white rounded-xl shadow p-5 mb-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <input
                        type='text'
                        name='title'
                        placeholder='Search by title'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.title}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        name='author'
                        placeholder='Search by author'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.author}
                        onChange={handleChange}
                    />

                    <select
                        name='genre'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.genre}
                        onChange={handleChange}
                    >
                        <option value=''>Genre</option>
                        <option value='Fiction'>Fiction</option>
                        <option value='Science'>Science</option>
                        <option value='Technology'>Technology</option>
                        <option value='History'>History</option>
                        <option value='Fantasy'>Fantasy</option>
                    </select>

                    <select
                        name='status'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.status}
                        onChange={handleChange}
                    >
                        <option value=''>Status</option>
                        <option value='Available'>Available</option>
                        <option value='Borrowed'>Borrowed</option>
                    </select>

                    <input
                        type='number'
                        name='year'
                        placeholder='Publication year'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.year}
                        onChange={handleChange}
                    />

                    <select
                        name='logic'
                        className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                        value={filters.logic}
                        onChange={handleChange}
                    >
                        <option value='and'>AND</option>
                        <option value='or'>OR</option>
                    </select>

                    <button
                        className='md:col-span-3 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition'
                        onClick={handleSearch}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* BOOK LIST */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {books.map((b) => (
                    <div
                        key={b._id}
                        onClick={() => openModal(b._id)}
                        className='bg-white rounded-xl shadow p-4 cursor-pointer
                        hover:shadow-lg hover:-translate-y-1 transition-all'
                    >
                        <h3 className='font-semibold text-lg'>{b.title}</h3>
                        <p className='text-sm text-gray-600'>{b.author}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded
                            ${b.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"}`}>
                            {b.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white w-full max-w-sm rounded-xl shadow-lg p-6 relative'>
                        <h3 className='text-xl font-semibold mb-2'>{selected.title}</h3>
                        <p className='text-sm text-gray-600'>Author: {selected.author}</p>
                        <p className='text-sm text-gray-600'>Genre: {selected.genre}</p>
                        <p className='text-sm text-gray-600'>ISBN: {selected.isbn}</p>

                        <p className='text-sm mt-3 text-gray-700'>
                            {selected.description}
                        </p>

                        <div className='mt-5 flex gap-3'>
                            {selected.status === "Available" ? (
                                <button
                                    className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
                                    onClick={() => handleBorrow(selected._id)}
                                >
                                    Borrow
                                </button>
                            ) : (
                                <button
                                    className='flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition'
                                    onClick={() => handleReturn(selected._id)}
                                >
                                    Return
                                </button>
                            )}

                            <button
                                className='flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition'
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Layout;
