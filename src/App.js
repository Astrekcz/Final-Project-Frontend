import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import AppRoutes from './AppRoutes';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes/> {/* Render the AppRoutes component */}
            </Router>
        </AuthProvider>
    );
}

export default App;
