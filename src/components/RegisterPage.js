import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeButton from "./HomeButton";

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true); // Start loading

        if (!firstName || !lastName || !email || !password) {
            setErrorMessage('Please fill out all fields.');
            setLoading(false); // Stop loading
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            setLoading(false); // Stop loading
            return;
        }

        try {
            const response = await axios.post('https://final-project-backend-production-31fa.up.railway.app/api/auth/register', {
                firstName,
                lastName,
                email,
                password
            });

            if (response.status === 201) {
                setSuccessMessage('Registration successful! Redirecting to home page...');
                setTimeout(() => {
                    navigate('/', { state: { fromRegister: true } }); // Pass the state to the homepage
                }, 2000); // Redirect after 2 seconds
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('This email is already taken.');
            } else {
                setErrorMessage('There was an error registering your account.');
            }
            console.error('Registration error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };


    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Register</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
