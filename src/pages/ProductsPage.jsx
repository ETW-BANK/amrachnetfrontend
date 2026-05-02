import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cartUpdate, setCartUpdate] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, selectedCategory, currentPage]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let data;

            if (searchTerm) {
                data = await productService.searchProducts(searchTerm, currentPage);
            } else if (selectedCategory) {
                data = await productService.getProductsByCategory(selectedCategory, currentPage);
            } else {
                data = await productService.getAllProducts(currentPage);
            }

            // Handle both array and object responses
            const productsList = data.items || data || [];
            setProducts(productsList);
            setTotalPages(Math.ceil((data.totalCount || productsList.length) / 20));
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message || 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handleAddToCart = () => {
        setCartUpdate(prev => prev + 1);
    };

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchProducts} />;
    }

    return (
        <div className="products-page">
            <div className="page-header">
                <h1 className="section-title">Products</h1>
                <p className="section-subtitle">Browse our extensive catalog of quality products</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="filter-bar">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-primary">
                        <i className="fas fa-search"></i> Search
                    </button>
                </form>

                <select
                    className="category-filter"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.filter(c => !c.parentCategoryId).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            <ProductGrid
                products={products}
                loading={loading}
                onAddToCart={handleAddToCart}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;