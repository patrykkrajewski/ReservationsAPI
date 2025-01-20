import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext'; // Import UserContext
import './LoginPage.css';

function LoginPage() {
    const { setUser } = useContext(UserContext); // Consume setUser from UserContext
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ id: data.userId, username: data.username }); // Ustaw użytkownika w kontekście
                navigate('/'); // Przekierowanie na stronę główną
            } else {
                setError(data.message || 'Nieprawidłowe dane logowania');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Wystąpił problem podczas logowania');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Zaloguj się</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Wpisz swój email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Wpisz swoje hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">Zaloguj się</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
