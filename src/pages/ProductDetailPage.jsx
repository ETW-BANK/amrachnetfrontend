import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import cartService from '../services/cartService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data);
            // Select first variant if available
            if (data.variants && data.variants.length > 0) {
                setSelectedVariant(data.variants[0]);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 999)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant && !product) return;
        
        setAddingToCart(true);
        try {
            const variantId = selectedVariant?.id || product.id;
            await cartService.addToCart(variantId, quantity);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const getPrice = () => {
        if (selectedVariant) {
            return selectedVariant.price;
        }
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => v.price);
            return { min: Math.min(...prices), max: Math.max(...prices) };
        }
        return product.price;
    };

    const getOriginalPrice = () => {
        if (product.discountPercentage > 0 && product.price) {
            return product.price / (1 - product.discountPercentage / 100);
        }
        return null;
    };

    if (loading) {
        return <LoadingSpinner message="Loading product details..." />;
    }

    if (error || !product) {
        return <ErrorMessage message={error || "Product not found"} onRetry={loadProduct} />;
    }

    const price = getPrice();
    const originalPrice = getOriginalPrice();

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a href="/">Home</a> / 
                <a href={`/category/${product.categoryId}`}>{product.categoryName}</a> / 
                <span>{product.name}</span>
            </div>

            <div className="product-detail-container">
                {/* Product Images */}
                <div className="product-gallery">
                    <div className="main-image">
                        {product.images && product.images[activeImage] ? (
                            <img src={product.images[activeImage].url} alt={product.name} />
                        ) : (
                            <div className="image-placeholder">
                                <i className="fas fa-box-open"></i>
                            </div>
                        )}
                        {product.isNew && <span className="badge new">NEW</span>}
                        {product.discountPercentage > 0 && (
                            <span className="badge sale">-{product.discountPercentage}%</span>
                        )}
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, idx) => (
                                <div 
                                    key={idx}
                                    className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img.url} alt={`${product.name} ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>
                    
                    {product.supplier && (
                        <div className="supplier-info">
                            <i className="fas fa-building"></i>
                            <span>Sold by: {product.supplier.companyName}</span>
                            <button className="supplier-link">View Supplier</button>
                        </div>
                    )}

                    <div className="price-section">
                        {typeof price === 'object' ? (
                            <div className="price-range">
                                <span className="price">${price.min.toFixed(2)} - ${price.max.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="current-price">
                                <span className="price">${price.toFixed(2)}</span>
                                {originalPrice && (
                                    <span className="original-price">${originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                        )}
                        {product.discountPercentage > 0 && (
                            <div className="discount-badge">
                                Save {product.discountPercentage}%
                            </div>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="stock-status">
                        {product.stockQuantity > 0 ? (
                            <span className="in-stock">
                                <i className="fas fa-check-circle"></i> In Stock ({product.stockQuantity} units available)
                            </span>
                        ) : (
                            <span className="out-of-stock">
                                <i className="fas fa-times-circle"></i> Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Variants Selection */}
                    {product.variants && product.variants.length > 1 && (
                        <div className="variants-section">
                            <label>Select Version:</label>
                            <div className="variant-options">
                                {product.variants.map((variant, idx) => (
                                    <button
                                        key={idx}
                                        className={`variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                                        onClick={() => handleVariantChange(variant)}
                                    >
                                        {variant.name || `Variant ${idx + 1}`}
                                        {variant.price && <span>${variant.price.toFixed(2)}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    {product.stockQuantity > 0 && (
                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-selector">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="qty-btn"
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stockQuantity}
                                    className="qty-btn"
                                >
                                    +
                                </button>
                            </div>
                            <span className="max-quantity">Max: {product.stockQuantity}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        {product.stockQuantity > 0 && (
                            <>
                                <button 
                                    className="btn-add-to-cart-large"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Adding...</>
                                    ) : (
                                        <><i className="fas fa-shopping-cart"></i> Add to Cart</>
                                    )}
                                </button>
                                <button className="btn-buy-now">
                                    Buy Now <i className="fas fa-bolt"></i>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Delivery Info */}
                    <div className="delivery-info">
                        <div className="info-item">
                            <i className="fas fa-truck"></i>
                            <div>
                                <strong>Free Shipping</strong>
                                <p>On orders over $500</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-undo"></i>
                            <div>
                                <strong>30-Day Returns</strong>
                                <p>Hassle-free returns policy</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-shield-alt"></i>
                            <div>
                                <strong>Secure Checkout</strong>
                                <p>SSL encrypted payment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="product-tabs">
                <div className="tab-headers">
                    <button className="tab-btn active">Description</button>
                    <button className="tab-btn">Specifications</button>
                    <button className="tab-btn">Reviews (0)</button>
                </div>
                <div className="tab-content">
                    <div className="tab-pane active">
                        <h3>Product Description</h3>
                        <p>{product.description || "No description available."}</p>
                        
                        <h3>Key Features</h3>
                        <ul className="features-list">
                            <li>High-quality industrial grade materials</li>
                            <li>Certified for B2B transactions</li>
                            <li>Bulk pricing available for large orders</li>
                            <li>Global shipping with tracking</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="toast-success">
                    <i className="fas fa-check-circle"></i> 
                    Product added to cart successfully!
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;