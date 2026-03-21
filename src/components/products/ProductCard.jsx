import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cartService from '../../services/cartService';

const ProductCard = ({ product, onAddToCart }) => {
    const [adding, setAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setAdding(true);
        try {
            const variantId = product.variants?.[0]?.id || product.id;
            await cartService.addToCart(variantId, 1);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            if (onAddToCart) onAddToCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAdding(false);
        }
    };

    const getPrice = () => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => v.price).filter(p => p);
            if (prices.length) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                if (minPrice === maxPrice) {
                    return `$${minPrice.toFixed(2)}`;
                }
                return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
            }
        }
        return product.price ? `$${product.price.toFixed(2)}` : 'Price on Request';
    };

    const getOriginalPrice = () => {
        if (product.discountPercentage > 0 && product.price) {
            const originalPrice = product.price / (1 - product.discountPercentage / 100);
            return `$${originalPrice.toFixed(2)}`;
        }
        return null;
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image">
                    {product.images && product.images[0] ? (
                        <img src={product.images[0].url} alt={product.name} />
                    ) : (
                        <div className="product-placeholder">
                            <i className="fas fa-box"></i>
                        </div>
                    )}
                    {product.isNew && (
                        <span className="product-badge new">NEW</span>
                    )}
                    {product.discountPercentage > 0 && (
                        <span className="product-badge sale">
                            -{product.discountPercentage}%
                        </span>
                    )}
                </div>
                
                <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">
                        {product.description?.substring(0, 80)}
                        {product.description?.length > 80 ? '...' : ''}
                    </p>
                    
                    <div className="product-meta">
                        <div className="product-price">
                            {getPrice()}
                            {getOriginalPrice() && (
                                <span className="original-price">{getOriginalPrice()}</span>
                            )}
                        </div>
                        {product.stockQuantity > 0 ? (
                            <span className="product-stock in-stock">
                                <i className="fas fa-check-circle"></i> In Stock
                            </span>
                        ) : (
                            <span className="product-stock out-of-stock">
                                <i className="fas fa-times-circle"></i> Out of Stock
                            </span>
                        )}
                    </div>
                    
                    {product.supplier && (
                        <div className="product-supplier">
                            <i className="fas fa-building"></i> {product.supplier.companyName}
                        </div>
                    )}
                </div>
            </Link>
            
            <div className="product-actions">
                {product.stockQuantity > 0 && (
                    <button 
                        className="btn-add-to-cart"
                        onClick={handleAddToCart}
                        disabled={adding}
                    >
                        {adding ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <><i className="fas fa-shopping-cart"></i> Add to Cart</>
                        )}
                    </button>
                )}
            </div>
            {showSuccess && (
                <div className="toast-success">
                    <i className="fas fa-check-circle"></i> Added to cart!
                </div>
            )}
        </div>
    );
};

export default ProductCard;