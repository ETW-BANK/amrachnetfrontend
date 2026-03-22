import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const stats = [
        { value: "500+", label: "Active Suppliers", icon: "fas fa-building" },
        { value: "10,000+", label: "Products Listed", icon: "fas fa-box" },
        { value: "50+", label: "Countries Served", icon: "fas fa-globe" },
        { value: "98%", label: "Customer Satisfaction", icon: "fas fa-star" }
    ];

    const values = [
        { title: "Trust & Transparency", description: "We believe in building lasting relationships through honest communication and transparent business practices.", icon: "fas fa-handshake" },
        { title: "Innovation", description: "Constantly evolving to bring you the latest in B2B marketplace technology and solutions.", icon: "fas fa-lightbulb" },
        { title: "Excellence", description: "Committed to delivering exceptional service and quality products to our clients.", icon: "fas fa-trophy" },
        { title: "Partnership", description: "Your success is our success. We work alongside our clients to help their businesses grow.", icon: "fas fa-users" }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-content">
                    <h1>About Amrach B2B Marketplace</h1>
                    <p>Connecting African businesses with global suppliers since 2025</p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="mission-vision">
                <div className="mission-card">
                    <i className="fas fa-bullseye"></i>
                    <h2>Our Mission</h2>
                    <p>To empower African businesses by providing a trusted, efficient, and innovative B2B marketplace that connects buyers with verified suppliers worldwide.</p>
                </div>
                <div className="vision-card">
                    <i className="fas fa-eye"></i>
                    <h2>Our Vision</h2>
                    <p>To become Africa's leading B2B marketplace, driving economic growth and fostering sustainable business relationships across the continent.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <h2 className="section-title">Our Impact</h2>
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card-large">
                            <i className={stat.icon}></i>
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Core Values */}
            <div className="values-section">
                <h2 className="section-title">Our Core Values</h2>
                <div className="values-grid">
                    {values.map((value, index) => (
                        <div key={index} className="value-card">
                            <i className={value.icon}></i>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
                <h2 className="section-title">Leadership Team</h2>
                <div className="team-grid">
                    <div className="team-card">
                        <div className="team-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h3>Abebe Bekele</h3>
                        <p>CEO & Founder</p>
                        <div className="team-social">
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div className="team-card">
                        <div className="team-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h3>Meron Assefa</h3>
                        <p>Head of Operations</p>
                        <div className="team-social">
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div className="team-card">
                        <div className="team-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h3>Dawit Tesfaye</h3>
                        <p>Technical Director</p>
                        <div className="team-social">
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="about-cta">
                <h3>Ready to grow your business?</h3>
                <p>Join thousands of businesses already using Amrach B2B Marketplace</p>
                <div className="cta-buttons">
                    <Link to="/register" className="btn-primary">Get Started</Link>
                    <Link to="/contact" className="btn-outline">Contact Sales</Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;