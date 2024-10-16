import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeButton from './HomeButton';
import { AuthContext } from '../contexts/AuthContext';

const AddReviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);

    // Retrieve book details passed from the BookList
    const { bookId, bookTitle, bookAuthor, bookYear, bookISBN } = location.state;

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        if (!reviewText || !rating) {
            setErrorMessage('Please fill out all fields.');
            setLoading(false);
            return;
        }

        if (rating < 1 || rating > 10) {
            setErrorMessage('Rating must be between 1 and 10.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://final-project-backend-production-31fa.up.railway.app/api/review/saveReview',
                {
                    text: reviewText,
                    rating: parseInt(rating, 10)
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                    params: { bookId }
                });

            if (response.status === 200) {
                setSuccessMessage('Review submitted successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            setErrorMessage('There was an error submitting your review. Please try again later.');
            console.error('Submit review error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Add Review for {bookTitle}</h2>
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
                    <td>{bookTitle}</td>
                    <td>{bookAuthor}</td>
                    <td>{bookYear}</td>
                    <td>{bookISBN}</td>
                </tr>
                </tbody>
            </table>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Your Review</label>
                    <textarea
                        className="form-control"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="5"
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Your Rating</label>
                    <input
                        type="number"
                        className="form-control"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="1"
                        max="10"
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default AddReviewPage;
