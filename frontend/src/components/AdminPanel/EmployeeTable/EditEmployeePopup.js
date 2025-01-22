import React, { useState } from 'react';
import '../../Popup.css';

function EditEmployeePopup({ employee, onClose, onSubmit }) {
    const [name, setName] = useState(employee.name);
    const [email, setEmail] = useState(employee.email);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert('Wszystkie pola są wymagane!');
            return;
        }
        onSubmit({ id: employee.id, name, email, roleId: 2 });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edytuj Pracownika</h2>
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
                    <div className="popup-buttons">
                        <button type="submit" className="save-button">Zapisz</button>
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

export default EditEmployeePopup;
