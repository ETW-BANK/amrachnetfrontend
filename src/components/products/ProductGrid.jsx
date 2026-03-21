import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, onAddToCart }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        );
    }

    return (
        <div className="products-grid">
            {products.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

export default ProductGrid;