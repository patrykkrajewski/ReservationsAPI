import React, { useState, useEffect } from 'react';
import StatusesTable from './StatusTable/StatusesTable';
import UsersTable from './UserTable/UsersTable';
import './AdminPanel.css';
import ServicesTable from './ServicesTable/ServicesTable';
import EmployeeTable from './EmployeeTable/EmployeeTable';
import StatusPopup from './StatusTable/StatusPopup';
import AddUserPopup from './UserTable/AddUserPopup';
import AddServicePopup from './ServicesTable/AddServicePopup';
import AddEmployeePopup from './EmployeeTable/AddEmployeePopup';
import axios from 'axios';

function AdminPanel() {
    const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
    const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
    const [isAddServicePopupOpen, setIsAddServicePopupOpen] = useState(false);
    const [isAddEmployeePopupOpen, setIsAddEmployeePopupOpen] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchStatuses();
        fetchUsers();
    }, []);

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/statuses');
            setStatuses(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania statusów:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };

    const handleAddStatus = () => {
        setIsStatusPopupOpen(true);
    };

    const handleAddUser = () => {
        setIsAddUserPopupOpen(true);
    };

    const handleAddService = () => {
        setIsAddServicePopupOpen(true);
    };

    const handleAddEmployee = () => {
        setIsAddEmployeePopupOpen(true);
    };

    const handleStatusPopupClose = (refresh = false) => {
        setIsStatusPopupOpen(false);
        if (refresh) {
            fetchStatuses();
        }
    };

    const handleAddUserPopupClose = (refresh = false) => {
        setIsAddUserPopupOpen(false);
        if (refresh) {
            fetchUsers();
        }
    };

    const handleAddServicePopupClose = (refresh = false) => {
        setIsAddServicePopupOpen(false);
        if (refresh) {
            // Optionally refresh services
        }
    };

    const handleAddEmployeePopupClose = (refresh = false) => {
        setIsAddEmployeePopupOpen(false);
        if (refresh) {
            fetchUsers();
        }
    };

    const handleAddServiceSubmit = async (newService) => {
        try {
            await axios.post('http://localhost:8080/api/services', newService);
            setIsAddServicePopupOpen(false);
        } catch (error) {
            console.error('Błąd podczas dodawania usługi:', error);
            alert('Błąd podczas dodawania usługi');
        }
    };

    const handleAddEmployeeSubmit = async (newEmployee) => {
        try {
            await axios.post('http://localhost:8080/api/users/employees', newEmployee);
            setIsAddEmployeePopupOpen(false);
        } catch (error) {
            console.error('Błąd podczas dodawania pracownika:', error);
            alert('Błąd podczas dodawania pracownika');
        }
    };

    const handleAddUserSubmit = async (newUser) => {
        try {
            await axios.post('http://localhost:8080/api/users', newUser);
            fetchUsers();
            setIsAddUserPopupOpen(false);
        } catch (error) {
            console.error('Błąd podczas dodawania użytkownika:', error);
            alert('Błąd podczas dodawania użytkownika');
        }
    };

    return (
        <div className="admin-page">
            <h1 className="admin-title">Panel Admina</h1>
            <div className="admin-tables-container">
                <div className="table-container">
                    <div className="table-header">Statusy</div>
                    <StatusesTable statuses={statuses} onAddStatus={handleAddStatus} />
                    <div className="table-footer">
                        <button className="add-button" onClick={handleAddStatus}>
                            Dodaj Status
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-header">Lista użytkowników</div>
                    <UsersTable users={users} />
                    <div className="table-footer">
                        <button className="add-button" onClick={handleAddUser}>
                            Dodaj użytkownika
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-header">Lista usług</div>
                    <ServicesTable />
                    <div className="table-footer">
                        <button className="add-button" onClick={handleAddService}>
                            Dodaj usługę
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-header">Lista pracowników</div>
                    <EmployeeTable />
                    <div className="table-footer">
                        <button className="add-button" onClick={handleAddEmployee}>
                            Dodaj pracownika
                        </button>
                    </div>
                </div>
            </div>

            {isStatusPopupOpen && (
                <StatusPopup onClose={handleStatusPopupClose} />
            )}

            {isAddUserPopupOpen && (
                <AddUserPopup
                    onClose={handleAddUserPopupClose}
                    onSubmit={handleAddUserSubmit}
                />
            )}

            {isAddServicePopupOpen && (
                <AddServicePopup
                    onClose={handleAddServicePopupClose}
                    onSubmit={handleAddServiceSubmit}
                />
            )}

            {isAddEmployeePopupOpen && (
                <AddEmployeePopup
                    onClose={handleAddEmployeePopupClose}
                    onSubmit={handleAddEmployeeSubmit}
                />
            )}
        </div>
    );
}

export default AdminPanel;
