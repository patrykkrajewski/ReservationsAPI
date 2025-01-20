import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditServicePopup from './EditServicePopup';
import AddServicePopup from './AddServicePopup';
import './ServicesTable.css';

function ServicesTable({ onRefresh }) {
    const [services, setServices] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services');
            setServices(response.data);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Błąd podczas pobierania usług:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddPopup(true);
    };

    const handleAddSubmit = async (newService) => {
        try {
            await axios.post('http://localhost:8080/api/services', newService);
            fetchServices();
            setShowAddPopup(false);
        } catch (error) {
            console.error('Błąd podczas dodawania usługi:', error);
        }
    };

    const handleEditClick = (service) => {
        setSelectedService(service);
        setShowEditPopup(true);
    };

    const handleEditSubmit = async (updatedService) => {
        try {
            await axios.put(`http://localhost:8080/api/services/${updatedService.id}`, updatedService);
            fetchServices();
            setShowEditPopup(false);
        } catch (error) {
            console.error('Błąd podczas edytowania usługi:', error);
        }
    };

    const handleDeleteClick = async (serviceId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę usługę?')) {
            try {
                await axios.delete(`http://localhost:8080/api/services/${serviceId}`);
                fetchServices();
            } catch (error) {
                console.error('Błąd podczas usuwania usługi:', error);
            }
        }
    };

    return (
        <div className="services-table-container">
            <table className="services-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Opis</th>
                    <th>Cena</th>
                    <th>Czas trwania</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service) => (
                    <tr key={service.id}>
                        <td>{service.id}</td>
                        <td>{service.name}</td>
                        <td>{service.description}</td>
                        <td>{service.price}</td>
                        <td>{service.duration} min</td>
                        <td>
                            <button
                                className="edit-button"
                                onClick={() => handleEditClick(service)}
                            >
                                Edytuj
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteClick(service.id)}
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showEditPopup && selectedService && (
                <EditServicePopup
                    service={selectedService}
                    onClose={() => setShowEditPopup(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
}

export default ServicesTable;
