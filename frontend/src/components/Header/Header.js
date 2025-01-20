import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Pobranie user i setUser z kontekstu
    const [showPopup, setShowPopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setShowPopup(true);
    };

    const confirmLogout = () => {
        setUser(null); // Wylogowanie użytkownika
        navigate('/'); // Powrót na stronę główną
        setShowPopup(false);
    };

    const cancelLogout = () => {
        setShowPopup(false);
    };

    const scrollToSection = (id) => {
        // Dodanie opóźnienia na wypadek, gdyby sekcje ładowały się dynamicznie
        setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setIsMenuOpen(false); // Zamknięcie menu po kliknięciu
        }, 100);
    };

    return (
        <>
            <header className="header">
                <div className="logo">Nails</div>
                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    &#9776;
                </button>
                <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <button onClick={() => scrollToSection('home')}>Strona Główna</button>
                    <button onClick={() => scrollToSection('admin')}>Admin</button>
                    <button onClick={() => scrollToSection('employees')}>Pracownicy</button>
                    <button onClick={() => scrollToSection('reservations')}>Usługi</button>
                    <button onClick={() => scrollToSection('contact')}>Kontakt</button>
                </nav>
                <div className="buttons-container">
                    {user ? (
                        <button className="logout-button logged-in" onClick={handleLogoutClick}>
                            Wyloguj się
                        </button>
                    ) : (
                        <button className="login-button" onClick={handleLoginClick}>
                            Zaloguj się
                        </button>
                    )}
                </div>
            </header>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Czy na pewno chcesz się wylogować?</h3>
                        <div className="popup-buttons">
                            <button className="confirm-button" onClick={confirmLogout}>
                                Tak
                            </button>
                            <button className="cancel-button" onClick={cancelLogout}>
                                Nie
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
