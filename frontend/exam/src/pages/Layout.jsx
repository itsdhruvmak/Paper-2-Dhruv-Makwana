import React, { useEffect, useState } from 'react'
import { allBooks, getBook, searchBooks } from '../services/book';
import { borrowBook, returnBook } from '../services/borrow';

const Layout = () => {
    const [books, setBooks] = useState([]);
    const [selected, setSelected] = useState(null);

    // Search + filters
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

    // 🔍 Handle Search & Filtering
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
        <div className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Book Library</h2>

            {/* 🔍 SEARCH + FILTER SECTION */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
                <input
                    type='text'
                    name='title'
                    placeholder='Search by title'
                    className='border p-2 rounded'
                    value={filters.title}
                    onChange={handleChange}
                />

                <input
                    type='text'
                    name='author'
                    placeholder='Search by author'
                    className='border p-2 rounded'
                    value={filters.author}
                    onChange={handleChange}
                />

                <select
                    name='genre'
                    className='border p-2 rounded'
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
                    className='border p-2 rounded'
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
                    className='border p-2 rounded'
                    value={filters.year}
                    onChange={handleChange}
                />

                <select
                    name='logic'
                    className='border p-2 rounded'
                    value={filters.logic}
                    onChange={handleChange}
                >
                    <option value='and'>AND</option>
                    <option value='or'>OR</option>
                </select>

                <button
                    className='bg-black text-white p-2 rounded'
                    onClick={handleSearch}
                >
                    Apply Filters
                </button>
            </div>

            {/* BOOK LIST */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {books.map((b) => (
                    <div key={b._id} className='border p-4 rounded cursor-pointer hover:bg-gray-50'
                        onClick={() => openModal(b._id)}>
                        <h3 className='font-medium'>{b.title}</h3>
                        <p className='text-sm text-gray-600'>{b.author}</p>
                        <p className='text-xs text-gray-500'>Status: {b.status}</p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (
                <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center'>
                    <div className='bg-white w-80 p-4 rounded shadow'>
                        <h3 className='text-lg font-semibold'>{selected.title}</h3>
                        <p className='text-sm'>Author: {selected.author}</p>
                        <p className='text-sm'>Genre: {selected.genre}</p>
                        <p className='text-sm'>ISBN: {selected.isbn}</p>
                        <p className='text-sm mt-2'>{selected.description}</p>

                        <div className='mt-4 flex gap-2'>
                            {selected.status === "Available" ? (
                                <button className='bg-blue-600 text-white px-3 py-1 rounded'
                                    onClick={() => handleBorrow(selected._id)}>
                                    Borrow
                                </button>
                            ) : (
                                <button className='bg-green-600 text-white px-3 py-1 rounded'
                                    onClick={() => handleReturn(selected._id)}>
                                    Return
                                </button>
                            )}

                            <button className='bg-gray-400 px-3 py-2 text-white rounded'
                                onClick={closeModal}>
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
