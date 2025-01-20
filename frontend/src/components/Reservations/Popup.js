import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Popup.css';
import { UserContext } from '../UserContext';

function Popup({ service, onClose }) {
    const { user } = useContext(UserContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [step, setStep] = useState(1);
    const [employees, setEmployees] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const fetchHolidays = async () => {
        try {
            const response = await fetch('https://date.nager.at/api/v2/PublicHolidays/2025/PL');
            if (response.ok) {
                const data = await response.json();
                const holidayDates = data.map((holiday) => new Date(holiday.date));
                setHolidays(holidayDates);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/available-employees/any`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data); // Always show full employee list
            } else {
                console.error('Error fetching employees:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchAvailableTimes = async (employeeId, date) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/available-times/${employeeId}/${date}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                const filteredTimes = data
                    .filter((time) => time !== '16:00:00') // Remove 16:00 from the available times
                    .map((time) => time.slice(0, 5)); // Remove seconds from time (HH:mm:ss -> HH:mm)
                setAvailableTimes(filteredTimes);
                setStep(3);
            } else {
                console.error('Error fetching available times:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching available times:', error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setStep(2);
    };

    const handleEmployeeSelection = (employee) => {
        setSelectedEmployee(employee);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        fetchAvailableTimes(employee.id, formattedDate);
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        setStep(4);
    };

    const handleReservation = async () => {
        if (!user) {
            alert('You need to log in to make a reservation!');
            return;
        }

        try {
            const reservation = {
                userId: user.id,
                employeeId: selectedEmployee.id,
                serviceId: service.id,
                date: `${selectedDate.toISOString().split('T')[0]}T${selectedTime}`,
                statusId: 2,
            };

            const response = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservation),
            });

            if (response.ok) {
                alert('Reservation successfully created!');
                onClose();
            } else {
                const errorData = await response.text();
                console.error('Error creating reservation:', errorData);
                alert(`Error creating reservation: ${errorData}`);
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('An error occurred while creating the reservation.');
        }
    };

    useEffect(() => {
        fetchHolidays();
        fetchEmployees();
    }, []);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                {step === 1 && (
                    <>
                        <h2>Select a date for the service: {service.name}</h2>
                        <Calendar
                            onChange={handleDateChange}
                            minDate={new Date()}
                            locale="pl-PL"
                        />
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2>Select an employee for the date: {selectedDate.toLocaleDateString('pl-PL')}</h2>
                        <div className="employee-list">
                            {employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="employee-item"
                                    onClick={() => handleEmployeeSelection(employee)}
                                >
                                    {employee.name}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h2>Select a time for the employee: {selectedEmployee.name}</h2>
                        <div className="time-list">
                            {availableTimes.map((time, index) => (
                                <div
                                    key={index}
                                    className="time-item"
                                    onClick={() => handleTimeSelection(time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <h2>Confirm Your Reservation</h2>
                        <p>Service: <strong>{service.name}</strong></p>
                        <p>Employee: <strong>{selectedEmployee.name}</strong></p>
                        <p>Date: <strong>{selectedDate.toLocaleDateString('pl-PL')}</strong></p>
                        <p>Time: <strong>{selectedTime}</strong></p>
                        <button className="confirm-button" onClick={handleReservation}>
                            Reserve
                        </button>
                    </>
                )}
                <button className="close-popup" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default Popup;
