import React, { useState } from 'react';

const ProductCard = ({ product, onEdit, onDelete, onToggleStatus, onUpdateStock }) => {
    const [showStockInput, setShowStockInput] = useState(false);
    const [newStock, setNewStock] = useState(product.stockQuantity || product.variants?.[0]?.stockQuantity || 0);
    const [updatingStock, setUpdatingStock] = useState(false);

    const handleStockUpdate = async () => {
        if (newStock === (product.stockQuantity || product.variants?.[0]?.stockQuantity)) {
            setShowStockInput(false);
            return;
        }
        
        setUpdatingStock(true);
        await onUpdateStock(newStock);
        setUpdatingStock(false);
        setShowStockInput(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
        if (quantity < 10) return { text: 'Low Stock', class: 'low-stock' };
        return { text: 'In Stock', class: 'in-stock' };
    };

    const currentStock = product.stockQuantity || product.variants?.[0]?.stockQuantity || 0;
    const stockStatus = getStockStatus(currentStock);
    const isActive = product.isActive !== false;

    return (
        <div className={`product-management-card ${!isActive ? 'inactive' : ''}`}>
            <div className="product-card-image">
                {product.images && product.images[0] ? (
                    <img src={product.images[0].imageUrl || product.images[0].url} alt={product.name} />
                ) : (
                    <div className="image-placeholder">
                        <i className="fas fa-box"></i>
                    </div>
                )}
                {!isActive && (
                    <div className="status-overlay">
                        <span>Inactive</span>
                    </div>
                )}
            </div>

            <div className="product-card-content">
                <div className="product-card-header">
                    <h3>{product.name}</h3>
                    <div className="product-actions">
                        <button onClick={onEdit} className="icon-btn" title="Edit">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={onDelete} className="icon-btn delete" title="Delete">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <button onClick={onToggleStatus} className="icon-btn status" title={isActive ? 'Deactivate' : 'Activate'}>
                            <i className={`fas fa-${isActive ? 'pause' : 'play'}`}></i>
                        </button>
                    </div>
                </div>

                <p className="product-description">{product.description?.substring(0, 100)}</p>

                <div className="product-details">
                    <div className="detail-item">
                        <i className="fas fa-tag"></i>
                        <span className="price">{formatPrice(product.price || product.variants?.[0]?.price || 0)}</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-layer-group"></i>
                        <span>{product.categoryName}</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="product-stock-section">
                    <div className="stock-info">
                        <i className="fas fa-cubes"></i>
                        <span className={`stock-status ${stockStatus.class}`}>
                            {stockStatus.text}
                        </span>
                        <span className="stock-quantity">({currentStock} units)</span>
                    </div>
                    
                    {!showStockInput ? (
                        <button 
                            className="update-stock-btn"
                            onClick={() => setShowStockInput(true)}
                        >
                            <i className="fas fa-edit"></i> Update Stock
                        </button>
                    ) : (
                        <div className="stock-update-form">
                            <input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                min="0"
                                className="stock-input"
                                autoFocus
                            />
                            <button 
                                onClick={handleStockUpdate}
                                disabled={updatingStock}
                                className="save-stock-btn"
                            >
                                {updatingStock ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
                            </button>
                            <button 
                                onClick={() => setShowStockInput(false)}
                                className="cancel-stock-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;