import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
    return (
        <div className="order-confirmation">
            <div className="confirmation-container">
                <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h1>Order Confirmed!</h1>
                <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                <div className="order-details">
                    <p>Order #: ORD-{Math.floor(Math.random() * 100000)}</p>
                    <p>We'll send you an email with tracking information once your order ships.</p>
                </div>
                <div className="confirmation-actions">
                    <Link to="/products" className="btn-primary">
                        <i className="fas fa-shopping-bag"></i> Continue Shopping
                    </Link>
                    <Link to="/" className="btn-outline">
                        <i className="fas fa-home"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;