import React, { createContext, useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken); // Debugging line

            // Assuming the role is an array with one role; adjust if necessary
            if (decodedToken.role) {
                setUserRole(decodedToken.role[0]);
            } else if (decodedToken.roles) { // Another common possibility
                setUserRole(decodedToken.roles[0]);
            } else {
                console.error("Role property not found in token.");
            }
        }
    }, []);

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging line

        // Assuming the role is an array with one role; adjust if necessary
        if (decodedToken.role) {
            setUserRole(decodedToken.role[0]);
        } else if (decodedToken.roles) { // Another common possibility
            setUserRole(decodedToken.roles[0]);
        } else {
            console.error("Role property not found in token.");
        }
    };

    const logout = () => {
        setAuthToken(null);
        setUserRole(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
