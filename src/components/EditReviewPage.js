import React, { useState, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const EditReviewPage = () => {
    const { authToken } = useContext(AuthContext);
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { bookDetails, reviewText: initialReviewText, reviewRating: initialReviewRating } = location.state;

    const [reviewText, setReviewText] = useState(initialReviewText);
    const [reviewRating, setReviewRating] = useState(initialReviewRating);
    const [isEditing, setIsEditing] = useState(false); // State to track if the user is editing

    const handleUpdateReview = () => {
        const updatedReview = {
            text: reviewText,
            rating: reviewRating,
        };

        axios.patch(`https://final-project-backend-production-31fa.up.railway.app/api/review/updateReviewAsUser?reviewId=${reviewId}`, updatedReview, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(() => {
                navigate('/my-reviews');
            })
            .catch(error => {
                console.error('There was an error updating the review!', error);
            });
    };

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Edit Review for {bookDetails?.title}</h2>
            {bookDetails && (
                <div className="mb-3">
                    <table className="table table-striped">
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
                        <tr>
                            <td>{bookDetails.title}</td>
                            <td>{bookDetails.author}</td>
                            <td>{bookDetails.publishYear}</td>
                            <td>{bookDetails.isbn}</td>
                            <td>{initialReviewRating}</td>
                        </tr>
                        <tr>
                            <td colSpan="5">
                                <p><strong>Your Review:</strong> {initialReviewText}</p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mb-3">
                <label htmlFor="reviewText" className="form-label">Your new review</label>
                <textarea
                    id="reviewText"
                    className="form-control"
                    value={reviewText}
                    onChange={(e) => {
                        setReviewText(e.target.value);
                        setIsEditing(true); // Mark as editing when the user starts typing
                    }}
                    style={{ color: isEditing || !reviewText ? 'black' : 'lightgrey' }}  // Change color when editing
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
                        setIsEditing(true); // Mark as editing when the user starts typing
                    }}
                    min="1"
                    max="10"
                    style={{ color: isEditing || !reviewRating ? 'black' : 'lightgrey' }}  // Change color when editing
                />
            </div>
            <div className="mb-3">
                <p>In case no data is entered, the system will submit existing data—there will be no change to your current review.</p>
            </div>
            <button className="btn btn-primary" onClick={handleUpdateReview}>Submit</button>
        </div>
    );
};

export default EditReviewPage;
