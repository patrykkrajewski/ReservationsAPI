import React, { useEffect, useState } from 'react';
import EditEmployeePopup from './EditEmployeePopup';
import './EmployeeTable.css';

function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger re-fetching of employees

    useEffect(() => {
        fetchEmployees();
    }, [refreshTrigger]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/employees');
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error('Failed to fetch employees:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego pracownika?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${employeeId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Pracownik został pomyślnie usunięty.');
                    setRefreshTrigger(refreshTrigger + 1);
                } else {
                    alert('Wystąpił problem podczas usuwania pracownika.');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsPopupOpen(true);
    };

    const handlePopupClose = (refresh = false) => {
        setIsPopupOpen(false);
        setEditingEmployee(null);
        if (refresh) {
            setRefreshTrigger(refreshTrigger + 1);
        }
    };

    const handleEditSubmit = async (updatedEmployee) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/users/${updatedEmployee.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedEmployee),
                }
            );
            if (response.ok) {
                alert('Pracownik został pomyślnie zaktualizowany.');
                handlePopupClose(true);
            } else {
                alert('Wystąpił problem podczas aktualizacji pracownika.');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <div className="employee-table-container">
            <div className="employee-table-wrapper">
                <table className="employee-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imię i nazwisko</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Data Stw.</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role || 'Pracownik'}</td>
                            <td>{employee.createdAt}</td>
                            <td>
                            <button
                                    className="edit-button"
                                    onClick={() => handleEdit(employee)}
                                >
                                    Edytuj
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isPopupOpen && (
                <EditEmployeePopup
                    employee={editingEmployee}
                    onClose={handlePopupClose}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );


}

export default EmployeeTable;
