import React, { useState } from 'react';
import { useProductManagement } from '../../context/ProductManagementContext';
import ProductFormModal from './ProductFormModal';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { getProductAvailableQuantity } from '../../utils/productStock';

const ProductManagement = () => {
    const { 
        products, 
        loading, 
        error, 
        deleteProduct, 
        toggleProductStatus,
        updateStock,
        setSelectedProduct,
        setIsEditModalOpen,
        isEditModalOpen
    } = useProductManagement();
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const normalizedStatus = product.isActive === false ? 'inactive' : 'active';
        const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const stats = {
        total: products.length,
        active: products.filter(p => p.isActive !== false).length,
        inactive: products.filter(p => p.isActive === false).length,
        lowStock: products.filter(p => {
            const quantity = getProductAvailableQuantity(p);
            return quantity > 0 && quantity < 10;
        }).length
    };

    if (loading && products.length === 0) {
        return <LoadingSpinner message="Loading your products..." />;
    }

    return (
        <div className="product-management">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="section-title">My Products</h1>
                        <p className="section-subtitle">Manage your product catalog</p>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={() => {
                            setSelectedProduct(null);
                            setShowAddModal(true);
                        }}
                    >
                        <i className="fas fa-plus"></i> Add New Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="product-stats">
                <div className="stat-card">
                    <i className="fas fa-box"></i>
                    <div>
                        <h3>{stats.total}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="stat-card">
                    <i className="fas fa-check-circle"></i>
                    <div>
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                </div>
                <div className="stat-card">
                    <i className="fas fa-pause-circle"></i>
                    <div>
                        <h3>{stats.inactive}</h3>
                        <p>Inactive</p>
                    </div>
                </div>
                <div className="stat-card warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                        <h3>{stats.lowStock}</h3>
                        <p>Low Stock</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="product-filters">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Products</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="empty-products">
                    <i className="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>{searchTerm ? 'Try a different search term' : 'Start by adding your first product'}</p>
                    {!searchTerm && (
                        <button 
                            className="btn-primary"
                            onClick={() => {
                                setSelectedProduct(null);
                                setShowAddModal(true);
                            }}
                        >
                            <i className="fas fa-plus"></i> Add Product
                        </button>
                    )}
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => handleEdit(product)}
                            onDelete={() => deleteProduct(product.id)}
                            onToggleStatus={() => toggleProductStatus(product.id, product.isActive !== false)}
                            onUpdateStock={(quantityDelta) => updateStock(product.variants?.[0]?.id, quantityDelta)}
                        />
                    ))}
                </div>
            )}

            {/* Add/Edit Product Modal */}
            <ProductFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                mode="create"
            />
            <ProductFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
            />
        </div>
    );
};

export default ProductManagement;