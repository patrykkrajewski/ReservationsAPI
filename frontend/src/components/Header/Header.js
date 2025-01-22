import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            const userId = localStorage.getItem('userId');
            if (userId && !user) {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/admins?userId=${userId}`);
                    if (response.ok) {
                        const userDetails = await response.json();
                        setUser({
                            id: userDetails.id,
                            username: userDetails.name,
                            role: userDetails.role,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserRole();
    }, [user, setUser]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setShowPopup(true);
    };

    const confirmLogout = () => {
        setUser(null);
        localStorage.removeItem('userId');
        navigate('/');
        setShowPopup(false);
    };

    const cancelLogout = () => {
        setShowPopup(false);
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="logo" onClick={() => scrollToSection('home')}>Nails</div>
                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    &#9776;
                </button>
                <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <button onClick={() => scrollToSection('home')}>Strona Główna</button>
                    {user && user.role === 'Admin' && <button onClick={() => scrollToSection('admin')}>Admin</button>}
                    {user && (user.role === 'Admin' || user.role === 'Pracownik') && <button onClick={() => scrollToSection('employees')}>Pracownicy</button>}
                    <button onClick={() => scrollToSection('reservations')}>Usługi</button>
                    {user && (user.role === 'Admin' || user.role === 'Klient') && <button onClick={() => scrollToSection('client')}>Rezerwacje</button>}
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
