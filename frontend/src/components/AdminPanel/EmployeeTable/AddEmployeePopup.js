import React, { useState } from 'react';
import '../../Popup.css';

function AddEmployeePopup({ onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Wszystkie pola są wymagane!');
            return;
        }
        onSubmit({ name, email, password, roleId: 2 }); // Rola Pracownik (roleId = 2)
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Dodaj Pracownika</h2>
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
                    <div className="popup-buttons">
                        <button type="submit" className="save-button">Dodaj</button>
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

export default AddEmployeePopup;
