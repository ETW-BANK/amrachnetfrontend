import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartSidebar from '../cart/CartSidebar';
import cartService from '../../services/cartService';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Load cart count on mount
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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setMobileMenuOpen(false);
        }
    };

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
                        flexWrap: 'wrap',
                        gap: '1rem'
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

                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="navbar-search">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>

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
                            <li className="mobile-search">
                                <form onSubmit={handleSearch} className="mobile-search-form">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="submit">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </form>
                            </li>
                            
                            {/* Cart Link for Mobile */}
                            <li className="mobile-cart">
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
                    /* Desktop Navbar Search */
                    .navbar-search {
                        display: flex;
                        align-items: center;
                        background: #f1f5f9;
                        border-radius: 0.5rem;
                        overflow: hidden;
                        flex: 1;
                        max-width: 400px;
                        margin: 0 1rem;
                    }
                    
                    .navbar-search input {
                        flex: 1;
                        padding: 0.6rem 1rem;
                        border: none;
                        background: none;
                        font-size: 0.9rem;
                        outline: none;
                    }
                    
                    .navbar-search button {
                        padding: 0.6rem 1rem;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #64748b;
                        transition: color 0.3s ease;
                    }
                    
                    .navbar-search button:hover {
                        color: #2563eb;
                    }
                    
                    /* Desktop Navigation Links */
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
                    
                    .mobile-search,
                    .mobile-cart {
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
                        margin-left: 0.5rem;
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
                    
                    /* Mobile Responsive */
                    @media (max-width: 768px) {
                        .navbar-search {
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
                        
                        .mobile-search {
                            display: block !important;
                            padding: 0.5rem 2rem;
                        }
                        
                        .mobile-search-form {
                            display: flex;
                            background: #f1f5f9;
                            border-radius: 0.5rem;
                            overflow: hidden;
                        }
                        
                        .mobile-search-form input {
                            flex: 1;
                            padding: 0.75rem;
                            border: none;
                            background: none;
                            font-size: 0.9rem;
                            outline: none;
                        }
                        
                        .mobile-search-form button {
                            padding: 0.75rem 1rem;
                            background: none;
                            border: none;
                            cursor: pointer;
                            color: #2563eb;
                        }
                        
                        .mobile-cart {
                            display: block !important;
                            margin-top: 0.5rem;
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
                            position: relative;
                        }
                        
                        .cart-button-mobile i {
                            font-size: 1.1rem;
                        }
                        
                        .cart-badge-mobile {
                            background: #2563eb;
                            color: white;
                            font-size: 0.7rem;
                            padding: 0.125rem 0.5rem;
                            border-radius: 50%;
                            margin-left: 0.5rem;
                        }
                    }
                    
                    /* Tablet Styles */
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .nav-links {
                            gap: 1rem;
                        }
                        
                        .navbar-search {
                            max-width: 250px;
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