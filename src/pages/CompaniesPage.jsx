import React, { useState, useEffect } from 'react';
import CompanyGrid from '../components/companies/CompanyGrid';
import companyService from '../services/companyService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVerified, setFilterVerified] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [searchTerm, filterVerified, companies]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            let data;
            if (filterVerified) {
                data = await companyService.getVerifiedCompanies();
            } else {
                data = await companyService.getAllCompanies();
            }
            setCompanies(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching companies:', err);
            setError('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const filterCompanies = () => {
        let filtered = [...companies];

        if (searchTerm) {
            filtered = filtered.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCompanies(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        filterCompanies();
    };

    const toggleVerifiedFilter = async () => {
        setFilterVerified(!filterVerified);
        setLoading(true);
        try {
            let data;
            if (!filterVerified) {
                data = await companyService.getVerifiedCompanies();
            } else {
                data = await companyService.getAllCompanies();
            }
            setCompanies(data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchCompanies} />;
    }

    return (
        <div className="companies-page">
            <div className="page-header">
                <h1 className="section-title">Suppliers Directory</h1>
                <p className="section-subtitle">Connect with verified B2B suppliers and manufacturers worldwide</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="companies-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    <button type="submit" className="btn-primary">
                        Search
                    </button>
                </form>

                <div className="filter-options">
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={filterVerified}
                            onChange={toggleVerifiedFilter}
                        />
                        <i className="fas fa-check-circle"></i>
                        Show Verified Only
                    </label>
                </div>
            </div>

            {/* Stats */}
            <div className="companies-stats">
                <div className="stat-card">
                    <i className="fas fa-building"></i>
                    <h3>{companies.length}</h3>
                    <p>Total Suppliers</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-check-circle"></i>
                    <h3>{companies.filter(c => c.verificationStatus === 'Verified').length}</h3>
                    <p>Verified Suppliers</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-chart-line"></i>
                    <h3>24/7</h3>
                    <p>Support Available</p>
                </div>
            </div>

            {/* Companies Grid */}
            <CompanyGrid companies={filteredCompanies} loading={loading} />
        </div>
    );
};

export default CompaniesPage;