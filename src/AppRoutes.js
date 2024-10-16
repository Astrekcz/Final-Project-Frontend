import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminHomePage from './components/AdminHomePage';
import AdminAddBookPage from './components/AdminAddBookPage';
import AdminManageBooksPage from './components/AdminManageBooksPage';
import AdminManageReviewsPage from './components/AdminManageReviewsPage';
import AdminManageUsersPage from './components/AdminManageUsersPage';
import ReviewPage from './components/ReviewPage';
import RegisterPage from './components/RegisterPage';
import Login from './components/Login';
import MyReviews from './components/MyReviews';
import EditReviewPage from './components/EditReviewPage';
import AddReviewPage from "./components/AddReviewPage";
import ManageReview from './components/ManageReview';
import { AuthContext } from './contexts/AuthContext';

const AppRoutes = () => {
    const { userRole } = useContext(AuthContext); // Access userRole from AuthContext

    return (
        <Routes>
            <Route path="/" element={userRole === 'ROLE_ADMIN' ? <AdminHomePage /> : <HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/admin/add-book" element={<AdminAddBookPage />} />
            <Route path="/admin/manage-books" element={<AdminManageBooksPage />} />
            <Route path="/admin/manage-reviews" element={<AdminManageReviewsPage />} />
            <Route path="/admin-manage-users" element={<AdminManageUsersPage />} />
            <Route path="/reviews/:bookId" element={<ReviewPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-reviews" element={<MyReviews />} />
            <Route path="/edit-review/:reviewId" element={<EditReviewPage />} />
            <Route path="/add-review" element={<AddReviewPage />} />
            <Route path="/manage-review/:reviewId" element={<ManageReview />} />
        </Routes>
    );
};

export default AppRoutes;
