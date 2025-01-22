import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse the login page styles

function RegistrationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                setSuccess(true);
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Redirect to login after 3 seconds
            } else {
                const data = await response.json();
                setError(data.message || 'Błąd podczas rejestracji');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            setError('Wystąpił problem podczas rejestracji.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Zarejestruj się</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">Rejestracja zakończona sukcesem! Przekierowanie...</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Imię i nazwisko</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Wpisz swoje imię i nazwisko"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Wpisz swój email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Zarejestruj się</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationPage;
