// src/pages/ContactPage.jsx
import React from 'react';

const ContactPage = () => {
    return (
        <div>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle">Get in touch with our team</p>
            <div className="card">
                <p><i className="fas fa-envelope"></i> Email: info@amrach.com</p>
                <p><i className="fas fa-phone"></i> Phone: +251-115-555-100</p>
                <p><i className="fas fa-map-marker-alt"></i> Address: Addis Ababa, Ethiopia</p>
            </div>
        </div>
    );
};

export default ContactPage;