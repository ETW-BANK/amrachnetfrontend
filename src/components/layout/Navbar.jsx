import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartSidebar from '../cart/CartSidebar';
import cartService from '../../services/cartService';
import GlobalSearch from '../common/GlobalSearch';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef(null);
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const updateNavbarHeightVar = () => {
            const height = navRef.current?.getBoundingClientRect().height || 0;
            document.documentElement.style.setProperty(
                '--navbar-height',
                `${Math.ceil(height)}px`
            );
        };

        updateNavbarHeightVar();
        window.addEventListener('resize', updateNavbarHeightVar);
        return () => window.removeEventListener('resize', updateNavbarHeightVar);
    }, []);

    const loadCartCount = async () => {
        try {
            const cart = await cartService.getCart();
            const count = cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
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
        { id: "companies", label: "SUPPLIERS", icon: "fas fa-building", path: "/companies" },
        ...(isAuthenticated ? [{ id: "rfq", label: "RFQ", icon: "fas fa-file-alt", path: "/rfq" }] : []),
        { id: "faq", label: "FAQ", icon: "fas fa-question-circle", path: "/faq" },
        { id: "about", label: "ABOUT", icon: "fas fa-info-circle", path: "/about" },
        { id: "contact", label: "CONTACT", icon: "fas fa-envelope", path: "/contact" }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav
                ref={navRef}
                style={{
                background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease'
            }}>
                <div className="container">
                    {/* Top Row - Logo and Auth Links */}
                    <div className="navbar-top-row">
                        <Link to="/" className="logo">
                            <img src={logo} alt="Amrach B2B Marketplace" className="logo-image" />
                        </Link>
                        
                        {/* Auth Links - Desktop (Top Right) */}
                        <div className="auth-top">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className="auth-top-link">
                                        <i className="fas fa-sign-in-alt"></i> Login
                                    </Link>
                                    <Link to="/register" className="auth-top-btn">
                                        <i className="fas fa-user-plus"></i> Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="user-greeting">
                                        <i className="fas fa-user-circle"></i>
                                        <span>Hi, {user?.firstName}</span>
                                    </div>
                                    <Link to="/dashboard" className="auth-top-link">
                                        <i className="fas fa-chart-line"></i> Dashboard
                                    </Link>
                                    <button onClick={logout} className="auth-top-logout">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navigation Row */}
                    <div className="navbar-nav-row">
                        <div className="nav-wrapper">
                            {/* Hamburger Menu Button - Left side on mobile */}
                            <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                            </div>

                            <ul className="nav-links">
                                {navItems.map(item => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className={isActive(item.path) ? 'active' : ''}
                                        >
                                            <i className={item.icon}></i>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="nav-right">
                                {/* Cart Button - Desktop */}
                                <button className="cart-button" onClick={() => setCartOpen(true)}>
                                    <i className="fas fa-shopping-cart"></i>
                                    {cartCount > 0 && (
                                        <span className="cart-badge">{cartCount}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Row - Under the Menu */}
                    <div className="navbar-search-row">
                        <div className="desktop-search">
                            <GlobalSearch />
                        </div>
                    </div>
                </div>

                <style>{`
                    /* Navbar Layout */
                    .navbar-top-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                    }
                    
                    .navbar-nav-row {
                        padding: 0.5rem 0;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                    }
                    
                    .navbar-search-row {
                        padding: 0.75rem 0;
                    }
                    
                    .nav-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                    }
                    
                    .nav-right {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    
                    /* Logo */
                    .logo {
                        display: flex;
                        align-items: center;
                        flex-shrink: 0;
                    }
                    
                    .logo-image {
                        height: auto;
                        width: auto;
                        max-height: 80px;
                        max-width: 280px;
                        object-fit: contain;
                        transition: opacity 0.3s ease;
                    }
                    
                    .logo-image:hover {
                        opacity: 0.9;
                    }
                    
                    /* Auth Top Section */
                    .auth-top {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    
                    .auth-top-link {
                        text-decoration: none;
                        color: #475569;
                        font-weight: 500;
                        font-size: 0.875rem;
                        transition: color 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    
                    .auth-top-link:hover {
                        color: #2563eb;
                    }
                    
                    .auth-top-btn {
                        background: linear-gradient(135deg, #2563eb, #1e40af);
                        color: white;
                        padding: 0.4rem 1rem;
                        border-radius: 0.5rem;
                        text-decoration: none;
                        font-weight: 500;
                        font-size: 0.875rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    
                    .auth-top-btn:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                    }
                    
                    .auth-top-logout {
                        background: none;
                        border: none;
                        color: #ef4444;
                        font-weight: 500;
                        font-size: 0.875rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: color 0.3s ease;
                    }
                    
                    .auth-top-logout:hover {
                        color: #dc2626;
                    }
                    
                    .user-greeting {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        color: #2563eb;
                        font-weight: 500;
                        font-size: 0.875rem;
                    }
                    
                    /* Navigation Links */
                    .nav-links {
                        display: flex;
                        gap: 2rem;
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        align-items: center;
                        flex: 1;
                        justify-content: center;
                    }
                    
                    .nav-links a {
                        text-decoration: none;
                        color: #475569;
                        font-weight: 600;
                        font-size: 0.875rem;
                        transition: color 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    
                    .nav-links a:hover,
                    .nav-links a.active {
                        color: #2563eb;
                    }
                    
                    /* Desktop Search */
                    .desktop-search {
                        max-width: 500px;
                        margin: 0 auto;
                    }
                    
                    /* Desktop Cart Button */
                    .cart-button {
                        background: none;
                        border: none;
                        font-size: 1.25rem;
                        cursor: pointer;
                        position: relative;
                        color: #475569;
                        padding: 0.5rem;
                        transition: color 0.3s ease;
                    }
                    
                    .cart-button:hover {
                        color: #2563eb;
                    }
                    
                    .cart-badge {
                        position: absolute;
                        top: -8px;
                        right: -12px;
                        background: #2563eb;
                        color: white;
                        font-size: 0.7rem;
                        padding: 0.125rem 0.375rem;
                        border-radius: 50%;
                        min-width: 18px;
                        text-align: center;
                    }
                    
                    /* Hamburger */
                    .hamburger {
                        font-size: 1.5rem;
                        cursor: pointer;
                        display: none;
                        color: #1e293b;
                        width: 44px;
                        height: 44px;
                        align-items: center;
                        justify-content: center;
                        line-height: 1;
                    }

                    .hamburger i {
                        width: 1em;
                        text-align: center;
                        display: inline-block;
                    }
                    
                    /* Mobile Menu Overlay */
                    .mobile-menu-overlay {
                        position: absolute;
                        top: var(--navbar-height, 120px);
                        right: 0;
                        left: auto;
                        width: min(520px, 100%);
                        background: var(--dark);
                        background: color-mix(in srgb, var(--dark) 92%, transparent);
                        z-index: 2000;
                        border-bottom-left-radius: 0.75rem;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                        opacity: 0;
                        transform: translateY(-8px);
                        pointer-events: none;
                        transition: opacity 0.2s ease, transform 0.2s ease;
                        max-height: calc(100vh - var(--navbar-height, 120px));
                        overflow-y: auto;
                    }
                    
                    .mobile-menu-overlay.open {
                        opacity: 1;
                        transform: translateY(0);
                        pointer-events: auto;
                    }
                    
                    .mobile-menu-container {
                        padding: 1rem 1.5rem;
                    }
                    
                    .mobile-nav-item {
                        padding: 0.5rem 0;
                        border-bottom: 1px solid color-mix(in srgb, var(--white) 12%, transparent);
                    }
                    
                    .mobile-nav-link {
                        display: block;
                        padding: 0.75rem;
                        text-decoration: none;
                        color: var(--white);
                        font-weight: 500;
                        border-radius: 0.5rem;
                        transition: all 0.3s ease;
                    }
                    
                    .mobile-nav-link:hover {
                        background: color-mix(in srgb, var(--white) 10%, transparent);
                        color: var(--white);
                    }
                    
                    .mobile-search-item {
                        padding: 0.5rem 0;
                        margin-bottom: 1rem;
                    }
                    
                    .mobile-cart-item {
                        padding: 0.5rem 0;
                        margin-bottom: 1rem;
                    }
                    
                    .mobile-auth-item {
                        padding: 0.5rem 0;
                    }
                    
                    .mobile-user-greeting {
                        padding: 0.75rem;
                        color: var(--white);
                        font-weight: 600;
                        background: color-mix(in srgb, var(--white) 10%, transparent);
                        border-radius: 0.5rem;
                        margin: 0.5rem 0;
                    }
                    
                    .auth-link-mobile {
                        display: block;
                        padding: 0.75rem;
                        text-decoration: none;
                        color: var(--white);
                        font-weight: 500;
                        border-radius: 0.5rem;
                    }
                    
                    .auth-link-mobile:hover {
                        background: color-mix(in srgb, var(--white) 10%, transparent);
                    }
                    
                    .register-link-mobile {
                        display: block;
                        padding: 0.75rem;
                        text-decoration: none;
                        color: var(--white);
                        font-weight: 500;
                        background: color-mix(in srgb, var(--white) 12%, transparent);
                        border-radius: 0.5rem;
                    }
                    
                    .logout-btn-mobile {
                        width: 100%;
                        text-align: left;
                        padding: 0.75rem;
                        background: none;
                        border: none;
                        color: var(--danger);
                        font-weight: 500;
                        cursor: pointer;
                        border-radius: 0.5rem;
                    }
                    
                    .logout-btn-mobile:hover {
                        background: color-mix(in srgb, var(--danger) 18%, transparent);
                    }
                    
                    .cart-button-mobile {
                        width: 100%;
                        text-align: left;
                        padding: 0.75rem;
                        background: none;
                        border: none;
                        font-size: 1rem;
                        font-weight: 600;
                        color: var(--white);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        border-radius: 0.5rem;
                    }
                    
                    .cart-button-mobile:hover {
                        background: color-mix(in srgb, var(--white) 10%, transparent);
                    }
                    
                    .cart-badge-mobile {
                        background: var(--primary);
                        color: var(--white);
                        font-size: 0.7rem;
                        padding: 0.125rem 0.5rem;
                        border-radius: 50%;
                        margin-left: 0.5rem;
                    }
                    
                    /* Desktop Styles */
                    @media (min-width: 769px) {
                        .hamburger {
                            display: none !important;
                        }
                    }
                    
                    /* Mobile Responsive */
                    @media (max-width: 768px) {
                        .auth-top {
                            display: none;
                        }
                        
                        .cart-button {
                            display: none;
                        }
                        
                        .hamburger {
                            display: flex !important;
                        }
                        
                        .desktop-search {
                            display: none;
                        }
                        
                        .logo-image {
                            max-height: 50px !important;
                            max-width: 180px !important;
                        }
                        
                        .navbar-search-row {
                            display: none;
                        }
                        
                        .nav-links {
                            display: none;
                        }
                        
                        .nav-wrapper {
                            justify-content: flex-end;
                        }
                        
                        .mobile-menu-overlay {
                            top: var(--navbar-height, 110px);
                            right: 0;
                            left: 0;
                            width: 100%;
                            border-bottom-left-radius: 0;
                        }
                    }
                    
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .desktop-search {
                            max-width: 400px;
                        }
                        
                        .nav-links {
                            gap: 1.2rem;
                        }
                        
                        .nav-links a {
                            font-size: 0.8rem;
                        }
                    }
                `}</style>
            </nav>

            {/* Mobile Menu Overlay (kept outside <nav> to avoid fixed-position containing-block issues) */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-container">
                    <div className="mobile-search-item">
                        <GlobalSearch />
                    </div>
                    <div className="mobile-cart-item">
                        <button
                            className="cart-button-mobile"
                            onClick={() => {
                                setCartOpen(true);
                                setMobileMenuOpen(false);
                            }}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            Cart
                            {cartCount > 0 && (
                                <span className="cart-badge-mobile">{cartCount}</span>
                            )}
                        </button>
                    </div>
                    {navItems.map(item => (
                        <div key={item.id} className="mobile-nav-item">
                            <Link
                                to={item.path}
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <i className={item.icon}></i>
                                {item.label}
                            </Link>
                        </div>
                    ))}
                    {!isAuthenticated ? (
                        <>
                            <div className="mobile-auth-item">
                                <Link to="/login" className="auth-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                    <i className="fas fa-sign-in-alt"></i> Login
                                </Link>
                            </div>
                            <div className="mobile-auth-item">
                                <Link to="/register" className="register-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                    <i className="fas fa-user-plus"></i> Register
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mobile-auth-item">
                                <div className="mobile-user-greeting">
                                    <i className="fas fa-user-circle"></i> Hi, {user?.firstName}
                                </div>
                            </div>
                            <div className="mobile-auth-item">
                                <Link to="/dashboard" className="auth-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                    <i className="fas fa-chart-line"></i> Dashboard
                                </Link>
                            </div>
                            <div className="mobile-auth-item">
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="logout-btn-mobile">
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                onUpdate={loadCartCount}
            />
        </>
    );
};

export default Navbar;