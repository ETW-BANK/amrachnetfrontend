import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchService from '../../services/searchService';

const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const search = async () => {
            if (searchTerm.trim().length >= 2) {
                setLoading(true);
                const searchResults = await searchService.quickSearch(searchTerm);
                setResults(searchResults);
                setShowDropdown(true);
                setLoading(false);
            } else {
                setResults(null);
                setShowDropdown(false);
            }
        };
        
        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowDropdown(false);
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const getResultCount = () => {
        if (!results) return 0;
        const productsCount = Array.isArray(results.products) ? results.products.length : 0;
        const categoriesCount = Array.isArray(results.categories) ? results.categories.length : 0;
        const companiesCount = Array.isArray(results.companies) ? results.companies.length : 0;
        return productsCount + categoriesCount + companiesCount;
    };

    const hasProducts = Array.isArray(results?.products) && results.products.length > 0;
    const hasCategories = Array.isArray(results?.categories) && results.categories.length > 0;
    const hasCompanies = Array.isArray(results?.companies) && results.companies.length > 0;

    return (
        <div className="global-search">
            <form onSubmit={handleSearch} className="global-search-form">
                <div className="search-input-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products, categories, suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.trim().length >= 2 && results && getResultCount() > 0 && setShowDropdown(true)}
                        className="global-search-input"
                    />
                    {searchTerm && (
                        <button 
                            type="button" 
                            className="clear-search-btn"
                            onClick={() => {
                                setSearchTerm('');
                                setResults(null);
                                setShowDropdown(false);
                            }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <button type="submit" className="search-submit-btn">
                    <i className="fas fa-search"></i> Search
                </button>
            </form>

            {/* Search Results Dropdown */}
            {showDropdown && results && getResultCount() > 0 && (
                <div className="search-dropdown" ref={dropdownRef}>
                    {hasProducts && (
                        <div className="search-section">
                            <div className="search-section-header">
                                <i className="fas fa-box"></i>
                                <span>Products ({results.products.length})</span>
                            </div>
                            {results.products.slice(0, 5).map(product => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="search-result-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <i className="fas fa-cube"></i>
                                    <div className="result-info">
                                        <div className="result-title">{product.name}</div>
                                        <div className="result-price">
                                            ${(product.price || product.variants?.[0]?.price || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {hasCategories && (
                        <div className="search-section">
                            <div className="search-section-header">
                                <i className="fas fa-tags"></i>
                                <span>Categories ({results.categories.length})</span>
                            </div>
                            {results.categories.slice(0, 5).map(category => (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.id}`}
                                    className="search-result-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <i className="fas fa-folder"></i>
                                    <div className="result-info">
                                        <div className="result-title">{category.name}</div>
                                        <div className="result-desc">{category.description?.substring(0, 50)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {hasCompanies && (
                        <div className="search-section">
                            <div className="search-section-header">
                                <i className="fas fa-building"></i>
                                <span>Suppliers ({results.companies.length})</span>
                            </div>
                            {results.companies.slice(0, 5).map(company => (
                                <Link
                                    key={company.id}
                                    to={`/company/${company.id}`}
                                    className="search-result-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <i className="fas fa-building"></i>
                                    <div className="result-info">
                                        <div className="result-title">{company.name}</div>
                                        <div className="result-desc">{company.description?.substring(0, 50)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="search-dropdown-footer">
                        <Link 
                            to={`/search?q=${encodeURIComponent(searchTerm)}`}
                            onClick={() => setShowDropdown(false)}
                            className="view-all-results"
                        >
                            View all {results.totalCount} results <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            )}

            {showDropdown && results && getResultCount() === 0 && searchTerm.trim().length >= 2 && (
                <div className="search-dropdown no-results">
                    <i className="fas fa-search"></i>
                    <p>No results found for "{searchTerm}"</p>
                    <p className="suggestion">Try searching with different keywords</p>
                </div>
            )}
            
            {loading && (
                <div className="search-dropdown loading">
                    <div className="spinner-small"></div>
                    <p>Searching...</p>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;