import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import { AuthContext } from '../contexts/AuthContext';

const ManageReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);

    const { reviewId, bookDetails } = location.state || {};
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        console.log("Review ID:", reviewId);

        if (reviewId) {
            axios.get(`https://final-project-backend-production-31fa.up.railway.app/api/review/getReviewById`, {
                headers: { Authorization: `Bearer ${authToken}` },
                params: { reviewId }
            })
                .then(response => {
                    console.log("Response data:", response.data);
                    const review = response.data;

                    setReviewText(review.text);
                    setReviewRating(review.rating);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching review data:', error);
                    setLoading(false);
                });
        }
    }, [reviewId, authToken]);

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch(`https://final-project-backend-production-31fa.up.railway.app/api/review/updateReviewAsUser`, {
                text: reviewText,
                rating: reviewRating,
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
                params: { reviewId }
            });

            // alert('Review updated successfully!');
            navigate('/');

        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        setLoading(true);

        try {
            console.log("Deleting review with ID:", reviewId);
            await axios.delete(`https://final-project-backend-production-31fa.up.railway.app/review/deleteReviewAsUser?reviewId=${reviewId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            setPopupMessage('Review deleted successfully!');
            setShowPopup(true);
            window.history.replaceState({}, document.title);

            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error deleting review:', error);
            setPopupMessage('Failed to delete review. Please try again.');
            setShowPopup(true);
            window.history.replaceState({}, document.title);

            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Edit Review for {bookDetails?.title}</h2>
            {showPopup && (
                <div className="alert alert-info">
                    {popupMessage}
                </div>
            )}
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Publish Year</th>
                    <th>ISBN</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{bookDetails?.title}</td>
                    <td>{bookDetails?.author}</td>
                    <td>{bookDetails?.publishYear}</td>
                    <td>{bookDetails?.isbn}</td>
                </tr>
                </tbody>
            </table>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleUpdateReview}>
                    <div className="mb-3">
                        <label htmlFor="reviewText" className="form-label">Your new review</label>
                        <textarea
                            id="reviewText"
                            className="form-control"
                            value={reviewText}
                            onChange={(e) => {
                                setReviewText(e.target.value);
                                setIsEditing(true); // Mark as editing
                            }}
                            placeholder="Enter your new review here"
                            style={{ color: isEditing || !reviewText ? 'black' : 'lightgrey' }}  // Grey if not changed
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reviewRating" className="form-label">Your new rating</label>
                        <input
                            type="number"
                            id="reviewRating"
                            className="form-control"
                            value={reviewRating}
                            onChange={(e) => {
                                setReviewRating(e.target.value);
                                setIsEditing(true); // Mark as editing
                            }}
                            min="1"
                            max="10"
                            placeholder="Enter your new rating here"
                            style={{ color: isEditing || !reviewRating ? 'black' : 'lightgrey' }}  // Grey if not changed
                        />
                    </div>
                    <div className="mb-3">
                        <p>In case no data is entered, the system will submit existing data—there will be no change to your current review.</p>
                    </div>
                    <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteReview} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ManageReview;
