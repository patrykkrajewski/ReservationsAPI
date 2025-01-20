import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RolesList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Funkcja do pobrania ról z API
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/roles');
                setRoles(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch roles');
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>List of Roles</h2>
            <ul>
                {roles.map((role) => (
                    <li key={role.id}>
                        <strong>{role.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RolesList;
