import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployeePopup from './AddEmployeePopup';
import EditEmployeePopup from './EditEmployeePopup';
import './EmployeeTable.css';

function EmployeesTable() {
    const [employees, setEmployees] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania pracowników:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddPopup(true);
    };

    const handleAddSubmit = async (newEmployee) => {
        try {
            await axios.post('http://localhost:8080/api/users/employees', newEmployee);
            fetchEmployees();
            setShowAddPopup(false);
        } catch (error) {
            console.error('Błąd podczas dodawania pracownika:', error);
            alert('Błąd podczas dodawania pracownika');
        }
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setShowEditPopup(true);
    };

    const handleEditSubmit = async (updatedEmployee) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${updatedEmployee.id}`, updatedEmployee);
            fetchEmployees();
            setShowEditPopup(false);
        } catch (error) {
            console.error('Błąd podczas edycji pracownika:', error);
            alert('Błąd podczas edycji pracownika');
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego pracownika?')) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error('Błąd podczas usuwania pracownika:', error);
                alert('Błąd podczas usuwania pracownika');
            }
        }
    };

    return (
            <div className="table-wrapper">
                <table className="employees-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imię i Nazwisko</th>
                        <th>Email</th>
                        <th>Data Stworzenia</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.createdAt}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEditClick(employee)}>
                                    Edytuj
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteClick(employee.id)}>
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>


            {showAddPopup && (
                <AddEmployeePopup onClose={() => setShowAddPopup(false)} onSubmit={handleAddSubmit} />
            )}

            {showEditPopup && selectedEmployee && (
                <EditEmployeePopup
                    employee={selectedEmployee}
                    onClose={() => setShowEditPopup(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
}

export default EmployeesTable;
