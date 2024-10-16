import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const AdminManageBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        // Fetch the list of books
        axios.get('https://final-project-backend-production-31fa.up.railway.app/api/book/getBooksDto', {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the books!', error);
            });
    }, [authToken]);

    const handleDeleteBook = async (bookId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://final-project-backend-production-31fa.up.railway.app/api/book/deleteBookAsAdmin?bookId=${bookId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                setBooks(books.filter(book => book.bookId !== bookId)); // Remove the deleted book from the list
                setPopupMessage('Book deleted successfully.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            } catch (error) {
                console.error('There was an error deleting the book!', error);
                setPopupMessage('Failed to delete book. Please try again.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }
        }
    };

    const filteredBooks = books.filter(book => {
        const combinedContent = `${book.title} ${book.author} ${book.publishYear} ${book.isbn}`;
        return combinedContent.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Manage Existing Books</h2>
            {showPopup && (
                <div className="alert alert-info" role="alert">
                    {popupMessage}
                </div>
            )}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by book name, author, year, ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Publish Year</th>
                    <th>ISBN</th>
                    <th>Number of Reviews</th> {/* New column */}
                    <th>Rating</th> {/* New column */}
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publishYear}</td>
                            <td>{book.isbn}</td>
                            <td>{book.numberOfReviews}</td> {/* Number of Reviews */}
                            <td>{book.overallRating}</td> {/* Rating */}
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteBook(book.bookId)}
                                >
                                    Delete Book
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">No books available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminManageBooksPage;
