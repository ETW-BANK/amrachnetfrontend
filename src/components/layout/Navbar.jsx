import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartSidebar from '../cart/CartSidebar';
import cartService from '../../services/cartService';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const location = useLocation();

    const loadCartCount = async () => {
        try {
            const cart = await cartService.getCart();
            const count =
                cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(count);
        } catch (error) {
            console.error('Error loading cart count:', error);
        }
    };

    useEffect(() => {
        loadCartCount();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: "home", label: "HOME", icon: "fas fa-home", path: "/" },
        { id: "categories", label: "CATALOG", icon: "fas fa-tags", path: "/categories" },
        { id: "products", label: "PRODUCTS", icon: "fas fa-box", path: "/products" },
        { id: "about", label: "ABOUT", icon: "fas fa-info-circle", path: "/about" },
        { id: "contact", label: "CONTACT", icon: "fas fa-envelope", path: "/contact" }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav style={{
                background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        flexWrap: 'wrap'
                    }}>

                        {/* Logo */}
                        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                            <h1 style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #1e293b, #2563eb)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                AMRACH
                            </h1>
                            <p style={{
                                fontSize: '0.7rem',
                                letterSpacing: '1px',
                                color: '#2563eb',
                                fontWeight: 500
                            }}>
                                B2B Marketplace
                            </p>
                        </Link>

                        {/* Hamburger */}
                        <div
                            className="hamburger"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'none',
                                color: '#1e293b'
                            }}
                        >
                            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                        </div>

                        {/* Links */}
                        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                            {navItems.map(item => (
                                <li key={item.id}>
                                    <Link
                                        to={item.path}
                                        className={isActive(item.path) ? 'active' : ''}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <i className={item.icon}></i>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* ✅ Cart Button FIXED */}
                        <button
                            className="cart-button"
                            onClick={() => setCartOpen(true)}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>

                    </div>
                </div>
            </nav>

            {/* ✅ CartSidebar moved OUTSIDE nav */}
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                onUpdate={loadCartCount}
            />
        </>
    );
};

export default Navbar;