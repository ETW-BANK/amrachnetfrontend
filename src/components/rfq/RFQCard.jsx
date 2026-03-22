import React from 'react';
import { Link } from 'react-router-dom';

const RFQCard = ({ rfq }) => {
    const getStatusBadge = () => {
        const statuses = {
            0: { label: 'Open', class: 'status-open' },
            1: { label: 'In Review', class: 'status-review' },
            2: { label: 'Awarded', class: 'status-awarded' },
            3: { label: 'Closed', class: 'status-closed' },
            4: { label: 'Cancelled', class: 'status-cancelled' }
        };
        const status = statuses[rfq.status] || statuses[0];
        return <span className={`rfq-status ${status.class}`}>{status.label}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="rfq-card">
            <div className="rfq-header">
                <div className="rfq-info">
                    <h3>{rfq.title}</h3>
                    <p className="rfq-description">{rfq.description?.substring(0, 100)}</p>
                </div>
                {getStatusBadge()}
            </div>

            <div className="rfq-details">
                <div className="rfq-detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Created: {formatDate(rfq.createdDate)}</span>
                </div>
                <div className="rfq-detail-item">
                    <i className="fas fa-clock"></i>
                    <span>Deadline: {formatDate(rfq.deadline)}</span>
                </div>
                <div className="rfq-detail-item">
                    <i className="fas fa-box"></i>
                    <span>{rfq.lineItems?.length || 0} items</span>
                </div>
                <div className="rfq-detail-item">
                    <i className="fas fa-building"></i>
                    <span>{rfq.quoteCount || 0} quotes</span>
                </div>
            </div>

            <div className="rfq-footer">
                <Link to={`/rfq/${rfq.id}`} className="btn-outline">
                    View Details <i className="fas fa-arrow-right"></i>
                </Link>
                {rfq.status === 0 && (
                    <button className="btn-primary">
                        Submit Quote <i className="fas fa-paper-plane"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default RFQCard;