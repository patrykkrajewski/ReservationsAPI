import React, { useContext } from 'react';
import MainBanner from '../components/MainBanner/MainBanner';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import EmployeePanel from '../components/EmployeePanel/EmployeePanel';
import Reservations from '../components/Reservations/Reservations';
import Contact from '../components/Contact/Contact';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { UserContext } from '../components/UserContext';

function HomePage() {
    const { user, setUser } = useContext(UserContext);

    return (
        <div>
            <Header />
            <div id="home">
                <MainBanner />
            </div>
            <div id="admin">
                <AdminPanel />
            </div>
            <div id="employees">
                <EmployeePanel />
            </div>
            <div id="reservations">
                <Reservations />
            </div>
            <div id="contact">
                <Contact />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
