import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { UserProvider } from './components/UserContext';
import RegistrationPage from "./pages/RegisterPage";

function App() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />

            </Routes>
        </UserProvider>
    );
}

export default App;
