import React from 'react';
import './MainBanner.css';

function MainBanner() {
    return (
        <div className="main-banner">
            <div className="banner-content">
                <h1>Nails</h1>
                <p>"Kto powiedział, że supermoce nie istnieją? Jedną z nich jest perfekcyjny manicure, który sprawia, że możesz podbijać świat – albo przynajmniej Insta!"</p>
                <button onClick={() => {
                    const section = document.getElementById('reservations');
                    if (section) {
                        section.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }
                }}>
                    Rezerwuj!
                </button>
            </div>
        </div>
    );
}

export default MainBanner;
