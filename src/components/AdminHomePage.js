import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminHomePage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('Logged in as admin.');
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        // Check if the popup has already been shown
        const popupShown = sessionStorage.getItem('adminPopupShown');
        if (!popupShown) {
            setShowPopup(true);
            sessionStorage.setItem('adminPopupShown', 'true'); // Mark the popup as shown
        }
    }, []);

    const handleLogout = () => {
        setPopupMessage('Admin was logged out.');
        setShowPopup(true);

        setTimeout(() => {
            logout();
            sessionStorage.removeItem('adminPopupShown'); // Reset the flag when logging out
            navigate('/');
        }, 2000);
    };

    return (
        <div className="container mt-4">
            {showPopup && (
                <div className="alert alert-info" role="alert">
                    {popupMessage}
                </div>
            )}
            <h1 className="mb-4">Admin Dashboard</h1>
            <div className="mb-3">
                <button className="btn btn-primary mb-2" onClick={() => navigate('/admin/add-book')}>
                    Add New Book
                </button>
                <br />
                <button className="btn btn-primary mb-2" onClick={() => navigate('/admin/manage-books')}>
                    Manage Existing Books
                </button>
                <br />
                <button className="btn btn-primary mb-2" onClick={() => navigate('/admin/manage-reviews')}>
                    Manage Reviews
                </button>
                <br />
                <button className="btn btn-primary mb-2" onClick={() => navigate('/admin-manage-users')}>
                    Manage Users
                </button>
                <br />
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminHomePage;
