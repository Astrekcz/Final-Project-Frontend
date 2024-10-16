import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const AdminAddBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [isbn, setIsbn] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        if (!title || !author || !publishYear || !isbn) {
            setErrorMessage('Please fill out all fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://final-project-backend-production-31fa.up.railway.app/api/book/saveBookAsAdmin', {
                title,
                author,
                publishYear,
                isbn,
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (response.status === 200) {
                setSuccessMessage('Book added successfully!');
                setTimeout(() => {
                    navigate('/admin'); // Redirect to admin dashboard after success
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Error adding book: ' + error.response.data);
            } else {
                setErrorMessage('There was an error adding the book. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Add New Book</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Publish Year</label>
                    <input
                        type="number"
                        className="form-control"
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">ISBN</label>
                    <input
                        type="text"
                        className="form-control"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Book'}
                </button>
            </form>
        </div>
    );
};

export default AdminAddBookPage;
