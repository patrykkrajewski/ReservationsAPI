import React, { useState, useEffect } from 'react';
import '../../Popup.css';

function EditUserPopup({ user, onClose, onSubmit }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [roleId, setRoleId] = useState(user.roleId || '');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/roles');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Błąd podczas pobierania ról:', error);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roleId) {
            alert('Wybierz rolę dla użytkownika');
            return;
        }
        onSubmit({ id: user.id, name, email, roleId: parseInt(roleId, 10) });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edytuj użytkownika</h2>
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
                            Zapisz
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserPopup;
