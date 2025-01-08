import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">Nails</div>
            <nav className="nav-links">
                <a href="#home">Strona Główna</a>
                <a href="#admin">Admin</a>
                <a href="#employees">Pracownicy</a>
                <a href="#reservations">Rezerwacje</a>
                <a href="#contact">Kontakt</a>
            </nav>
            <button className="login-button">Zaloguj się</button>
        </header>
    );
}

export default Header;
