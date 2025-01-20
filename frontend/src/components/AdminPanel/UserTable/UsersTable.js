import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserPopup from './AddUserPopup';
import EditUserPopup from './EditUserPopup';
import './UsersTable.css';

function UsersTable({ onRefresh }) {
    const [users, setUsers] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddPopup(true);
    };

    const handleAddSubmit = async (newUser) => {
        try {
            await axios.post('http://localhost:8080/api/users', newUser);
            fetchUsers();
            setShowAddPopup(false);
        } catch (error) {
            console.error('Błąd podczas dodawania użytkownika:', error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowEditPopup(true);
    };

    const handleEditSubmit = async (updatedUser) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${updatedUser.id}`, updatedUser);
            fetchUsers();
            setShowEditPopup(false);
        } catch (error) {
            console.error('Błąd podczas edycji użytkownika:', error);
        }
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Błąd podczas usuwania użytkownika:', error);
            }
        }
    };

    return (
        <div className="users-table-container">
            <table className="users-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Imię i Nazwisko</th>
                    <th>Email</th>
                    <th>Rola</th>
                    <th>Data Stworzenia</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.createdAt}</td>
                        <td>
                            <button
                                className="edit-button"
                                onClick={() => handleEditClick(user)}
                            >
                                Edytuj
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteClick(user.id)}
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showAddPopup && (
                <AddUserPopup
                    onClose={(refresh) => {
                        setShowAddPopup(false);
                        if (refresh) fetchUsers();
                    }}
                    onSubmit={handleAddSubmit}
                />
            )}
            {showEditPopup && selectedUser && (
                <EditUserPopup
                    user={selectedUser}
                    onClose={() => setShowEditPopup(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
}

export default UsersTable;
