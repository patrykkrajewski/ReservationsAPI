import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <div className="contact-title-container">
                <h1 className="contact-title">Kontakt</h1>
            </div>
            <div className="contact-container">
                <div className="contact-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2315.3987775158744!2d18.509076112627625!3d54.52646378565962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fda6c3ed450cd7%3A0xed5a46d20ef4a60c!2sUniwersytet%20Morski%20w%20Gdyni!5e0!3m2!1spl!2spl!4v1736299450163!5m2!1spl!2spl"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location"
                    ></iframe>
                </div>
                <div className="contact-info">
                    <p><strong>Nails</strong></p>
                    <p>Morska 81/87<br />81-225 Gdynia</p>
                    <p>
                        Najlepszy kontakt z nami to telefon. Możesz także wysłać wiadomość
                        e-mail na adres <strong>nails@spoko.pl</strong>. Pocztę sprawdzamy w każdy dzień roboczy.
                    </p>
                    <p><strong>📞 +48 740884001</strong></p>
                    <p>
                        <strong>Pon. – Pią.: </strong>09:00 – 19:00<br />
                        <strong>Sobota: </strong>09:00 – 15:00<br />
                        <strong>Niedziela: </strong>Zamknięte
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
