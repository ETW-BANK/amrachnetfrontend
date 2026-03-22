import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartSidebar from '../cart/CartSidebar';
import cartService from '../../services/cartService';
import GlobalSearch from '../common/GlobalSearch';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();

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
        // RFQ only visible when logged in
        ...(isAuthenticated ? [{ id: "rfq", label: "RFQ", icon: "fas fa-file-alt", path: "/rfq" }] : []),
        { id: "faq", label: "FAQ", icon: "fas fa-question-circle", path: "/faq" },
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

                    {/* Bottom Row - Search and Navigation */}
                    <div className="navbar-bottom-row">
                        {/* Global Search */}
                        <div className="desktop-search">
                            <GlobalSearch />
                        </div>

                        {/* Navigation Links */}
                        <div className="nav-wrapper">
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
                                
                                {/* Mobile Search */}
                                <li className="mobile-search-item">
                                    <GlobalSearch />
                                </li>
                                
                                {/* Cart Link for Mobile */}
                                <li className="mobile-cart-item">
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
                                </li>
                                
                                {/* Mobile Auth Links */}
                                {!isAuthenticated ? (
                                    <>
                                        <li className="mobile-auth-item">
                                            <Link to="/login" className="auth-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-sign-in-alt"></i> Login
                                            </Link>
                                        </li>
                                        <li className="mobile-auth-item">
                                            <Link to="/register" className="register-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-user-plus"></i> Register
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="mobile-auth-item">
                                            <div className="mobile-user-greeting">
                                                <i className="fas fa-user-circle"></i> Hi, {user?.firstName}
                                            </div>
                                        </li>
                                        <li className="mobile-auth-item">
                                            <Link to="/dashboard" className="auth-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-chart-line"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li className="mobile-auth-item">
                                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="logout-btn-mobile">
                                                <i className="fas fa-sign-out-alt"></i> Logout
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>

                            {/* Cart Button - Desktop */}
                            <button className="cart-button" onClick={() => setCartOpen(true)}>
                                <i className="fas fa-shopping-cart"></i>
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </button>

                            {/* Hamburger Menu Button */}
                            <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                            </div>
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
                    
                    .navbar-bottom-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.5rem 0;
                        gap: 1rem;
                        flex-wrap: wrap;
                    }
                    
                    .nav-wrapper {
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
                    
                    /* Desktop Search */
                    .desktop-search {
                        flex: 1;
                        max-width: 450px;
                    }
                    
                    /* Navigation Links */
                    .nav-links {
                        display: flex;
                        gap: 1.5rem;
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        align-items: center;
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
                    }
                    
                    /* Mobile Styles */
                    .mobile-search-item,
                    .mobile-cart-item,
                    .mobile-auth-item {
                        display: none;
                    }
                    
                    @media (max-width: 1024px) {
                        .nav-links {
                            gap: 1rem;
                        }
                        
                        .nav-links a {
                            font-size: 0.8rem;
                        }
                        
                        .desktop-search {
                            max-width: 350px;
                        }
                        
                        .logo-image {
                            max-height: 65px;
                            max-width: 220px;
                        }
                    }
                    
                    @media (max-width: 900px) {
                        .navbar-bottom-row {
                            flex-direction: column;
                            align-items: stretch;
                        }
                        
                        .desktop-search {
                            max-width: 100%;
                        }
                        
                        .nav-wrapper {
                            justify-content: space-between;
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .auth-top {
                            display: none;
                        }
                        
                        .cart-button {
                            display: none;
                        }
                        
                        .hamburger {
                            display: block !important;
                        }
                        
                        .nav-links {
                            position: fixed;
                            top: 120px;
                            left: -100%;
                            width: 100%;
                            background: white;
                            flex-direction: column;
                            gap: 0;
                            padding: 1rem 0;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                            transition: left 0.3s ease;
                            max-height: calc(100vh - 120px);
                            overflow-y: auto;
                            z-index: 999;
                        }
                        
                        .nav-links.open {
                            left: 0;
                        }
                        
                        .nav-links li {
                            width: 100%;
                        }
                        
                        .nav-links a {
                            padding: 1rem 2rem;
                            display: block;
                            font-size: 1rem;
                        }
                        
                        .mobile-search-item {
                            display: block !important;
                            padding: 0.5rem 2rem;
                        }
                        
                        .mobile-cart-item {
                            display: block !important;
                        }
                        
                        .mobile-auth-item {
                            display: block !important;
                        }
                        
                        .mobile-user-greeting {
                            padding: 1rem 2rem;
                            color: #2563eb;
                            font-weight: 600;
                            background: #eff6ff;
                            margin-top: 0.5rem;
                        }
                        
                        .auth-link-mobile {
                            display: block;
                            padding: 1rem 2rem;
                            text-decoration: none;
                            color: #475569;
                            font-weight: 500;
                        }
                        
                        .register-link-mobile {
                            display: block;
                            padding: 1rem 2rem;
                            text-decoration: none;
                            color: #2563eb;
                            font-weight: 500;
                            background: #eff6ff;
                            margin-top: 0.5rem;
                        }
                        
                        .logout-btn-mobile {
                            width: 100%;
                            text-align: left;
                            padding: 1rem 2rem;
                            background: none;
                            border: none;
                            color: #ef4444;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 1rem;
                        }
                        
                        .cart-button-mobile {
                            width: 100%;
                            text-align: left;
                            padding: 1rem 2rem;
                            background: none;
                            border: none;
                            font-size: 1rem;
                            font-weight: 600;
                            color: #475569;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }
                        
                        .cart-badge-mobile {
                            background: #2563eb;
                            color: white;
                            font-size: 0.7rem;
                            padding: 0.125rem 0.5rem;
                            border-radius: 50%;
                            margin-left: 0.5rem;
                        }
                        
                        .logo-image {
                            max-height: 50px !important;
                            max-width: 180px !important;
                        }
                        
                        .navbar-top-row {
                            padding: 0.25rem 0;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .logo-image {
                            max-height: 40px !important;
                            max-width: 150px !important;
                        }
                    }
                `}</style>
            </nav>

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