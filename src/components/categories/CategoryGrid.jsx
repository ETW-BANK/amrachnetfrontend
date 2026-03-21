import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ categories, getSubCategories }) => {
    if (!categories || categories.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <p>No categories found</p>
            </div>
        );
    }

    return (
        <div className="categories-grid">
            {categories.map(category => (
                <CategoryCard 
                    key={category.id} 
                    category={category}
                    subcategories={getSubCategories ? getSubCategories(category.id) : []}
                />
            ))}
        </div>
    );
};

export default CategoryGrid;