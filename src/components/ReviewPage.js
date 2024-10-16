import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import HomeButton from "./HomeButton";

const ReviewPage = () => {
    const { bookId } = useParams();
    const location = useLocation();
    const bookTitle = location.state?.bookTitle || 'Unknown Book'; // Retrieve the book title from state
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get(`https://final-project-backend-production-31fa.up.railway.app/api/review/getReviewsByBook?bookId=${bookId}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the reviews!', error);
            });
    }, [bookId]);

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Reviews for {bookTitle}</h2>
            {reviews.length > 0 ? (
                <div className="list-group">
                    {reviews.map(review => (
                        <div key={review.reviewId} className="list-group-item mb-3">
                            <p className="mb-1"><strong>Review:</strong> "{review.text}"</p>
                            <p className="mb-1"><strong>Rating:</strong> {review.rating}</p>
                            <p className="text-muted"><em>— {review.userFirstName}</em></p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default ReviewPage;
