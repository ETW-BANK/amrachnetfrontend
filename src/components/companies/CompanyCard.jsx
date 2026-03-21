import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const getVerificationBadge = () => {
        if (company.verificationStatus === 'Verified') {
            return (
                <span className="verification-badge verified">
                    <i className="fas fa-check-circle"></i> Verified
                </span>
            );
        }
        return (
            <span className="verification-badge pending">
                <i className="fas fa-clock"></i> Pending
            </span>
        );
    };

    return (
        <div className="company-card">
            <div className="company-header">
                <div className="company-logo">
                    <i className="fas fa-building"></i>
                </div>
                <div className="company-info">
                    <h3>{company.name}</h3>
                    {company.tin && <p className="company-tin">TIN: {company.tin}</p>}
                </div>
                {getVerificationBadge()}
            </div>
            
            {company.description && (
                <p className="company-description">{company.description}</p>
            )}
            
            {company.locations && company.locations.length > 0 && (
                <div className="company-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{company.locations[0].city}, {company.locations[0].country}</span>
                </div>
            )}
            
            <div className="company-stats">
                <div className="stat">
                    <i className="fas fa-box"></i>
                    <span>Products</span>
                    <strong>{company.productCount || 0}</strong>
                </div>
                <div className="stat">
                    <i className="fas fa-star"></i>
                    <span>Rating</span>
                    <strong>{company.rating || 'N/A'}</strong>
                </div>
                <div className="stat">
                    <i className="fas fa-calendar"></i>
                    <span>Since</span>
                    <strong>{company.establishedYear || 'N/A'}</strong>
                </div>
            </div>
            
            <div className="company-actions">
                <Link to={`/company/${company.id}`} className="btn-outline">
                    View Profile <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
};

export default CompanyCard;