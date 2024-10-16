import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import HomeButton from './HomeButton';

const AdminManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        // Fetch the list of users
        axios.get('https://final-project-backend-production-31fa.up.railway.app/api/user/getAllUsersAsAdmin', {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, [authToken]);

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://final-project-backend-production-31fa.up.railway.app/api/user/deleteUserAsAdmin`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                    params: { userId }
                });

                setUsers(users.filter(user => user.userId !== userId)); // Remove the deleted user from the list
                setPopupMessage('User deleted successfully.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            } catch (error) {
                console.error('There was an error deleting the user!', error);
                setPopupMessage('Failed to delete user. Please try again.');
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const combinedContent = `${user.firstName} ${user.lastName} ${user.email}`;
        return combinedContent.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container mt-4">
            <HomeButton />
            <h2>Manage Users</h2>
            {showPopup && (
                <div className="alert alert-info" role="alert">
                    {popupMessage}
                </div>
            )}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by first name, last name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.userId}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.email !== 'admin@example.com' && (  // Hide delete button for admin
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteUser(user.userId)}
                                    >
                                        Delete User
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">No users available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminManageUsersPage;
