import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, userRole } = useContext(AuthContext); // Get userRole from AuthContext

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        if (!email || !password) {
            setErrorMessage('Please fill out all fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://final-project-backend-production-31fa.up.railway.app/api/auth/login', {
                email,
                password
            });

            console.log("Server Response:", response);
            console.log("Response Data:", response.data);

            if (response.status === 200) {
                const token = response.data.jwtToken;
                console.log("Received token:", token);

                if (token) {
                    localStorage.removeItem('authToken');
                    login(token);

                    if (userRole === 'ROLE_ADMIN') {
                        setSuccessMessage('Login successful! Redirecting to admin page...');
                        setTimeout(() => {
                            navigate('/admin'); // Redirect to the admin page
                        }, 2000);
                    } else {
                        setSuccessMessage('Login successful! Redirecting to home page...');
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                    }
                } else {
                    setErrorMessage('Login failed. Token not received.');
                    setLoading(false);
                    return;
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid credentials. Please try again.');
            } else {
                setErrorMessage('There was an error logging you in. Please try again later.');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Login</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
