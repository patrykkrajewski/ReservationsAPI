import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeTable.css';

function EmployeeTable() {
    const [reservations, setReservations] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        fetchReservations();
        fetchStatuses();
        fetchAvailableSlots();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/statuses');
            setStatuses(response.data);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/available-slots');
            setAvailableSlots(response.data);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        }
    };

    const handleStatusChange = async (reservationId, newStatusId) => {
        try {
            await axios.put(`http://localhost:8080/api/reservations/${reservationId}/status`, {
                statusId: newStatusId,
            });
            fetchReservations(); // Refresh reservations after updating status
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    return (
        <div className="employee-panel-container">
            <div className="panel-header">
                <button className="nav-button">Poprzedni dzień</button>
                <div className="panel-date">20.01.2025</div>
                <button className="nav-button">Następny dzień</button>
            </div>

            <div className="reservations-grid">
                {reservations.map((reservation) => (
                    <div className="reservation-card" key={reservation.id}>
                        <h3>Usługcca: {reservation.serviceName}</h3>
                        <p>Godzina: {reservation.time}</p>
                        <p>Klient: {reservation.clientName}</p>
                        <p>
                            Statusff:
                            <select
                                className="status-select"
                                value={reservation.statusId}
                                onChange={(e) =>
                                    handleStatusChange(reservation.id, Number(e.target.value))
                                }
                                style={{
                                    backgroundColor:
                                        statuses.find((status) => status.id === Number(e.target.value))
                                            ?.color || 'transparent',
                                    color: '#fff',
                                }}
                            >
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </p>
                    </div>
                ))}
            </div>

            <div className="available-slots">
                <h3>Dostępne godziny</h3>
                <div className="slots-grid">
                    {availableSlots.map((slot) => (
                        <div
                            key={slot.id}
                            className={`slot ${slot.isBooked ? 'booked' : 'available'}`}
                        >
                            {slot.isBooked ? 'Zajęte' : 'Brak'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EmployeeTable;
