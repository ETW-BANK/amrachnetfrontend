import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const userRole = user?.roles?.[0] || user?.role || 'Buyer';

    const buyerNavItems = [
        { to: "/dashboard", label: "Overview", icon: "fas fa-chart-line" },
        { to: "/dashboard/orders", label: "My Orders", icon: "fas fa-shopping-bag" },
        { to: "/dashboard/rfqs", label: "My RFQs", icon: "fas fa-file-alt" },
        { to: "/dashboard/quotes", label: "Quotes Received", icon: "fas fa-receipt" },
        { to: "/dashboard/wishlist", label: "Wishlist", icon: "fas fa-heart" },
        { to: "/dashboard/profile", label: "Profile Settings", icon: "fas fa-user-cog" }
    ];

    const supplierNavItems = [
        { to: "/dashboard", label: "Overview", icon: "fas fa-chart-line" },
        { to: "/dashboard/products", label: "My Products", icon: "fas fa-box" },
        { to: "/dashboard/orders", label: "Orders Received", icon: "fas fa-truck" },
        { to: "/dashboard/rfqs", label: "RFQ Responses", icon: "fas fa-file-alt" },
        { to: "/dashboard/quotes", label: "My Quotes", icon: "fas fa-receipt" },
        { to: "/dashboard/company", label: "Company Profile", icon: "fas fa-building" },
        { to: "/dashboard/profile", label: "Profile Settings", icon: "fas fa-user-cog" }
    ];

    const navItems = userRole === 'Supplier' ? supplierNavItems : buyerNavItems;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="user-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="user-info">
                        <h4>{user?.firstName} {user?.lastName}</h4>
                        <p className="user-role">{userRole}</p>
                        {user?.companyName && (
                            <p className="user-company">{user.companyName}</p>
                        )}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => 
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn-sidebar">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;