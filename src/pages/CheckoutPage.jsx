import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Ethiopia',
        postalCode: '',
        paymentMethod: 'bank_transfer',
        notes: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            if (!data.items || data.items.length === 0) {
                navigate('/cart');
            }
            setCart(data);
        } catch (error) {
            console.error('Error loading cart:', error);
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }
        
        setSubmitting(true);
        
        // Simulate order submission
        setTimeout(() => {
            alert('Order placed successfully! Thank you for your purchase.');
            cartService.clearCart();
            navigate('/order-confirmation');
            setSubmitting(false);
        }, 2000);
    };

    if (loading) {
        return <LoadingSpinner message="Loading checkout..." />;
    }

    return (
        <div className="checkout-page">
            <div className="page-header">
                <h1 className="section-title">Checkout</h1>
                <p className="section-subtitle">Complete your purchase</p>
            </div>

            <div className="checkout-container">
                {/* Shipping Information */}
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-section">
                        <h3>Shipping Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Country *</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                >
                                    <option>Ethiopia</option>
                                    <option>Kenya</option>
                                    <option>Nigeria</option>
                                    <option>South Africa</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="form-section">
                        <h3>Payment Method</h3>
                        <div className="payment-methods">
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank_transfer"
                                    checked={formData.paymentMethod === 'bank_transfer'}
                                    onChange={handleInputChange}
                                />
                                <i className="fas fa-university"></i>
                                <span>Bank Transfer</span>
                            </label>
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="credit_card"
                                    checked={formData.paymentMethod === 'credit_card'}
                                    onChange={handleInputChange}
                                />
                                <i className="fas fa-credit-card"></i>
                                <span>Credit Card</span>
                            </label>
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="mobile_money"
                                    checked={formData.paymentMethod === 'mobile_money'}
                                    onChange={handleInputChange}
                                />
                                <i className="fas fa-mobile-alt"></i>
                                <span>Mobile Money</span>
                            </label>
                        </div>
                    </div>

                    {/* Order Notes */}
                    <div className="form-section">
                        <h3>Order Notes (Optional)</h3>
                        <textarea
                            name="notes"
                            rows="3"
                            placeholder="Special instructions for delivery..."
                            value={formData.notes}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary place-order-btn" disabled={submitting}>
                        {submitting ? (
                            <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                        ) : (
                            <>Place Order <i className="fas fa-check"></i></>
                        )}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                        {cart?.items?.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-info">
                                    <span className="item-name">{item.productName}</span>
                                    <span className="item-quantity">x{item.quantity}</span>
                                </div>
                                <span className="item-price">
                                    ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${(cart?.subtotal || 0).toFixed(2)}</span>
                        </div>
                        {cart?.discount > 0 && (
                            <div className="summary-row discount">
                                <span>Discount</span>
                                <span>-${cart.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${(cart?.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;