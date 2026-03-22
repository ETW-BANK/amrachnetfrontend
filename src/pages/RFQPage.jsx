import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RFQGrid from '../components/rfq/RFQGrid';
import rfqService from '../services/rfqService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const RFQPage = () => {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, open, awarded, closed
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRFQs();
    }, []);

    const fetchRFQs = async () => {
        try {
            setLoading(true);
            const data = await rfqService.getAllRFQs();
            setRfqs(data.items || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching RFQs:', err);
            setError('Failed to load RFQs');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredRFQs = () => {
        let filtered = [...rfqs];
        
        if (filter !== 'all') {
            const statusMap = {
                open: 0,
                awarded: 2,
                closed: 3
            };
            filtered = filtered.filter(rfq => rfq.status === statusMap[filter]);
        }
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(rfq =>
                rfq.title?.toLowerCase().includes(term) ||
                rfq.description?.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    };

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchRFQs} />;
    }

    const filteredRFQs = getFilteredRFQs();

    return (
        <div className="rfq-page">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="section-title">Request for Quote (RFQ)</h1>
                        <p className="section-subtitle">
                            Browse and respond to RFQs or create your own to get competitive quotes from suppliers
                        </p>
                    </div>
                    <Link to="/rfq/create" className="btn-primary">
                        <i className="fas fa-plus"></i> Create RFQ
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="rfq-filters">
                <div className="filter-tabs">
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All RFQs
                    </button>
                    <button 
                        className={filter === 'open' ? 'active' : ''}
                        onClick={() => setFilter('open')}
                    >
                        Open
                    </button>
                    <button 
                        className={filter === 'awarded' ? 'active' : ''}
                        onClick={() => setFilter('awarded')}
                    >
                        Awarded
                    </button>
                    <button 
                        className={filter === 'closed' ? 'active' : ''}
                        onClick={() => setFilter('closed')}
                    >
                        Closed
                    </button>
                </div>
                
                <div className="search-wrapper">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search RFQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="rfq-stats">
                <div className="stat-card">
                    <i className="fas fa-file-alt"></i>
                    <h3>{rfqs.length}</h3>
                    <p>Total RFQs</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-clock"></i>
                    <h3>{rfqs.filter(r => r.status === 0).length}</h3>
                    <p>Open RFQs</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-trophy"></i>
                    <h3>{rfqs.filter(r => r.status === 2).length}</h3>
                    <p>Awarded</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>{rfqs.reduce((sum, r) => sum + (r.quoteCount || 0), 0)}</h3>
                    <p>Total Quotes</p>
                </div>
            </div>

            {/* RFQ Grid */}
            <RFQGrid rfqs={filteredRFQs} loading={loading} />
        </div>
    );
};

export default RFQPage;