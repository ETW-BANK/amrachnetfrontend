import React from 'react';
import { Link } from 'react-router-dom';
import RFQCard from './RFQCard';

const RFQGrid = ({ rfqs, loading }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading RFQs...</p>
            </div>
        );
    }

    if (!rfqs || rfqs.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-file-alt"></i>
                <h3>No RFQs Found</h3>
                <p>There are no active RFQs at the moment. Check back later or create your own!</p>
                <Link to="/rfq/create" className="btn-primary">
                    Create RFQ <i className="fas fa-plus"></i>
                </Link>
            </div>
        );
    }

    return (
        <div className="rfq-grid">
            {rfqs.map(rfq => (
                <RFQCard key={rfq.id} rfq={rfq} />
            ))}
        </div>
    );
};

export default RFQGrid;