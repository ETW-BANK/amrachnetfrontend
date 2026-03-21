import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-primary">
                    <i className="fas fa-sync-alt"></i> Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;