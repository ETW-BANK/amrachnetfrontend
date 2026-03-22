import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        // Simulate API call (replace with actual API endpoint when available)
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setSubmitted(true);
            setSubmitting(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        }, 1000);
        
        // When API is ready, use this:
        /*
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
        */
    };

    const contactInfo = [
        { icon: "fas fa-map-marker-alt", title: "Visit Us", details: ["Bole Road, Alem Building", "Addis Ababa, Ethiopia"] },
        { icon: "fas fa-phone-alt", title: "Call Us", details: ["+251-115-555-100", "+251-911-234567"] },
        { icon: "fas fa-envelope", title: "Email Us", details: ["info@amrach.com", "sales@amrach.com"] },
        { icon: "fas fa-clock", title: "Business Hours", details: ["Monday - Friday: 8:30 AM - 5:30 PM", "Saturday: 9:00 AM - 1:00 PM"] }
    ];

    return (
        <div className="contact-page">
            <div className="page-header">
                <h1 className="section-title">Contact Us</h1>
                <p className="section-subtitle">
                    Have questions? We're here to help. Reach out to our team and we'll get back to you within 24 hours.
                </p>
            </div>

            <div className="contact-container">
                {/* Contact Information Cards */}
                <div className="contact-info-grid">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="contact-info-card">
                            <div className="info-icon">
                                <i className={info.icon}></i>
                            </div>
                            <h3>{info.title}</h3>
                            {info.details.map((detail, idx) => (
                                <p key={idx}>{detail}</p>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="contact-form-container">
                    <h2>Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="How can we help you?"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Message *</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Please describe your inquiry in detail..."
                            ></textarea>
                        </div>
                        
                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}
                        
                        {submitted && (
                            <div className="success-message">
                                <i className="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.
                            </div>
                        )}
                        
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? (
                                <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                            ) : (
                                <><i className="fas fa-paper-plane"></i> Send Message</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-section">
                <h2>Find Us Here</h2>
                <div className="map-container">
                    <iframe
                        title="Amrach Office Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d38.7578!3d9.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDEnNDguMCJOIDM4wrA0NSczMC4wIkU!5e0!3m2!1sen!2set!4v1234567890"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;