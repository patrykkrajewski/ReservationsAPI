import React, { useEffect, useState } from 'react';
import './RolesList.css';

function RolesList() {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/roles')
            .then(response => response.json())
            .then(data => setRoles(data))
            .catch(error => setError('Failed to fetch roles'));
    }, []);

    return (
        <div className="roles-list">
            <h2>Lista ról</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {roles.map(role => (
                        <li key={role.id}>{role.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RolesList;
