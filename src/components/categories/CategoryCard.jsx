import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, subcategories = [] }) => {
    return (
        <div className="category-card">
            <div className="category-icon">
                <i className={`fas fa-${category.icon || 'folder'}`}></i>
            </div>
            <h3>{category.name}</h3>
            <p>{category.description || 'Explore products in this category'}</p>
            <div className="category-stats">
                <span>{category.productCount || 0} products</span>
                {subcategories.length > 0 && (
                    <span>{subcategories.length} subcategories</span>
                )}
            </div>
            <Link to={`/category/${category.id}`} className="btn-outline">
                View Products <i className="fas fa-arrow-right"></i>
            </Link>
            
            {subcategories.length > 0 && (
                <div className="subcategories">
                    <p className="subcategories-title">Subcategories:</p>
                    <div className="subcategories-list">
                        {subcategories.slice(0, 5).map(sub => (
                            <Link 
                                key={sub.id} 
                                to={`/category/${sub.id}`}
                                className="subcategory-tag"
                            >
                                {sub.name}
                            </Link>
                        ))}
                        {subcategories.length > 5 && (
                            <span className="subcategory-tag">+{subcategories.length - 5} more</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryCard;