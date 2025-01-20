import React, { useState } from 'react';
import '../../Popup.css';

function AddServicePopup({ onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !description || !price || !duration) {
            alert('Wszystkie pola są wymagane!');
            return;
        }
        onSubmit({ name, description, price: parseFloat(price), duration: parseInt(duration, 10) });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Dodaj usługę</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nazwa:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        Opis:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        Cena:
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </label>
                    <label>
                        Czas trwania (minuty):
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>
                    <div className="popup-buttons">
                        <button type="submit" className="save-button">Dodaj</button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddServicePopup;
