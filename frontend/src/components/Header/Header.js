import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Get user and setUser from context
    const [showPopup, setShowPopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger re-renders

    // Fetch user details if userId exists in localStorage
    useEffect(() => {
        const fetchUserRole = async () => {
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
            if (userId && !user) {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/admins?userId=${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const userDetails = await response.json();
                        setUser({
                            id: userDetails.id,
                            username: userDetails.name,
                            role: userDetails.role, // Assign role from API response (e.g., Admin, Pracownik, Klient)
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserRole();
    }, [user, setUser, refreshTrigger]); // Trigger fetch when refreshTrigger changes

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setShowPopup(true);
    };

    const confirmLogout = () => {
        setUser(null); // Log out user
        localStorage.removeItem('userId'); // Clear userId from localStorage
        setRefreshTrigger(refreshTrigger + 1); // Trigger re-render
        navigate('/'); // Redirect to the home page
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
        setIsMenuOpen(false); // Close menu after clicking
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
                    {/* Show Admin link only for users with role = 'Admin' */}
                    {user && user.role === 'Admin' && (
                        <button onClick={() => scrollToSection('admin')}>
                            Admin
                        </button>
                    )}
                    {/* Show Employees link for Admins or Employees */}
                    {user && (user.role === 'Admin' || user.role === 'Pracownik') && (
                        <button onClick={() => scrollToSection('employees')}>
                            Pracownicy
                        </button>
                    )}
                    {/* Show Reservations link */}
                    <button onClick={() => scrollToSection('reservations')}>Usługi</button>
                    {/* Show Client Panel for Admins or Clients */}
                    {user && (user.role === 'Admin' || user.role === 'Klient') && (
                        <button onClick={() => scrollToSection('client')}>
                            Rezerwacje
                        </button>
                    )}
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
