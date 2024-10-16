import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <button className="btn btn-secondary mb-4" onClick={handleClick}>
            Home
        </button>
    );
};

export default HomeButton;
