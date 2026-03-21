import React, { useState, useEffect } from 'react';
import CategoryTree from '../components/categories/CategoryTree';
import CategoryCard from '../components/categories/CategoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import categoryService from '../services/categoryService';
import useCategories from '../hooks/useCategories';

const CategoriesPage = () => {
    const { categories, loading, error, fetchCategories, getRootCategories, getSubCategories } = useCategories();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tree'
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [categoryTree, setCategoryTree] = useState([]);

    useEffect(() => {
        if (categories.length > 0) {
            buildCategoryTree();
        }
    }, [categories]);

    useEffect(() => {
        filterCategories();
    }, [searchTerm, categories]);

    const buildCategoryTree = async () => {
        const tree = await categoryService.getCategoryTree();
        setCategoryTree(tree);
    };

    const filterCategories = () => {
        if (!searchTerm.trim()) {
            setFilteredCategories(getRootCategories());
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = getRootCategories().filter(cat => 
            cat.name.toLowerCase().includes(searchLower) ||
            cat.description?.toLowerCase().includes(searchLower)
        );
        setFilteredCategories(filtered);
    };

    if (loading) {
        return <LoadingSpinner message="Loading categories..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchCategories} />;
    }

    const rootCategories = filteredCategories.length > 0 ? filteredCategories : getRootCategories();

    return (
        <div className="categories-page">
            <div className="page-header">
                <h1 className="section-title">Browse Categories</h1>
                <p className="section-subtitle">
                    Discover products across our extensive B2B marketplace catalog
                </p>
            </div>

            {/* Search and View Controls */}
            <div className="categories-controls">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="clear-search">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <div className="view-toggle">
                    <button 
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <i className="fas fa-th"></i> Grid
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'tree' ? 'active' : ''}`}
                        onClick={() => setViewMode('tree')}
                    >
                        <i className="fas fa-tree"></i> Tree
                    </button>
                </div>
            </div>

            {/* Categories Display */}
            {viewMode === 'grid' ? (
                <div className="categories-grid">
                    {rootCategories.map(category => (
                        <CategoryCard 
                            key={category.id} 
                            category={category}
                            subcategories={getSubCategories(category.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="categories-tree-container">
                    <h3>Category Hierarchy</h3>
                    <CategoryTree categories={categoryTree} />
                </div>
            )}

            {/* Stats Section */}
            <div className="categories-stats">
                <div className="stat-card">
                    <i className="fas fa-tags"></i>
                    <h3>{categories.length}</h3>
                    <p>Total Categories</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-layer-group"></i>
                    <h3>{getRootCategories().length}</h3>
                    <p>Main Categories</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-code-branch"></i>
                    <h3>{categories.filter(c => c.parentCategoryId).length}</h3>
                    <p>Subcategories</p>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;