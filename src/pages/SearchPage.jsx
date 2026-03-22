import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('q') || '',
        categoryId: searchParams.get('category') || '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'relevance',
        page: 1,
        pageSize: 20
    });
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (filters.searchTerm || filters.categoryId) {
            performSearch();
        } else if (!filters.searchTerm && !filters.categoryId && filters.page === 1) {
            setProducts([]);
            setTotalResults(0);
            setLoading(false);
        }
    }, [filters.searchTerm, filters.categoryId, filters.minPrice, filters.maxPrice, filters.sortBy, filters.page]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://amrachapi2026.runasp.net/api/Category');
            const data = await response.json();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const performSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            let results;

            if (filters.categoryId) {
                console.log('Searching by category ID:', filters.categoryId);
                results = await productService.getProductsByCategory(
                    filters.categoryId,
                    filters.page,
                    filters.pageSize
                );
            }
            else if (filters.searchTerm) {
                console.log('Searching by term:', filters.searchTerm);
                const searchQuery = {
                    searchTerm: filters.searchTerm,
                    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
                    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
                    sortBy: filters.sortBy,
                    page: filters.page,
                    pageSize: filters.pageSize
                };
                results = await productService.searchProducts(searchQuery);
            }
            else {
                console.log('Getting all products');
                results = await productService.getAllProducts(filters.page, filters.pageSize);
            }

            let filteredItems = results.items || [];

            if (filters.minPrice) {
                filteredItems = filteredItems.filter(item => {
                    const price = item.price || item.variants?.[0]?.price || 0;
                    return price >= parseFloat(filters.minPrice);
                });
            }
            if (filters.maxPrice) {
                filteredItems = filteredItems.filter(item => {
                    const price = item.price || item.variants?.[0]?.price || 0;
                    return price <= parseFloat(filters.maxPrice);
                });
            }

            if (filters.sortBy === 'price_asc') {
                filteredItems.sort((a, b) => {
                    const priceA = a.price || a.variants?.[0]?.price || 0;
                    const priceB = b.price || b.variants?.[0]?.price || 0;
                    return priceA - priceB;
                });
            } else if (filters.sortBy === 'price_desc') {
                filteredItems.sort((a, b) => {
                    const priceA = a.price || a.variants?.[0]?.price || 0;
                    const priceB = b.price || b.variants?.[0]?.price || 0;
                    return priceB - priceA;
                });
            } else if (filters.sortBy === 'name_asc') {
                filteredItems.sort((a, b) => a.name.localeCompare(b.name));
            } else if (filters.sortBy === 'name_desc') {
                filteredItems.sort((a, b) => b.name.localeCompare(a.name));
            }

            console.log(`Found ${filteredItems.length} products`);
            setProducts(filteredItems);
            setTotalResults(filteredItems.length);
            setTotalPages(Math.ceil(filteredItems.length / filters.pageSize));

        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to search products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));

        const newParams = new URLSearchParams();
        if (key === 'searchTerm' && value) newParams.set('q', value);
        if (key === 'categoryId' && value) newParams.set('category', value);
        if (filters.searchTerm && key !== 'searchTerm') newParams.set('q', filters.searchTerm);
        if (filters.categoryId && key !== 'categoryId') newParams.set('category', filters.categoryId);
        setSearchParams(newParams);
    };

    const handleCategoryChange = (categoryId) => {
        console.log('Category changed to:', categoryId);
        setFilters(prev => ({
            ...prev,
            categoryId: categoryId,
            page: 1
        }));

        const newParams = new URLSearchParams();
        if (categoryId) newParams.set('category', categoryId);
        if (filters.searchTerm) newParams.set('q', filters.searchTerm);
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearFilters = () => {
        console.log('Clearing all filters');
        setFilters({
            searchTerm: '',
            categoryId: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'relevance',
            page: 1,
            pageSize: 20
        });
        setSearchParams({});
    };

    const hasActiveFilters = filters.searchTerm || filters.categoryId || filters.minPrice || filters.maxPrice;

    return (
        <div className="search-page">
            <div className="page-header">
                <h1 className="section-title">Search Products</h1>
                <p className="section-subtitle">Find exactly what you're looking for across our marketplace</p>
            </div>
            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search by product name, supplier, or keyword..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                        className="search-input-large"
                    />
                    {filters.searchTerm && (
                        <button className="clear-search" onClick={() => handleFilterChange('searchTerm', '')}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <button className="btn-primary" onClick={performSearch}>
                    Search
                </button>
            </div>

            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                <i className="fas fa-filter"></i> Filters
                {hasActiveFilters && <span className="filter-badge">•</span>}
            </button>

            <div className="search-results-container">
                <div className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
                    <div className="filters-header">
                        <h3>Filters</h3>
                        {hasActiveFilters && (
                            <button onClick={handleClearFilters} className="clear-filters">
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="filter-section">
                        <h4>Category</h4>
                        <select
                            value={filters.categoryId}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.filter(c => !c.parentCategoryId).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <div className="price-range-container">
                            <div className="price-input-group">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="price-input"
                                    min="0"
                                    step="10"
                                />
                            </div>
                            <span className="price-separator">-</span>
                            <div className="price-input-group">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="price-input"
                                    min="0"
                                    step="10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Sort By</h4>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="filter-select"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name: A to Z</option>
                            <option value="name_desc">Name: Z to A</option>
                        </select>
                    </div>
                </div>

                <div className="results-area">
                    <div className="results-header">
                        <span className="results-count">
                            {totalResults > 0 ? `${totalResults} products found` : 'No products found'}
                        </span>
                        {hasActiveFilters && (
                            <div className="active-filters">
                                {filters.categoryId && categories.find(c => c.id == filters.categoryId) && (
                                    <span className="active-filter-tag">
                                        Category: {categories.find(c => c.id == filters.categoryId)?.name}
                                        <button onClick={() => handleCategoryChange('')}>×</button>
                                    </span>
                                )}
                                {(filters.minPrice || filters.maxPrice) && (
                                    <span className="active-filter-tag">
                                        Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                        <button onClick={() => {
                                            handleFilterChange('minPrice', '');
                                            handleFilterChange('maxPrice', '');
                                        }}>×</button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <LoadingSpinner message="Searching products..." />
                    ) : error ? (
                        <ErrorMessage message={error} onRetry={performSearch} />
                    ) : products.length === 0 ? (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                            <button onClick={handleClearFilters} className="btn-primary">
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={products} loading={false} />

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(filters.page - 1)}
                                        disabled={filters.page === 1}
                                        className="page-btn"
                                    >
                                        <i className="fas fa-chevron-left"></i> Previous
                                    </button>
                                    <span className="page-info">
                                        Page {filters.page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(filters.page + 1)}
                                        disabled={filters.page === totalPages}
                                        className="page-btn"
                                    >
                                        Next <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;