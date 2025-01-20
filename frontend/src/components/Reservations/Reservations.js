import React, { useEffect, useState } from 'react';
import './Reservations.css';
import Popup from './Popup';

function Reservations() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/services', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania usług:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleReserveClick = (service) => {
        setSelectedService(service);
    };

    const closePopup = () => {
        setSelectedService(null);
    };

    return (
        <div className="reservations-page">
                <h1 className="title">Nasze Usługi</h1>
                <div className="services-container">
                    {services.map((service) => (
                        <div className="service-card" key={service.id}>
                            <h2 className="service-name">{service.name}</h2>
                            <p className="service-description">{service.description}</p>
                            <p className="service-price">Cena: {service.price} zł</p>
                            <p className="service-duration">Czas trwania: {service.duration} minut</p>
                            <button className="reserve-button" onClick={() => handleReserveClick(service)}>
                                Rezerwuj
                            </button>
                        </div>
                    ))}
                </div>
                {selectedService && <Popup service={selectedService} onClose={closePopup}/>}
            </div>
            );
            }

            export default Reservations;
