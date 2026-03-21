import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import CategoryHero from '../components/categories/CategoryHero';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CategoryDetailPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [categoryPath, setCategoryPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategoryData();
    }, [id]);

    const loadCategoryData = async () => {
        try {
            setLoading(true);
            
            // Get category details
            const categoryData = await categoryService.getCategoryById(id);
            setCategory(categoryData);
            
            // Get subcategories
            const subcats = await categoryService.getSubCategories(parseInt(id));
            setSubcategories(subcats);
            
            // Get products in this category
            const productsData = await productService.getProductsByCategory(id);
            setProducts(productsData.items || []);
            
            // Get breadcrumb path
            const path = await categoryService.getCategoryPath(parseInt(id));
            setCategoryPath(path);
            
            setError(null);
        } catch (err) {
            console.error('Error loading category:', err);
            setError('Failed to load category data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading category..." />;
    }

    if (error || !category) {
        return <ErrorMessage message={error || "Category not found"} onRetry={loadCategoryData} />;
    }

    return (
        <div className="category-detail-page">
            {/* Breadcrumb */}
            <CategoryBreadcrumb categoryPath={categoryPath} />
            
            {/* Category Hero */}
            <CategoryHero category={category} />
            
            {/* Subcategories Section */}
            {subcategories.length > 0 && (
                <div className="subcategories-section">
                    <h2 className="section-title">Subcategories</h2>
                    <div className="subcategories-grid">
                        {subcategories.map(subcat => (
                            <Link 
                                key={subcat.id} 
                                to={`/category/${subcat.id}`}
                                className="subcategory-card"
                            >
                                <div className="subcategory-icon">
                                    <i className={`fas fa-${subcat.icon || 'folder'}`}></i>
                                </div>
                                <h3>{subcat.name}</h3>
                                <p>{subcat.description || `Explore ${subcat.name}`}</p>
                                <span className="subcategory-count">
                                    {subcat.productCount || 0} products
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Products Section */}
            <div className="products-section">
                <h2 className="section-title">Products in {category.name}</h2>
                <ProductGrid products={products} loading={false} />
            </div>
        </div>
    );
};

export default CategoryDetailPage;