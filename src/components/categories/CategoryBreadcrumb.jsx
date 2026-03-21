import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBreadcrumb = ({ categoryPath }) => {
    if (!categoryPath || categoryPath.length === 0) {
        return null;
    }

    return (
        <div className="breadcrumb">
            <Link to="/">Home</Link>
            {categoryPath.map((cat, index) => (
                <span key={cat.id}>
                    <i className="fas fa-chevron-right"></i>
                    {index === categoryPath.length - 1 ? (
                        <span className="current">{cat.name}</span>
                    ) : (
                        <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                    )}
                </span>
            ))}
        </div>
    );
};

export default CategoryBreadcrumb;