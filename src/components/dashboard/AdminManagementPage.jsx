import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminModuleMap, adminModules } from './adminModules';
import adminService from '../../services/adminService';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const PAGE_SIZE = 8;

const initialCategoryForm = {
    name: '',
    description: '',
    icon: '',
    parentCategoryId: ''
};

const AdminManagementPage = () => {
    const { section } = useParams();
    const { user } = useAuth();
    const module = adminModuleMap[section];
    const [sectionData, setSectionData] = useState({ stats: [], records: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [parentCategories, setParentCategories] = useState([]);

    const loadSectionData = useCallback(async () => {
        if (!module) {
            return;
        }

        try {
            setLoading(true);
            const response = await adminService.getSectionData(section);
            setSectionData(response);
            setError(null);
        } catch (loadError) {
            console.error(`Error loading admin section ${section}:`, loadError);
            setError('Failed to load admin section data');
        } finally {
            setLoading(false);
        }
    }, [module, section]);

    const rootCategoryOptions = useMemo(() => {
        if (section === 'subcategories') {
            return parentCategories;
        }

        return (sectionData.items || []).filter(item => !item.parentCategoryId);
    }, [parentCategories, section, sectionData.items]);

    const statusOptions = useMemo(() => {
        const values = Array.from(new Set((sectionData.records || []).map(record => record.status).filter(Boolean)));
        return values;
    }, [sectionData.records]);

    const filteredRecords = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return (sectionData.records || []).filter(record => {
            const matchesSearch = !normalizedSearch || [
                record.title,
                record.subtitle,
                ...(record.meta || []),
                record.status,
            ].join(' ').toLowerCase().includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, sectionData.records, statusFilter]);

    const filteredItems = useMemo(() => {
        if (!Array.isArray(sectionData.items) || sectionData.items.length === 0) {
            return [];
        }

        const filteredIds = new Set(filteredRecords.map(record => record.id));
        return sectionData.items.filter(item => filteredIds.has(item.id));
    }, [filteredRecords, sectionData.items]);

    const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredRecords.slice(start, start + PAGE_SIZE);
    }, [currentPage, filteredRecords]);

    const pagedItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredItems.slice(start, start + PAGE_SIZE);
    }, [currentPage, filteredItems]);

    const resetCategoryForm = useCallback(() => {
        setEditingCategoryId(null);
        setCategoryForm({
            ...initialCategoryForm,
            parentCategoryId: section === 'subcategories' ? String(rootCategoryOptions[0]?.id || '') : ''
        });
    }, [rootCategoryOptions, section]);

    useEffect(() => {
        loadSectionData();
    }, [loadSectionData]);

    useEffect(() => {
        if (section === 'categories' || section === 'subcategories') {
            resetCategoryForm();
        }
    }, [resetCategoryForm, section]);

    useEffect(() => {
        setSearchTerm('');
        setStatusFilter('all');
        setCurrentPage(1);
        setActionError(null);
        setActionMessage('');
    }, [section]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        const loadParentCategories = async () => {
            if (section !== 'subcategories') {
                setParentCategories([]);
                return;
            }

            const categories = await categoryService.getAllCategories();
            setParentCategories((categories || []).filter(category => !category.parentCategoryId));
        };

        loadParentCategories();
    }, [section]);

    if (!module) {
        return <Navigate to="/dashboard" replace />;
    }

    if (loading) {
        return <LoadingSpinner message={`Loading ${module.title.toLowerCase()}...`} />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadSectionData} />;
    }

    const runAction = async (action, successMessage) => {
        try {
            setSubmitting(true);
            setActionError(null);
            setActionMessage('');
            await action();
            setActionMessage(successMessage);
            await loadSectionData();
        } catch (actionFailure) {
            console.error(`Admin action failed in ${section}:`, actionFailure);
            setActionError(actionFailure.message || 'Admin action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user account? This cannot be undone.')) {
            return;
        }

        await runAction(() => adminService.deleteUser(userId), 'User deleted successfully.');
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: categoryForm.name.trim(),
            description: categoryForm.description.trim() || null,
            icon: categoryForm.icon.trim() || null,
            parentCategoryId: categoryForm.parentCategoryId ? Number(categoryForm.parentCategoryId) : null,
            attributesJson: null
        };

        if (!payload.name) {
            setActionError('Category name is required.');
            return;
        }

        if (section === 'subcategories' && !payload.parentCategoryId) {
            setActionError('A parent category is required for subcategories.');
            return;
        }

        await runAction(
            () => editingCategoryId
                ? adminService.updateCategory(editingCategoryId, payload)
                : adminService.createCategory(payload),
            editingCategoryId ? 'Category updated successfully.' : 'Category created successfully.'
        );

        resetCategoryForm();
    };

    const handleEditCategory = (category) => {
        setEditingCategoryId(category.id);
        setCategoryForm({
            name: category.name || '',
            description: category.description || '',
            icon: category.icon || '',
            parentCategoryId: category.parentCategoryId ? String(category.parentCategoryId) : ''
        });
        setActionMessage('');
        setActionError(null);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Delete this category? Products or subcategories linked to it may block deletion.')) {
            return;
        }

        const usageStatus = await categoryService.getCategoryUsageStatus(categoryId);
        if (usageStatus.hasProducts) {
            setActionError('This category cannot be deleted because it still has products assigned to it. Move or remove those products first.');
            return;
        }

        if (usageStatus.inUse) {
            setActionError('This category cannot be deleted because it is still in use. Remove dependent subcategories or references first.');
            return;
        }

        await runAction(() => adminService.deleteCategory(categoryId), 'Category deleted successfully.');
        resetCategoryForm();
    };

    const handleVerifySeller = async (companyId) => {
        if (!user?.id) {
            setActionError('Your admin user ID is missing, so verification cannot be submitted.');
            return;
        }

        await runAction(
            () => adminService.verifySeller(companyId, user.id, 'Verified from admin dashboard'),
            'Seller verified successfully.'
        );
    };

    const handleToggleProduct = async (product) => {
        await runAction(
            () => adminService.toggleProductStatus(product.id, !(product.isActive !== false)),
            `Product ${product.isActive !== false ? 'disabled' : 'enabled'} successfully.`
        );
    };

    const handleModerateReview = async (reviewId, newStatus) => {
        if (!user?.id) {
            setActionError('Your admin user ID is missing, so moderation cannot be submitted.');
            return;
        }

        await runAction(
            () => adminService.moderateReview({
                reviewId,
                newStatus,
                moderationNotes: 'Updated from admin dashboard',
                moderatorId: user.id
            }),
            'Review moderation saved successfully.'
        );
    };

    const renderActionCenter = () => {
        if (section === 'users') {
            return (
                <div className="quick-actions">
                    <h3>Live User Actions</h3>
                    <div className="activity-list">
                        {pagedItems.map(item => (
                            <div key={`user-${item.id}`} className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="activity-details">
                                    <p>{`${item.firstName || ''} ${item.lastName || ''}`.trim() || item.email}</p>
                                    <span>{item.email}</span>
                                    <span>{(item.roles || []).join(', ') || 'No role'}</span>
                                    <span>{item.phoneNumber || 'No phone number'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                                    <button type="button" className="btn-outline" onClick={() => handleDeleteUser(item.id)} disabled={submitting}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="section-subtitle">Role changes, blocking, and password reset still need backend role-lookup or dedicated endpoints before they can be safely wired here.</p>
                </div>
            );
        }

        if (section === 'categories' || section === 'subcategories') {
            return (
                <>
                    <div className="quick-actions">
                        <h3>{editingCategoryId ? 'Edit Category' : section === 'subcategories' ? 'Add Subcategory' : 'Add Category'}</h3>
                        <form onSubmit={handleCategorySubmit} className="auth-form" style={{ marginTop: '1rem' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input value={categoryForm.name} onChange={(event) => setCategoryForm(prev => ({ ...prev, name: event.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Icon</label>
                                    <input value={categoryForm.icon} onChange={(event) => setCategoryForm(prev => ({ ...prev, icon: event.target.value }))} placeholder="phones" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input value={categoryForm.description} onChange={(event) => setCategoryForm(prev => ({ ...prev, description: event.target.value }))} />
                            </div>
                            {section === 'subcategories' && (
                                <div className="form-group">
                                    <label>Parent Category</label>
                                    <select value={categoryForm.parentCategoryId} onChange={(event) => setCategoryForm(prev => ({ ...prev, parentCategoryId: event.target.value }))}>
                                        <option value="">Select parent category</option>
                                        {rootCategoryOptions.map(category => (
                                            <option key={`parent-${category.id}`} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {editingCategoryId ? 'Save Changes' : 'Create'}
                                </button>
                                {editingCategoryId && (
                                    <button type="button" className="btn-outline" onClick={resetCategoryForm} disabled={submitting}>
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="recent-activity">
                        <h3>Manage Existing {section === 'subcategories' ? 'Subcategories' : 'Categories'}</h3>
                        <div className="activity-list">
                            {pagedItems.map(item => (
                                <div key={`category-${item.id}`} className="activity-item">
                                    <div className="activity-icon">
                                        <i className={module.icon}></i>
                                    </div>
                                    <div className="activity-details">
                                        <p>{item.name}</p>
                                        <span>{item.description || 'No description'}</span>
                                        <span>{item.parentCategoryName || 'Root category'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                                        <button type="button" className="btn-outline" onClick={() => handleEditCategory(item)} disabled={submitting}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn-outline" onClick={() => handleDeleteCategory(item.id)} disabled={submitting}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );
        }

        if (section === 'sellers') {
            return (
                <div className="quick-actions">
                    <h3>Seller Verification</h3>
                    <div className="activity-list">
                        {pagedItems.map(item => {
                            const status = Number(item.verificationStatus);
                            const isVerified = status === 2 || status === 3 || status === 4;

                            return (
                                <div key={`seller-${item.id}`} className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-building"></i>
                                    </div>
                                    <div className="activity-details">
                                        <p>{item.name}</p>
                                        <span>{item.businessType || 'No business type'}</span>
                                        <span>{item.tin || 'No TIN'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                                        <span className="activity-status status-new">{sectionData.records.find(record => record.id === item.id)?.status || 'Unknown'}</span>
                                        {!isVerified && (
                                            <button type="button" className="btn-primary" onClick={() => handleVerifySeller(item.id)} disabled={submitting}>
                                                Verify
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (section === 'products') {
            return (
                <div className="quick-actions">
                    <h3>Product Status Control</h3>
                    <div className="activity-list">
                        {pagedItems.map(item => (
                            <div key={`product-${item.id}`} className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-box"></i>
                                </div>
                                <div className="activity-details">
                                    <p>{item.name}</p>
                                    <span>{item.categoryName || 'No category'}</span>
                                    <span>{item.supplierName || 'No supplier'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                                    <span className="activity-status status-new">{item.isActive === false ? 'Disabled' : 'Active'}</span>
                                    <button type="button" className="btn-outline" onClick={() => handleToggleProduct(item)} disabled={submitting}>
                                        {item.isActive === false ? 'Enable' : 'Disable'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === 'moderation') {
            return (
                <div className="quick-actions">
                    <h3>Review Moderation</h3>
                    <div className="activity-list">
                        {pagedItems.map(item => (
                            <div key={`review-${item.id}`} className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="activity-details">
                                    <p>{item.productName || item.supplierName || `Review #${item.id}`}</p>
                                    <span>{item.reviewerName || 'Unknown reviewer'}</span>
                                    <span>{item.comment || 'No comment provided'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                                    <button type="button" className="btn-primary" onClick={() => handleModerateReview(item.id, 2)} disabled={submitting}>
                                        Approve
                                    </button>
                                    <button type="button" className="btn-outline" onClick={() => handleModerateReview(item.id, 3)} disabled={submitting}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="dashboard-overview">
            <div className="dashboard-header">
                <h1>{module.title}</h1>
                <p>{module.description}</p>
            </div>

            {actionError && <ErrorMessage message={actionError} />}
            {actionMessage && (
                <div className="auth-success" style={{ marginBottom: '1.5rem' }}>
                    <i className="fas fa-check-circle"></i> {actionMessage}
                </div>
            )}

            {(sectionData.records || []).length > 0 && (
                <div className="quick-actions">
                    <h3>Browse Data</h3>
                    <div className="search-bar-container" style={{ marginBottom: '1rem' }}>
                        <div className="search-input-wrapper">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                className="search-input-large"
                                placeholder={`Search ${module.title.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ minWidth: '220px', marginBottom: 0 }}>
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="all">All statuses</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="section-subtitle">
                        Showing {pagedRecords.length} of {filteredRecords.length} matching records.
                    </p>
                </div>
            )}

            <div className="stats-grid">
                {sectionData.stats.map((stat, index) => (
                    <div className="stat-card" key={`${stat.label}-${index}`}>
                        <i className={index === 0 ? module.icon : index === 1 ? 'fas fa-layer-group' : 'fas fa-signal'}></i>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
                <div className="stat-card">
                    <i className="fas fa-user-shield"></i>
                    <div className="stat-info">
                        <h3>{adminModules.length}</h3>
                        <p>Total Admin Modules</p>
                    </div>
                </div>
            </div>

            {renderActionCenter()}

            <div className="quick-actions">
                <h3>Management Capabilities</h3>
                <div className="activity-list">
                    {module.actions.map(action => (
                        <div key={action} className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="activity-details">
                                <p>{action}</p>
                                <span>{module.title}</span>
                            </div>
                            <span className="activity-status status-new">Ready</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-activity">
                <h3>Live Data</h3>
                <div className="activity-list">
                    {pagedRecords.length > 0 ? pagedRecords.map(record => (
                        <div key={`${record.id}-${record.title}`} className="activity-item">
                            <div className="activity-icon">
                                <i className={module.icon}></i>
                            </div>
                            <div className="activity-details">
                                <p>{record.title}</p>
                                <span>{record.subtitle}</span>
                                {record.meta?.map((item, index) => (
                                    <span key={`${record.id}-meta-${index}`}>{item}</span>
                                ))}
                            </div>
                            <span className="activity-status status-new">{record.status}</span>
                        </div>
                    )) : (
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-database"></i>
                            </div>
                            <div className="activity-details">
                                <p>No live records returned</p>
                                <span>This section is connected, but the API returned no rows yet.</span>
                            </div>
                            <span className="activity-status status-pending">Empty</span>
                        </div>
                    )}
                </div>
                {filteredRecords.length > PAGE_SIZE && (
                    <div className="pagination">
                        <button
                            type="button"
                            className="page-btn"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="page-info">Page {currentPage} of {totalPages}</span>
                        <button
                            type="button"
                            className="page-btn"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {module.relatedLinks?.length > 0 && (
                <div className="quick-actions">
                    <h3>Related Pages</h3>
                    <div className="actions-grid">
                        {module.relatedLinks.map(link => (
                            <Link key={link.to} to={link.to} className="action-card">
                                <i className="fas fa-arrow-right"></i>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementPage;