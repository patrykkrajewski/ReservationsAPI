import React, { useContext } from 'react';
import MainBanner from '../components/MainBanner/MainBanner';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import EmployeePanel from '../components/EmployeePanel/EmployeePanel';
import Reservations from '../components/Reservations/Reservations';
import Contact from '../components/Contact/Contact';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { UserContext } from '../components/UserContext';
import ClientPanel from "../components/ClientPanel/ClientPanel";

function HomePage() {
    const { user } = useContext(UserContext);

    return (
        <div>
            <Header />
            <div id="home">
                <MainBanner />
            </div>
            {user && user.role === 'Admin' && (
                <div id="admin">
                    <AdminPanel />
                </div>
            )}
            {user && (user.role === 'Admin' || user.role === 'Pracownik') && (
                <div id="employees">
                    <EmployeePanel />
                </div>
            )}
            <div id="reservations">
                <Reservations />
            </div>
            {user && (user.role === 'Admin' || user.role === 'Klient') && (
                <div id="client">
                <ClientPanel />
            </div>
            )}

            <div id="contact">
                <Contact />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
