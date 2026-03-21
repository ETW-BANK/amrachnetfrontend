import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryTree = ({ categories, level = 0 }) => {
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const toggleCategory = (categoryId, e) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const getIcon = (iconName) => {
        const icons = {
            electronics: "fa-microchip",
            computers: "fa-laptop",
            phones: "fa-mobile-alt",
            industrial: "fa-industry",
            default: "fa-folder"
        };
        return icons[iconName] || icons.default;
    };

    return (
        <div className="category-tree">
            {categories.map(category => (
                <div key={category.id} className={`category-node level-${level}`}>
                    <div className="category-node-header">
                        {category.subCategories && category.subCategories.length > 0 && (
                            <button 
                                className="expand-btn"
                                onClick={(e) => toggleCategory(category.id, e)}
                            >
                                <i className={`fas fa-chevron-${expandedCategories.has(category.id) ? 'down' : 'right'}`}></i>
                            </button>
                        )}
                        <Link to={`/category/${category.id}`} className="category-link">
                            <i className={`fas ${getIcon(category.icon)}`}></i>
                            <span className="category-name">{category.name}</span>
                            <span className="category-count">({category.productCount || 0})</span>
                        </Link>
                    </div>
                    {category.subCategories && category.subCategories.length > 0 && expandedCategories.has(category.id) && (
                        <div className="category-children">
                            <CategoryTree categories={category.subCategories} level={level + 1} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CategoryTree;