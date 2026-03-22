import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
    const { user } = useAuth();
    const userRole = user?.roles?.[0] || user?.role || 'Buyer';

    // Mock stats - replace with real API data
    const stats = userRole === 'Supplier' ? {
        totalProducts: 12,
        totalOrders: 8,
        pendingOrders: 3,
        totalRevenue: 15420,
        rating: 4.8,
        totalQuotes: 15
    } : {
        totalOrders: 5,
        pendingOrders: 2,
        activeRFQs: 3,
        quotesReceived: 7,
        savedItems: 4,
        totalSpent: 12500
    };

    const recentActivity = [
        { id: 1, action: "Order #ORD-12345 placed", date: "2024-03-22", status: "Processing" },
        { id: 2, action: "RFQ #RFQ-67890 created", date: "2024-03-21", status: "Open" },
        { id: 3, action: "Quote received for RFQ-12345", date: "2024-03-20", status: "New" }
    ];

    return (
        <div className="dashboard-overview">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p>Here's what's happening with your account</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {userRole === 'Supplier' ? (
                    <>
                        <div className="stat-card">
                            <i className="fas fa-box"></i>
                            <div className="stat-info">
                                <h3>{stats.totalProducts}</h3>
                                <p>Total Products</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-shopping-cart"></i>
                            <div className="stat-info">
                                <h3>{stats.totalOrders}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-clock"></i>
                            <div className="stat-info">
                                <h3>{stats.pendingOrders}</h3>
                                <p>Pending Orders</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-dollar-sign"></i>
                            <div className="stat-info">
                                <h3>${stats.totalRevenue.toLocaleString()}</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-star"></i>
                            <div className="stat-info">
                                <h3>{stats.rating}</h3>
                                <p>Rating</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-file-alt"></i>
                            <div className="stat-info">
                                <h3>{stats.totalQuotes}</h3>
                                <p>Quotes Sent</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="stat-card">
                            <i className="fas fa-shopping-bag"></i>
                            <div className="stat-info">
                                <h3>{stats.totalOrders}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-clock"></i>
                            <div className="stat-info">
                                <h3>{stats.pendingOrders}</h3>
                                <p>Pending Orders</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-file-alt"></i>
                            <div className="stat-info">
                                <h3>{stats.activeRFQs}</h3>
                                <p>Active RFQs</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-receipt"></i>
                            <div className="stat-info">
                                <h3>{stats.quotesReceived}</h3>
                                <p>Quotes Received</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-heart"></i>
                            <div className="stat-info">
                                <h3>{stats.savedItems}</h3>
                                <p>Saved Items</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-dollar-sign"></i>
                            <div className="stat-info">
                                <h3>${stats.totalSpent.toLocaleString()}</h3>
                                <p>Total Spent</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    {userRole === 'Supplier' ? (
                        <>
                            <Link to="/dashboard/products/new" className="action-card">
                                <i className="fas fa-plus-circle"></i>
                                <span>Add Product</span>
                            </Link>
                            <Link to="/dashboard/orders" className="action-card">
                                <i className="fas fa-truck"></i>
                                <span>Process Orders</span>
                            </Link>
                            <Link to="/rfq" className="action-card">
                                <i className="fas fa-file-alt"></i>
                                <span>Browse RFQs</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/products" className="action-card">
                                <i className="fas fa-search"></i>
                                <span>Browse Products</span>
                            </Link>
                            <Link to="/rfq/create" className="action-card">
                                <i className="fas fa-plus-circle"></i>
                                <span>Create RFQ</span>
                            </Link>
                            <Link to="/cart" className="action-card">
                                <i className="fas fa-shopping-cart"></i>
                                <span>View Cart</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-bell"></i>
                            </div>
                            <div className="activity-details">
                                <p>{activity.action}</p>
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                            </div>
                            <span className={`activity-status status-${activity.status.toLowerCase()}`}>
                                {activity.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;