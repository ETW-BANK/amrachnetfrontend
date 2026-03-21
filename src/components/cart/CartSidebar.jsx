import React, { useState, useEffect } from 'react';
import cartService from '../../services/cartService';

const CartSidebar = ({ isOpen, onClose, onUpdate }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadCart();
        }
    }, [isOpen]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            await removeItem(itemId);
            return;
        }
        try {
            await cartService.updateCartItem(itemId, newQuantity);
            await loadCart();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartService.removeCartItem(itemId);
            await loadCart();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode) return;
        try {
            await cartService.applyCoupon(couponCode);
            await loadCart();
            setCouponCode('');
        } catch (error) {
            alert('Invalid coupon code');
        }
    };

    const checkout = () => {
        alert('Checkout functionality coming soon!');
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="cart-overlay" onClick={onClose}></div>
            )}
            
            {/* Sidebar */}
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>
                        <i className="fas fa-shopping-cart"></i> 
                        Shopping Cart
                    </h2>
                    <button className="close-cart" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="cart-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading cart...</p>
                        </div>
                    ) : !cart?.items?.length ? (
                        <div className="empty-cart">
                            <i className="fas fa-shopping-basket"></i>
                            <h3>Your cart is empty</h3>
                            <p>Add some products to get started</p>
                            <button className="btn-primary" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.items.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            {item.productImage ? (
                                                <img src={item.productImage} alt={item.productName} />
                                            ) : (
                                                <i className="fas fa-box"></i>
                                            )}
                                        </div>
                                        <div className="cart-item-details">
                                            <h4>{item.productName}</h4>
                                            <p className="cart-item-price">
                                                ${(item.unitPrice || item.price || 0).toFixed(2)}
                                            </p>
                                            <div className="cart-item-quantity">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="qty-btn"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="qty-btn"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            className="remove-item"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="cart-summary">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${(cart.subtotal || 0).toFixed(2)}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="summary-row discount">
                                        <span>Discount</span>
                                        <span>-${cart.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${(cart.total || 0).toFixed(2)}</span>
                                </div>
                                
                                <div className="coupon-section">
                                    <input 
                                        type="text" 
                                        placeholder="Coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="coupon-input"
                                    />
                                    <button 
                                        className="btn-outline"
                                        onClick={applyCoupon}
                                    >
                                        Apply
                                    </button>
                                </div>
                                
                                <button className="btn-primary checkout-btn" onClick={checkout}>
                                    Proceed to Checkout <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;