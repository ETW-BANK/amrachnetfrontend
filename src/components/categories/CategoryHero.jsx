import React from 'react';

const CategoryHero = ({ category }) => {
    if (!category) return null;

    const getHeroIcon = () => {
        const icons = {
            electronics: "fa-microchip",
            computers: "fa-laptop-code",
            phones: "fa-mobile-alt",
            industrial: "fa-robot"
        };
        return icons[category.icon] || "fa-tag";
    };

    return (
        <div className="category-hero">
            <div className="category-hero-content">
                <div className="category-hero-icon">
                    <i className={`fas ${getHeroIcon()}`}></i>
                </div>
                <div className="category-hero-text">
                    <h1>{category.name}</h1>
                    <p>{category.description || `Explore our collection of ${category.name.toLowerCase()}`}</p>
                    {category.productCount !== undefined && (
                        <div className="category-stats">
                            <span>{category.productCount} products available</span>
                            {category.subCategories?.length > 0 && (
                                <span>{category.subCategories.length} subcategories</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryHero;