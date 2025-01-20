import React, { useState, useEffect, useContext } from 'react';
import './ClientPanel.css';
import { UserContext } from '../UserContext';

function ClientPanel() {
    const { user } = useContext(UserContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [user]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/by-user/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                console.error('Error fetching reservations:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-panel">
                <h1 className="title">Moje Rezerwacje</h1>
            {loading ? (
                <p>Brak rezerwacji</p>
            ) : reservations.length > 0 ? (
                <div className="reservation-list">
                    {reservations.map((reservation) => (
                        <div className="reservation-card" key={reservation.id}>
                            <h3>Usługa: {reservation.serviceName || 'Nieokreślona usługa'}</h3>
                            <p>Data: {new Date(reservation.date).toLocaleDateString()}</p>
                            <p>Godzina: {new Date(reservation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>Status: {reservation.status || 'Brak statusu'}</p>
                            <p>Pracownik: {reservation.employeeName || 'Nieznany pracownik'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-reservations">Brak rezerwacji do wyświetlenia.</p>
            )}
        </div>
    );
}

export default ClientPanel;
