import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartSidebar from '../cart/CartSidebar';
import cartService from '../../services/cartService';
import GlobalSearch from '../common/GlobalSearch';
import logo from '../../assets/logo.png';  // This is imported correctly

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        { id: "rfq", label: "RFQ", icon: "fas fa-file-alt", path: "/rfq" },
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {/* Logo - Using imported image */}
                        <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={logo}  // ← FIXED: Use the imported logo variable
                                alt="Amrach B2B Marketplace"
                                className="logo-image"
                            />
                        </Link>

                        {/* Global Search - Desktop */}
                        <div className="desktop-search">
                            <GlobalSearch />
                        </div>

                        {/* Hamburger Menu Button */}
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

                        {/* Navigation Links */}
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
                        </ul>

                        {/* Cart Button - Desktop */}
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

                <style>{`
    /* Logo Styles - Responsive */
    .logo {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    
    .logo-image {
        height: auto;
        width: auto;
        max-height: 250px;
        min-height: 200px;
        max-width: 525px;
        object-fit: contain;
        transition: opacity 0.3s ease;
    }
    
    .logo-image:hover {
        opacity: 0.9;
    }
    
    /* Desktop Navigation */
    .desktop-search {
        flex: 1;
        max-width: 500px;
        margin: 0 1rem;
    }
    
    /* Mobile Search */
    .mobile-search-item {
        display: none;
        padding: 1rem;
    }
    
    .mobile-cart-item {
        display: none;
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
    
    /* Navigation Links */
    .nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
        align-items: center;
    }
    
    .nav-links a {
        text-decoration: none;
        color: #475569;
        font-weight: 600;
        transition: color 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
        color: #2563eb;
    }
    
    /* All screens 1024px and above - Consistent logo size */
    @media (min-width: 1024px) {
        .logo-image {
            max-height: 200px;
            max-width: 525px;
        }
    }
    
    /* Tablet (768px - 1023px) - 50% larger */
    @media (min-width: 768px) and (max-width: 1023px) {
        .logo-image {
            max-height: 230px;
            max-width: 337px;
        }
        
        .desktop-search {
            max-width: 350px;
        }
        
        .nav-links {
            gap: 1.5rem;
        }
        
        .nav-links a {
            font-size: 0.9rem;
        }
    }
    
    /* Mobile (below 768px) - 50% larger */
    @media (max-width: 767px) {
        .desktop-search {
            display: none;
        }
        
        .cart-button {
            display: none;
        }
        
        .hamburger {
            display: block !important;
        }
        
        .logo-image {
            max-height: 67px !important;
            max-width: 225px !important;
        }
        
        .nav-links {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            background: white;
            flex-direction: column;
            gap: 0;
            padding: 1rem 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: left 0.3s ease;
            max-height: calc(100vh - 70px);
            overflow-y: auto;
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
        }
        
        .mobile-search-item {
            display: block !important;
        }
        
        .mobile-cart-item {
            display: block !important;
            margin-top: 0.5rem;
        }
    }
    
    /* Small Mobile (below 480px) - 50% larger */
    @media (max-width: 480px) {
        .logo-image {
            max-height: 57px !important;
            max-width: 180px !important;
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