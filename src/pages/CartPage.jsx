import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

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
        
        setUpdating(true);
        try {
            await cartService.updateCartItem(itemId, newQuantity);
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Remove this item from cart?')) return;
        
        setUpdating(true);
        try {
            await cartService.removeCartItem(itemId);
            await loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item');
        } finally {
            setUpdating(false);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        
        setApplyingCoupon(true);
        try {
            await cartService.applyCoupon(couponCode);
            await loadCart();
            setCouponCode('');
            alert('Coupon applied successfully!');
        } catch (error) {
            console.error('Error applying coupon:', error);
            alert('Invalid or expired coupon code');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const removeCoupon = async () => {
        setApplyingCoupon(true);
        try {
            await cartService.removeCoupon();
            await loadCart();
            alert('Coupon removed');
        } catch (error) {
            console.error('Error removing coupon:', error);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const proceedToCheckout = () => {
        if (cart?.items?.length > 0) {
            navigate('/checkout');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your cart..." />;
    }

    if (!cart?.items?.length) {
        return (
            <div className="cart-empty">
                <div className="empty-cart-container">
                    <i className="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <Link to="/products" className="btn-primary">
                        <i className="fas fa-shopping-bag"></i> Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="page-header">
                <h1 className="section-title">Shopping Cart</h1>
                <p className="section-subtitle">
                    Review your items before proceeding to checkout
                </p>
            </div>

            <div className="cart-container">
                {/* Cart Items */}
                <div className="cart-items-section">
                    <div className="cart-items-header">
                        <div className="product-col">Product</div>
                        <div className="price-col">Price</div>
                        <div className="quantity-col">Quantity</div>
                        <div className="total-col">Total</div>
                        <div className="action-col"></div>
                    </div>

                    {cart.items.map(item => (
                        <div key={item.id} className="cart-item-row">
                            <div className="product-col">
                                <div className="cart-item-product">
                                    <div className="cart-item-image">
                                        {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} />
                                        ) : (
                                            <i className="fas fa-box"></i>
                                        )}
                                    </div>
                                    <div className="cart-item-info">
                                        <h4>{item.productName}</h4>
                                        {item.sku && <p className="item-sku">SKU: {item.sku}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="price-col">
                                <span className="item-price">
                                    ${(item.unitPrice || item.price || 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="quantity-col">
                                <div className="quantity-selector">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={updating}
                                        className="qty-btn"
                                    >
                                        -
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={updating}
                                        className="qty-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="total-col">
                                <span className="item-total">
                                    ${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                            <div className="action-col">
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="remove-item-btn"
                                    disabled={updating}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary-section">
                    <h3>Order Summary</h3>
                    
                    <div className="summary-details">
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
                        
                        <div className="summary-row shipping">
                            <span>Shipping</span>
                            <span>{cart.subtotal > 500 ? 'Free' : 'Calculated at checkout'}</span>
                        </div>
                        
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${(cart.total || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="coupon-section">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={applyingCoupon || cart.discount > 0}
                        />
                        {cart.discount > 0 ? (
                            <button onClick={removeCoupon} className="btn-outline" disabled={applyingCoupon}>
                                Remove Coupon
                            </button>
                        ) : (
                            <button onClick={applyCoupon} className="btn-primary" disabled={applyingCoupon || !couponCode}>
                                {applyingCoupon ? 'Applying...' : 'Apply'}
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="cart-actions">
                        <Link to="/products" className="btn-outline">
                            <i className="fas fa-arrow-left"></i> Continue Shopping
                        </Link>
                        <button className="btn-primary checkout-btn" onClick={proceedToCheckout}>
                            Proceed to Checkout <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;