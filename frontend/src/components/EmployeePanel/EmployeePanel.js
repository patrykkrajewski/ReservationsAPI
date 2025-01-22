import React, { useState, useEffect, useContext } from 'react';
import './EmployeePanel.css';
import { UserContext } from '../UserContext';

function EmployeePanel() {
    const { user } = useContext(UserContext); // Fetch logged-in employee data
    const [reservations, setReservations] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (user) {
            fetchReservations();
            fetchStatuses();
        }
    }, [user, selectedDate]);

    const fetchReservations = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date for API
            const response = await fetch(
                `http://localhost:8080/api/reservations/by-employee/${user.id}/date/${formattedDate}`
            );

            if (response.ok) {
                const data = await response.json();

                // Sort reservations by time
                const sortedData = data.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setReservations(sortedData);
            } else {
                console.error('Error fetching reservations:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/statuses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStatuses(data);
            } else {
                console.error('Error fetching statuses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const handleStatusChange = async (reservationId, newStatusId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/reservations/${reservationId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ statusId: parseInt(newStatusId) }), // Ensure statusId is a number
                }
            );

            if (response.ok) {
                setReservations((prevReservations) =>
                    prevReservations.map((reservation) =>
                        reservation.id === reservationId
                            ? {
                                ...reservation,
                                status: statuses.find((s) => s.id === parseInt(newStatusId))?.name,
                                statusColor: statuses.find((s) => s.id === parseInt(newStatusId))?.color,
                            }
                            : reservation
                    )
                );
                console.log('Status updated successfully');
            } else {
                console.error('Error updating status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePreviousDay = () => {
        setSelectedDate((prevDate) => new Date(prevDate.getTime() - 24 * 60 * 60 * 1000));
    };

    const handleNextDay = () => {
        setSelectedDate((prevDate) => new Date(prevDate.getTime() + 24 * 60 * 60 * 1000));
    };

    return (
        <div className="employee-panel">
            <h1>Panel Pracownika</h1>
            <div className="navigation-buttons">
                <button onClick={handlePreviousDay}>Poprzedni dzień</button>
                <p>{selectedDate.toLocaleDateString()}</p>
                <button onClick={handleNextDay}>Następny dzień</button>
            </div>
            <div className="reservation-list">
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div className="reservation-card" key={reservation.id}>
                            <h3>Usługa: {reservation.serviceName || 'Nieokreślona usługa'}</h3>
                            <p>
                                Godzina:{' '}
                                {new Date(reservation.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            <p>Klient: {reservation.userName || 'Nieznany klient'}</p>
                            <div className="status-update">
                                <select
                                    className="status-select"
                                    onChange={(e) =>
                                        handleStatusChange(reservation.id, e.target.value)
                                    }
                                    value={
                                        statuses.find(
                                            (status) => status.name === reservation.status
                                        )?.id || ''
                                    }
                                    style={{
                                        backgroundColor:
                                            statuses.find(
                                                (status) => status.name === reservation.status
                                            )?.color || '#fff',
                                        color: '#fff',
                                    }}
                                >
                                    <option value="" disabled>
                                        Wybierz status
                                    </option>
                                    {statuses.map((status) => (
                                        <option
                                            key={status.id}
                                            value={status.id}
                                            style={{
                                                backgroundColor: status.color,
                                                color: '#fff',
                                            }}
                                        >
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-reservations">Brak rezerwacji na ten dzień.</p>
                )}
            </div>
        </div>
    );
}

export default EmployeePanel;
