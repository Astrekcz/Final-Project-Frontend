import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeButton from "./HomeButton";

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { authToken } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const books = location.state?.books || [];

    useEffect(() => {
        if (authToken) {
            axios.get('https://final-project-backend-production-31fa.up.railway.app/api/review/getUserReviews', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
                .then(response => {
                    setReviews(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching your reviews!', error);
                });
        }
    }, [authToken]);

    const getBookDetails = (bookName) => {
        return books.find(book => book.title === bookName);
    };

    const handleDeleteReview = (reviewId) => {
        console.log('Attempting to delete review with ID:', reviewId);

        if (authToken) {
            axios.delete(`https://final-project-backend-production-31fa.up.railway.app/api/review/deleteReviewAsUser?reviewId=${reviewId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            })
                .then(() => {
                    console.log('Review deleted successfully.');
                    setReviews(reviews.filter(review => review.reviewId !== reviewId));

                    setPopupMessage('Review was deleted successfully.');
                    setShowPopup(true);
                    window.history.replaceState({}, document.title);

                    setTimeout(() => {
                        setShowPopup(false);
                    }, 3000);
                })
                .catch(error => {
                    console.error('There was an error deleting the review!', error);

                    setPopupMessage('There was an error deleting the review.');
                    setShowPopup(true);
                    window.history.replaceState({}, document.title);

                    setTimeout(() => {
                        setShowPopup(false);
                    }, 3000);
                });
        } else {
            console.error('No auth token found. Cannot delete review.');

            setPopupMessage('No auth token found. Cannot delete review.');
            setShowPopup(true);
            window.history.replaceState({}, document.title);

            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
    };

    const handleEditReview = (review) => {
        const bookDetails = getBookDetails(review.bookName);
        navigate(`/edit-review/${review.reviewId}`, {
            state: {
                bookDetails,
                reviewText: review.text,
                reviewRating: review.rating,
            },
        });
    };

    const filteredReviews = reviews.filter(review => {
        const bookDetails = getBookDetails(review.bookName);
        const combinedContent = `${review.bookName} ${bookDetails?.author || ''} ${bookDetails?.publishYear || ''} ${bookDetails?.isbn || ''} ${review.text} ${review.rating}`;

        return combinedContent.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2 className="mb-4">My Reviews</h2>
            {showPopup && (
                <div className="alert alert-info">
                    {popupMessage}
                </div>
            )}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {filteredReviews.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Book Name</th>
                        <th>Author</th>
                        <th>Publish Year</th>
                        <th>ISBN</th>
                        <th>Your Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReviews.map(review => {
                        const bookDetails = getBookDetails(review.bookName);
                        return (
                            <React.Fragment key={review.reviewId}>
                                <tr>
                                    <td>{review.bookName}</td>
                                    <td>{bookDetails?.author || 'N/A'}</td>
                                    <td>{bookDetails?.publishYear || 'N/A'}</td>
                                    <td>{bookDetails?.isbn || 'N/A'}</td>
                                    <td>{review.rating}</td>
                                </tr>
                                <tr>
                                    <td colSpan="5">
                                        <p><strong>Your Review:</strong> {review.text}</p>
                                        <div>
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={() => handleEditReview(review)}
                                            >
                                                Edit Review
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteReview(review.reviewId)}
                                            >
                                                Delete Review
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
};

export default MyReviews;
