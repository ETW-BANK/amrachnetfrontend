import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { adminModules } from './adminModules';
import adminService from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const DashboardOverview = () => {
    const { user } = useAuth();
    const userRole = user?.roles?.[0] || user?.role || 'Buyer';
    const [adminOverview, setAdminOverview] = useState(null);
    const [loadingAdminOverview, setLoadingAdminOverview] = useState(false);
    const [adminError, setAdminError] = useState(null);

    // Mock stats - replace with real API data
    const baseStats = userRole === 'Admin' ? {
        totalUsers: 0,
        totalSellers: 0,
        totalBuyers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0
    } : userRole === 'Supplier' ? {
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

    const loadAdminOverview = useCallback(async () => {
        if (userRole !== 'Admin') {
            return;
        }

        try {
            setLoadingAdminOverview(true);
            const response = await adminService.getOverviewData();
            setAdminOverview(response);
            setAdminError(null);
        } catch (error) {
            console.error('Error loading admin overview:', error);
            setAdminError('Failed to load admin dashboard data');
        } finally {
            setLoadingAdminOverview(false);
        }
    }, [userRole]);

    useEffect(() => {
        loadAdminOverview();
    }, [loadAdminOverview]);

    const stats = userRole === 'Admin' && adminOverview
        ? {
            totalUsers: adminOverview.stats.totalUsers,
            totalSellers: adminOverview.stats.totalSellers,
            totalBuyers: adminOverview.stats.totalBuyers,
            totalProducts: adminOverview.stats.totalProducts,
            totalCategories: adminOverview.stats.totalCategories + adminOverview.stats.totalSubcategories,
            totalOrders: adminOverview.stats.totalOrders,
        }
        : baseStats;

    const recentActivity = [
        { id: 1, action: "Order #ORD-12345 placed", date: "2024-03-22", status: "Processing" },
        { id: 2, action: "RFQ #RFQ-67890 created", date: "2024-03-21", status: "Open" },
        { id: 3, action: "Quote received for RFQ-12345", date: "2024-03-20", status: "New" }
    ];

    if (userRole === 'Admin' && loadingAdminOverview) {
        return <LoadingSpinner message="Loading admin dashboard..." />;
    }

    if (userRole === 'Admin' && adminError) {
        return <ErrorMessage message={adminError} onRetry={loadAdminOverview} />;
    }

    return (
        <div className="dashboard-overview">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p>{userRole === 'Admin' ? "Here's your marketplace control center" : "Here's what's happening with your account"}</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {userRole === 'Admin' ? (
                    <>
                        <div className="stat-card">
                            <i className="fas fa-users"></i>
                            <div className="stat-info">
                                <h3>{stats.totalUsers}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-store"></i>
                            <div className="stat-info">
                                <h3>{stats.totalSellers}</h3>
                                <p>Total Sellers</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-shopping-bag"></i>
                            <div className="stat-info">
                                <h3>{stats.totalBuyers}</h3>
                                <p>Total Buyers</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-boxes"></i>
                            <div className="stat-info">
                                <h3>{stats.totalProducts}</h3>
                                <p>Total Products</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-tags"></i>
                            <div className="stat-info">
                                <h3>{stats.totalCategories}</h3>
                                <p>Categories</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-receipt"></i>
                            <div className="stat-info">
                                <h3>{stats.totalOrders}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                    </>
                ) : userRole === 'Supplier' ? (
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
                    {userRole === 'Admin' ? (
                        <>
                            {adminModules.slice(0, 6).map(module => (
                                <Link key={module.key} to={`/dashboard/admin/${module.key}`} className="action-card">
                                    <i className={module.icon}></i>
                                    <span>{module.title}</span>
                                </Link>
                            ))}
                        </>
                    ) : userRole === 'Supplier' ? (
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
                <h3>{userRole === 'Admin' ? 'Admin Modules' : 'Recent Activity'}</h3>
                <div className="activity-list">
                    {userRole === 'Admin' ? adminModules.map(module => (
                        <div key={module.key} className="activity-item">
                            <div className="activity-icon">
                                <i className={module.icon}></i>
                            </div>
                            <div className="activity-details">
                                <p>{module.title}</p>
                                <span>{module.description}</span>
                            </div>
                            <Link to={`/dashboard/admin/${module.key}`} className="activity-status status-new">
                                Open
                            </Link>
                        </div>
                    )) : recentActivity.map(activity => (
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

            {userRole === 'Admin' && adminOverview && (
                <div className="recent-activity">
                    <h3>Live Marketplace Snapshot</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-store"></i>
                            </div>
                            <div className="activity-details">
                                <p>Seller directory</p>
                                <span>{adminOverview.stats.totalSellersDirectory} companies available</span>
                            </div>
                            <span className="activity-status status-new">Live</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-file-signature"></i>
                            </div>
                            <div className="activity-details">
                                <p>Open RFQs</p>
                                <span>{adminOverview.stats.totalRfqs} requests currently open</span>
                            </div>
                            <span className="activity-status status-open">Open</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-receipt"></i>
                            </div>
                            <div className="activity-details">
                                <p>Order value</p>
                                <span>${Number(adminOverview.stats.totalOrderValue || 0).toLocaleString()} total marketplace value</span>
                            </div>
                            <span className="activity-status status-processing">Tracked</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="activity-details">
                                <p>Pending moderation</p>
                                <span>{adminOverview.stats.pendingReviews} reviews waiting for action</span>
                            </div>
                            <span className="activity-status status-pending">Pending</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;