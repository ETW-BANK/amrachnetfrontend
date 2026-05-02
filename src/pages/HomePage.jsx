import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import { isProductInStock } from '../utils/productStock';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const data = await productService.getAllProducts(1, 4);
            setFeaturedProducts(data.items || []);
        } catch (error) {
            console.error('Error loading featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="hero">
                <h1>Welcome to Amrach B2B Marketplace</h1>
                <p>Connect with verified suppliers, discover quality products, and grow your business</p>
                <Link to="/categories" className="btn-primary" style={{ background: 'white', color: '#1e40af' }}>
                    Explore Categories <i className="fas fa-arrow-right"></i>
                </Link>
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 className="section-title">Why Choose Amrach?</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginTop: '2rem'
                }}>
                    <div className="card">
                        <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Verified Suppliers</h3>
                        <p>All suppliers are thoroughly vetted for quality and reliability</p>
                    </div>
                    <div className="card">
                        <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Secure Transactions</h3>
                        <p>Safe and secure payment processing for all transactions</p>
                    </div>
                    <div className="card">
                        <i className="fas fa-truck" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Global Shipping</h3>
                        <p>Worldwide shipping with real-time tracking</p>
                    </div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 className="section-title">Featured Products</h2>
                <p className="section-subtitle">Discover our most popular products trusted by businesses worldwide</p>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <Link to={`/product/${product.id}`} className="product-link">
                                    <div className="product-image">
                                        <div className="product-placeholder">
                                            <i className="fas fa-box"></i>
                                        </div>
                                        {product.isNew && <span className="product-badge new">NEW</span>}
                                        {product.discountPercentage > 0 && (
                                            <span className="product-badge sale">-{product.discountPercentage}%</span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-description">
                                            {product.description?.substring(0, 60)}...
                                        </p>
                                        <div className="product-meta">
                                            <div className="product-price">
                                                ${product.price?.toFixed(2)}
                                            </div>
                                            {isProductInStock(product) ? (
                                                <span className="product-stock in-stock">
                                                    <i className="fas fa-check-circle"></i> In Stock
                                                </span>
                                            ) : (
                                                <span className="product-stock out-of-stock">
                                                    <i className="fas fa-times-circle"></i> Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                <div className="product-actions">
                                    <Link to="/products" className="btn-add-to-cart">
                                        View Details <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/products" className="btn-primary">
                        View All Products <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;