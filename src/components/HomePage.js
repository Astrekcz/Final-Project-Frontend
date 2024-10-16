import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookList from './BookList';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import InfoModal from './InfoModal';  // Re-import the InfoModal component

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { authToken, logout } = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch books data
        axios.get('https://final-project-backend-production-31fa.up.railway.app/api/book/getBooksDto')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the books!', error);
            });
    }, []);

    useEffect(() => {
        // Check if the user was redirected after a logout
        if (location.state?.fromLogout) {
            setPopupMessage('You were logged out.');
            setShowPopup(true);
            window.history.replaceState({}, document.title); // Clear the state

            // Hide the popup after 2 seconds (for logout)
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        }

        // Check if the user was redirected after registration
        if (location.state?.fromRegister) {
            setPopupMessage('You are not logged in yet, please login to use the service.');
            setShowPopup(true);
            window.history.replaceState({}, document.title); // Clear the state
        }
    }, [location.state]);

    const handleLogout = () => {
        logout();
        navigate('/', { state: { fromLogout: true } });
    };

    const handleMyReviews = () => {
        navigate('/my-reviews', { state: { books } }); // Pass books state to MyReviews
    };

    return (
        <div className="container mt-4">
            {showPopup && (
                location.state?.fromRegister ? (
                    <InfoModal message={popupMessage} onClose={() => setShowPopup(false)} />
                ) : (
                    <div className="alert alert-info" role="alert">
                        {popupMessage}
                    </div>
                )
            )}
            <h1 className="mb-4">Welcome to Book Reviews...</h1>
            <div className="mb-3">
                {!authToken ? (
                    <>
                        <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/register')}>Register</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-danger me-2" onClick={handleLogout}>Logout</button>
                        <button className="btn btn-primary" onClick={handleMyReviews}>My Reviews</button>
                    </>
                )}
            </div>
            <BookList books={books} />
        </div>
    );
};

export default HomePage;
