import React from 'react';
import CompanyCard from './CompanyCard';

const CompanyGrid = ({ companies, loading }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading companies...</p>
            </div>
        );
    }

    if (!companies || companies.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-building"></i>
                <h3>No companies found</h3>
                <p>Check back later for new suppliers</p>
            </div>
        );
    }

    return (
        <div className="companies-grid">
            {companies.map(company => (
                <CompanyCard key={company.id} company={company} />
            ))}
        </div>
    );
};

export default CompanyGrid;