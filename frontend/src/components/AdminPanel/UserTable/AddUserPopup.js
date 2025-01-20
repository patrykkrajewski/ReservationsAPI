import React, { useState, useEffect } from 'react';
import '../../Popup.css';
import axios from 'axios';

function AddUserPopup({ onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/roles');
                setRoles(response.data);
                if (response.data.length > 0) {
                    setRoleId(response.data[0].id);
                }
            } catch (error) {
                console.error('Błąd podczas pobierania ról:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password || !roleId) {
            alert('Wszystkie pola są wymagane!');
            return;
        }
        onSubmit({ name, email, password, roleId });
        onClose(true);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Dodaj użytkownika</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Imię i nazwisko:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Hasło:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="role">Rola:</label>
                    <select
                        id="role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Wybierz rolę</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <div className="popup-buttons">
                        <button type="submit" className="save-button">
                            Dodaj
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => onClose(false)}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserPopup;
