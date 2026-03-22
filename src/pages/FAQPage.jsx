import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is Amrach B2B Marketplace?",
            answer: "Amrach is a leading B2B marketplace that connects African businesses with verified suppliers worldwide. We provide a trusted platform for businesses to discover products, request quotes, and manage their procurement needs."
        },
        {
            question: "How do I become a supplier on Amrach?",
            answer: "To become a supplier, click on the 'Register' button, select 'Supplier Account', and complete the registration form. Our team will verify your business information within 2-3 business days."
        },
        {
            question: "Is there a fee to use Amrach?",
            answer: "Basic browsing and RFQ creation is free for buyers. Suppliers can list products with a free basic plan, or upgrade to premium plans for additional features and visibility. Contact our sales team for detailed pricing."
        },
        {
            question: "How do I request a quote for products?",
            answer: "Navigate to the RFQ section, click 'Create RFQ', fill in your product requirements, and submit. Suppliers will respond with competitive quotes within 24-48 hours."
        },
        {
            question: "How are suppliers verified?",
            answer: "We verify suppliers through a multi-step process including business license verification, TIN validation, and sometimes site visits. Verified suppliers display a verification badge on their profile."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We support multiple payment methods including bank transfers, credit cards, and mobile money (TeleBirr, M-Pesa). All transactions are secured through our payment partners."
        },
        {
            question: "How do I track my orders?",
            answer: "Once logged in, navigate to your dashboard and click on 'Orders'. You'll find real-time tracking information for all your purchases, including shipping status and delivery updates."
        },
        {
            question: "What if I have issues with a supplier?",
            answer: "Our support team is available 24/7 to help resolve disputes. You can contact us through the support portal, and we'll mediate between you and the supplier to find a fair resolution."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="page-header">
                <h1 className="section-title">Frequently Asked Questions</h1>
                <p className="section-subtitle">
                    Find answers to common questions about Amrach B2B Marketplace
                </p>
            </div>

            <div className="faq-container">
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button 
                                className={`faq-question ${openIndex === index ? 'open' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-sidebar">
                    <div className="support-card">
                        <i className="fas fa-headset"></i>
                        <h3>Still have questions?</h3>
                        <p>Our support team is ready to help you</p>
                        <Link to="/contact" className="btn-primary">
                            Contact Support
                        </Link>
                    </div>
                    <div className="quick-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;