import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const BookList = ({ books }) => {
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        if (authToken) {
            // Fetch user reviews if logged in
            axios.get('https://final-project-backend-production-31fa.up.railway.app/api/review/getUserReviews', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
                .then(response => {
                    console.log("User Reviews Fetched:", response.data);
                    setUserReviews(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the user reviews!', error);
                });
        }
    }, [authToken]);

    const filteredBooks = books.filter(book => {
        const searchString = `${book.title} ${book.author} ${book.publishYear} ${book.isbn}`.toLowerCase();
        return searchString.includes(searchQuery.toLowerCase());
    });

    const checkIfReviewed = (bookId) => {
        return userReviews.some(review => review.bookId === bookId);
    };

    const getReviewByBookId = (bookId) => {
        return userReviews.find(review => review.bookId === bookId);
    };

    const handleRowClick = (book) => {
        navigate(`/reviews/${book.bookId}`, { state: { bookTitle: book.title } });
    };

    return (
        <div>
            <h2 className="mb-4">Book List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by any field"
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
                    <th>Number of Reviews</th>
                    <th>Rating</th>
                    {authToken && <th>Action</th>} {/* Render "Action" column only if logged in */}
                </tr>
                </thead>
                <tbody>
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                        <tr
                            key={book.bookId}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRowClick(book)}
                        >
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publishYear}</td>
                            <td>{book.isbn}</td>
                            <td>{book.numberOfReviews}</td>
                            <td>{book.overallRating}</td>
                            {authToken && (
                                <td>
                                    {checkIfReviewed(book.bookId) ? (
                                        <button
                                            className="btn btn-warning"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents the row click event
                                                const review = getReviewByBookId(book.bookId);
                                                navigate(`/manage-review/${review.reviewId}`, {
                                                    state: {
                                                        reviewId: review.reviewId,
                                                        bookDetails: book, // Passing book details
                                                    },
                                                });
                                            }}
                                        >
                                            Edit Review
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents the row click event
                                                navigate('/add-review', {
                                                    state: {
                                                        bookId: book.bookId,
                                                        bookTitle: book.title,
                                                        bookAuthor: book.author,
                                                        bookYear: book.publishYear,
                                                        bookISBN: book.isbn,
                                                    },
                                                });
                                            }}
                                        >
                                            Add Review
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={authToken ? 7 : 6} className="text-center">No books available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;
