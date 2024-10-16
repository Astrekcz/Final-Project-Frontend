import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const AdminManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        // Fetch the list of reviews
        axios.get('https://final-project-backend-production-31fa.up.railway.app/api/review/getAllReviewsAsAdmin', {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the reviews!', error);
            });
    }, [authToken]);

    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://final-project-backend-production-31fa.up.railway.app/api/review/deleteReviewAsAdmin`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                    params: { reviewId }  // Send the reviewId as a query parameter
                });

                setReviews(reviews.filter(review => review.reviewId !== reviewId)); // Remove the deleted review from the list
                setPopupMessage('Review deleted successfully.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            } catch (error) {
                console.error('There was an error deleting the review!', error);
                setPopupMessage('Failed to delete review. Please try again.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }
        }
    };

    const filteredReviews = reviews.filter(review => {
        const combinedContent = `${review.bookName} ${review.publishYear} ${review.bookIsbn} ${review.reviewText} ${review.userFirstName} ${review.userLastName} ${review.userEmail}`;
        return combinedContent.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Manage Reviews</h2>
            {showPopup && (
                <div className="alert alert-info" role="alert">
                    {popupMessage}
                </div>
            )}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by book name, year, ISBN, review text, user name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Book Name</th>
                    <th>Publish Year</th>
                    <th>ISBN</th>
                    <th>Review Text</th>
                    <th>Rating</th>
                    <th>User First Name</th>
                    <th>User Last Name</th>
                    <th>User Email</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                        <tr key={review.reviewId}>
                            <td>{review.bookName}</td>
                            <td>{review.publishYear}</td>
                            <td>{review.bookIsbn}</td>
                            <td>{review.reviewText}</td>
                            <td>{review.rating}</td>
                            <td>{review.userFirstName}</td>
                            <td>{review.userLastName}</td>
                            <td>{review.userEmail}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteReview(review.reviewId)}
                                >
                                    Delete Review
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center">No reviews available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminManageReviewsPage;
