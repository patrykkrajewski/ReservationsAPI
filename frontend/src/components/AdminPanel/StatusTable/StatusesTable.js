import React, { useEffect, useState } from 'react';
import StatusPopup from './StatusPopup';
import './StatusesTable.css';

function StatusesTable({ onAddStatus }) {
    const [statuses, setStatuses] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchStatuses();
    }, [refreshTrigger]);

    const fetchStatuses = () => {
        fetch('http://localhost:8080/api/statuses')
            .then((response) => response.json())
            .then((data) => setStatuses(data))
            .catch((error) => console.error('Error fetching statuses:', error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten status?')) {
            fetch(`http://localhost:8080/api/statuses/${id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    setRefreshTrigger(refreshTrigger + 1);
                })
                .catch((error) => console.error('Error deleting status:', error));
        }
    };

    const handleEdit = (status) => {
        setEditingStatus(status);
        setIsPopupOpen(true);
    };

    const handlePopupClose = (refresh = false) => {
        setIsPopupOpen(false);
        if (refresh) {
            setRefreshTrigger(refreshTrigger + 1);
        }
    };

    return (
        <div className="statuses-table-container">
            <table className="statuses-table">
                <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Kolor</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {statuses.map((status) => (
                    <tr key={status.id}>
                        <td>{status.name}</td>
                        <td>
                                <span
                                    className="status-color"
                                    style={{ backgroundColor: status.color }}
                                ></span>
                            {status.color}
                        </td>
                        <td>
                            <button
                                className="edit-button"
                                onClick={() => handleEdit(status)}
                            >
                                Edytuj
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(status.id)}
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isPopupOpen && (
                <StatusPopup
                    onClose={handlePopupClose}
                    status={editingStatus}
                />
            )}
        </div>
    );
}

export default StatusesTable;
