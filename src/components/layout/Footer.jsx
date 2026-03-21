import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: '#0f172a',
            color: '#94a3b8',
            padding: '3rem 0 1.5rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Amrach B2B</h3>
                        <p>Connecting businesses with verified suppliers worldwide.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link to="/categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Categories</Link></li>
                            <li><Link to="/products" style={{ color: '#94a3b8', textDecoration: 'none' }}>Products</Link></li>
                            <li><Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact</h4>
                        <p><i className="fas fa-envelope"></i> info@amrach.com</p>
                        <p><i className="fas fa-phone"></i> +251-115-555-100</p>
                    </div>
                </div>
                <hr style={{ borderColor: '#1e293b' }} />
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    © 2025 Amrach B2B Marketplace. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;