import React, { useState } from 'react';
import '../../Popup.css';

function StatusPopup({ onClose, status }) {
    const [name, setName] = useState(status ? status.name : '');
    const [color, setColor] = useState(status ? status.color : '');

    const handleSubmit = (e) => {
        e.preventDefault();

        const method = status ? 'PUT' : 'POST';
        const url = status
            ? `http://localhost:8080/api/statuses/${status.id}`
            : 'http://localhost:8080/api/statuses';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        })
            .then((response) => {
                if (response.ok) {
                    alert(status ? 'Status zaktualizowany!' : 'Status dodany!');
                    onClose(true); // Zamknij popup i odśwież tabelę
                } else {
                    alert('Wystąpił błąd podczas zapisywania statusu.');
                }
            })
            .catch((error) => console.error('Error saving status:', error));
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{status ? 'Edytuj Status' : 'Dodaj Nowy Status'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nazwa:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="color">Kolor:</label>
                    <input
                        id="color"
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                    />

                    <div className="popup-buttons">
                        <button type="submit" className="save-button">
                            {status ? 'Zapisz' : 'Dodaj'}
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

export default StatusPopup;
