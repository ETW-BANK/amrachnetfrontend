import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import companyService from '../services/companyService';
import productService from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CompanyDetailPage = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCompanyData();
    }, [id]);

    const loadCompanyData = async () => {
        try {
            setLoading(true);
            const companyData = await companyService.getCompanyById(id);
            setCompany(companyData);
            
            // Get products from this supplier
            const productsData = await productService.getProductsBySupplier(id);
            setProducts(productsData.items || []);
            
            setError(null);
        } catch (err) {
            console.error('Error loading company:', err);
            setError('Failed to load company details');
        } finally {
            setLoading(false);
        }
    };

    const getVerificationBadge = () => {
        if (company?.verificationStatus === 'Verified') {
            return (
                <span className="verification-badge-large verified">
                    <i className="fas fa-check-circle"></i> Verified Supplier
                </span>
            );
        }
        return (
            <span className="verification-badge-large pending">
                <i className="fas fa-clock"></i> Verification Pending
            </span>
        );
    };

    if (loading) {
        return <LoadingSpinner message="Loading company details..." />;
    }

    if (error || !company) {
        return <ErrorMessage message={error || "Company not found"} onRetry={loadCompanyData} />;
    }

    return (
        <div className="company-detail-page">
            {/* Company Header */}
            <div className="company-header-section">
                <div className="company-header-content">
                    <div className="company-logo-large">
                        <i className="fas fa-building"></i>
                    </div>
                    <div className="company-info-large">
                        <h1>{company.name}</h1>
                        {company.tin && <p className="company-tin">TIN: {company.tin}</p>}
                        {company.description && (
                            <p className="company-description">{company.description}</p>
                        )}
                        {getVerificationBadge()}
                    </div>
                </div>
            </div>

            {/* Company Details Grid */}
            <div className="company-details-grid">
                <div className="detail-card">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Location</h3>
                    {company.locations && company.locations.length > 0 ? (
                        company.locations.map((loc, idx) => (
                            <p key={idx}>
                                {loc.address}<br />
                                {loc.city}, {loc.country}
                            </p>
                        ))
                    ) : (
                        <p>Location information not available</p>
                    )}
                </div>
                
                <div className="detail-card">
                    <i className="fas fa-phone"></i>
                    <h3>Contact</h3>
                    {company.phone ? (
                        <p><i className="fas fa-phone-alt"></i> {company.phone}</p>
                    ) : (
                        <p>Contact information not available</p>
                    )}
                    {company.email && (
                        <p><i className="fas fa-envelope"></i> {company.email}</p>
                    )}
                </div>
                
                <div className="detail-card">
                    <i className="fas fa-chart-line"></i>
                    <h3>Business Info</h3>
                    <p><strong>Products:</strong> {company.productCount || 0}</p>
                    <p><strong>Rating:</strong> {company.rating || 'Not rated yet'}</p>
                    {company.establishedYear && (
                        <p><strong>Established:</strong> {company.establishedYear}</p>
                    )}
                </div>
            </div>

            {/* Products Section */}
            {products.length > 0 && (
                <div className="company-products-section">
                    <h2 className="section-title">Products from {company.name}</h2>
                    <ProductGrid products={products} loading={false} />
                </div>
            )}

            {/* Contact CTA */}
            <div className="contact-cta">
                <h3>Interested in partnering with {company.name}?</h3>
                <Link to={`/contact?company=${company.id}`} className="btn-primary">
                    Contact Supplier <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
};

export default CompanyDetailPage;