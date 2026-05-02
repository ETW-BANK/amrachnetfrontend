import api from './api';
import categoryService from './categoryService';
import companyService from './companyService';
import productService from './productService';

const toArray = (value) => Array.isArray(value) ? value : [];

const hasRole = (user, role) => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    return roles.includes(role);
};

const reviewStatusLabels = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
    4: 'Hidden'
};

const verificationStatusLabels = {
    0: 'Registered',
    1: 'UnderReview',
    2: 'Verified',
    3: 'Approved',
    4: 'Preferred',
    5: 'Suspended',
    6: 'Rejected'
};

const formatReviewStatus = (value) => reviewStatusLabels[value] || String(value ?? 'Unknown');
const formatVerificationStatus = (value) => verificationStatusLabels[value] || String(value ?? 'Unknown');

export const adminService = {
    getOverviewData: async () => {
        const [
            usersResponse,
            categoriesResponse,
            productsResponse,
            companiesResponse,
            orderAnalyticsResponse,
            quoteAnalyticsResponse,
            openRfqsResponse,
            pendingReviewsResponse,
        ] = await Promise.all([
            api.get('/Users').catch(() => []),
            categoryService.getAllCategories().catch(() => []),
            productService.getAllProducts(1, 1000).catch(() => ({ items: [] })),
            companyService.getAllCompanies().catch(() => []),
            api.get('/PurchaseOrder/analytics').catch(() => null),
            api.get('/Quotes/analytics').catch(() => null),
            api.get('/RFQ/open').catch(() => []),
            api.get('/Review/pending-moderation').catch(() => []),
        ]);

        const users = toArray(usersResponse);
        const categories = toArray(categoriesResponse);
        const products = toArray(productsResponse?.items);
        const companies = toArray(companiesResponse);
        const openRfqs = toArray(openRfqsResponse);
        const pendingReviews = toArray(pendingReviewsResponse);

        return {
            stats: {
                totalUsers: users.length,
                totalAdmins: users.filter(user => hasRole(user, 'Admin')).length,
                totalSellers: users.filter(user => hasRole(user, 'Supplier')).length,
                totalBuyers: users.filter(user => hasRole(user, 'Buyer')).length,
                totalProducts: products.length,
                totalCategories: categories.filter(category => !category.parentCategoryId).length,
                totalSubcategories: categories.filter(category => category.parentCategoryId).length,
                totalSellersDirectory: companies.length,
                totalOrders: orderAnalyticsResponse?.totalOrders || 0,
                totalOrderValue: orderAnalyticsResponse?.totalValue || 0,
                pendingOrders: orderAnalyticsResponse?.pendingOrders || 0,
                totalQuotes: quoteAnalyticsResponse?.totalQuotes || 0,
                totalRfqs: openRfqs.length,
                pendingReviews: pendingReviews.length,
            }
        };
    },

    getSectionData: async (section) => {
        switch (section) {
            case 'users': {
                const users = toArray(await api.get('/Users').catch(() => []));
                return {
                    stats: [
                        { label: 'All Users', value: users.length },
                        { label: 'Admins', value: users.filter(user => hasRole(user, 'Admin')).length },
                        { label: 'Sellers', value: users.filter(user => hasRole(user, 'Supplier')).length },
                        { label: 'Buyers', value: users.filter(user => hasRole(user, 'Buyer')).length },
                    ],
                    items: users,
                    records: users.slice(0, 20).map(user => ({
                        id: user.id,
                        title: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                        subtitle: user.email,
                        meta: [user.phoneNumber || 'No phone', (user.roles || []).join(', ') || 'No role'],
                        status: user.isEmailVerified ? 'Verified' : 'Unverified'
                    }))
                };
            }
            case 'categories':
            case 'subcategories': {
                const categories = toArray(await categoryService.getAllCategories().catch(() => []));
                const filtered = section === 'subcategories'
                    ? categories.filter(category => category.parentCategoryId)
                    : categories.filter(category => !category.parentCategoryId);

                return {
                    stats: [
                        { label: 'Visible Items', value: filtered.length },
                        { label: 'With Products', value: filtered.filter(category => Number(category.productCount) > 0).length },
                        { label: 'Total Products', value: filtered.reduce((sum, category) => sum + Number(category.productCount || 0), 0) },
                    ],
                    items: filtered,
                    records: filtered.slice(0, 20).map(category => ({
                        id: category.id,
                        title: category.name,
                        subtitle: category.description || 'No description',
                        meta: [category.parentCategoryName || 'Root category'],
                        status: `${category.productCount || 0} products`
                    }))
                };
            }
            case 'products': {
                const productResponse = await productService.getAllProducts(1, 1000).catch(() => ({ items: [] }));
                const products = toArray(productResponse?.items);

                return {
                    stats: [
                        { label: 'All Products', value: products.length },
                        { label: 'Active Products', value: products.filter(product => product.isActive !== false).length },
                        { label: 'Suppliers', value: new Set(products.map(product => product.supplierId).filter(Boolean)).size },
                    ],
                    items: products,
                    records: products.slice(0, 20).map(product => ({
                        id: product.id,
                        title: product.name,
                        subtitle: product.categoryName || 'No category',
                        meta: [product.supplierName || 'No supplier', `Stock ${product.totalStock ?? 0}`],
                        status: product.isActive === false ? 'Disabled' : 'Active'
                    }))
                };
            }
            case 'orders': {
                const analytics = await api.get('/PurchaseOrder/analytics').catch(() => ({}));
                return {
                    stats: [
                        { label: 'Total Orders', value: analytics?.totalOrders || 0 },
                        { label: 'Pending', value: analytics?.pendingOrders || 0 },
                        { label: 'Completed', value: analytics?.completedOrders || 0 },
                        { label: 'Cancelled', value: analytics?.cancelledOrders || 0 },
                    ],
                    items: analytics,
                    records: Object.entries(analytics?.ordersByStatus || {}).map(([status, value], index) => ({
                        id: index + 1,
                        title: status,
                        subtitle: 'Orders by status',
                        meta: [`${value} orders`],
                        status: 'Live'
                    }))
                };
            }
            case 'rfqs': {
                const rfqs = toArray(await api.get('/RFQ/open').catch(() => []));
                return {
                    stats: [
                        { label: 'Open RFQs', value: rfqs.length },
                        { label: 'With Quotes', value: rfqs.filter(rfq => rfq.hasQuotes).length },
                        { label: 'Quote Responses', value: rfqs.reduce((sum, rfq) => sum + Number(rfq.quoteCount || 0), 0) },
                    ],
                    items: rfqs,
                    records: rfqs.slice(0, 20).map(rfq => ({
                        id: rfq.id,
                        title: rfq.title || rfq.rfqNumber,
                        subtitle: rfq.buyerName || 'Unknown buyer',
                        meta: [`${rfq.lineItemCount || 0} line items`, `${rfq.quoteCount || 0} quotes`],
                        status: rfq.status || 'Open'
                    }))
                };
            }
            case 'quotes': {
                const analytics = await api.get('/Quotes/analytics').catch(() => ({}));
                return {
                    stats: [
                        { label: 'Total Quotes', value: analytics?.totalQuotes || 0 },
                        { label: 'Conversion Rate', value: `${Number(analytics?.conversionRate || 0).toFixed(2)}%` },
                        { label: 'Avg Response Hours', value: Number(analytics?.averageResponseTimeHours || 0).toFixed(1) },
                    ],
                    items: analytics,
                    records: Object.entries(analytics?.quotesByCategory || {}).map(([category, value], index) => ({
                        id: index + 1,
                        title: category,
                        subtitle: 'Quotes by category',
                        meta: [`${value} quotes`],
                        status: 'Live'
                    }))
                };
            }
            case 'sellers': {
                const companies = toArray(await companyService.getAllCompanies().catch(() => []));
                return {
                    stats: [
                        { label: 'All Sellers', value: companies.length },
                        { label: 'Verified', value: companies.filter(company => Number(company.verificationStatus) === 2 || Number(company.verificationStatus) === 3 || Number(company.verificationStatus) === 4).length },
                        { label: 'Pending Verification', value: companies.filter(company => Number(company.verificationStatus) !== 2 && Number(company.verificationStatus) !== 3 && Number(company.verificationStatus) !== 4).length },
                    ],
                    items: companies,
                    records: companies.slice(0, 20).map(company => ({
                        id: company.id,
                        title: company.name,
                        subtitle: company.businessType || 'No business type',
                        meta: [company.tin || 'No TIN', company.businessLicenseNumber || 'No license'],
                        status: formatVerificationStatus(company.verificationStatus)
                    }))
                };
            }
            case 'moderation': {
                const reviews = toArray(await api.get('/Review/pending-moderation').catch(() => []));
                return {
                    stats: [
                        { label: 'Pending Reviews', value: reviews.length },
                        { label: 'Recommended', value: reviews.filter(review => review.isRecommended).length },
                        { label: 'Verified Purchases', value: reviews.filter(review => review.isVerifiedPurchase).length },
                    ],
                    items: reviews,
                    records: reviews.slice(0, 20).map(review => ({
                        id: review.id,
                        title: review.productName || review.supplierName || `Review #${review.id}`,
                        subtitle: review.reviewerName || 'Unknown reviewer',
                        meta: [`Rating ${review.rating || 0}/5`, review.comment || 'No comment'],
                        status: formatReviewStatus(review.status)
                    }))
                };
            }
            case 'settings':
                return {
                    stats: [
                        { label: 'API Status', value: 'Connected' },
                        { label: 'Config Endpoints', value: 'Not exposed' },
                    ],
                    records: [
                        {
                            id: 1,
                            title: 'System settings API',
                            subtitle: 'No dedicated settings endpoints are published in Swagger yet.',
                            meta: ['Shipping, tax, payment, and template settings still require backend endpoints'],
                            status: 'Pending backend'
                        }
                    ]
                };
            case 'reports': {
                const [orderAnalytics, quoteAnalytics] = await Promise.all([
                    api.get('/PurchaseOrder/analytics').catch(() => ({})),
                    api.get('/Quotes/analytics').catch(() => ({})),
                ]);

                return {
                    stats: [
                        { label: 'Order Value', value: `$${Number(orderAnalytics?.totalValue || 0).toLocaleString()}` },
                        { label: 'Avg Order Value', value: `$${Number(orderAnalytics?.averageOrderValue || 0).toLocaleString()}` },
                        { label: 'Quote Amount', value: `$${Number(quoteAnalytics?.totalQuoteAmount || 0).toLocaleString()}` },
                    ],
                    records: [
                        {
                            id: 1,
                            title: 'Orders report',
                            subtitle: 'Purchase order analytics',
                            meta: [`${orderAnalytics?.totalOrders || 0} total orders`, `${orderAnalytics?.pendingOrders || 0} pending`],
                            status: 'Live'
                        },
                        {
                            id: 2,
                            title: 'Quotes report',
                            subtitle: 'Quote analytics',
                            meta: [`${quoteAnalytics?.totalQuotes || 0} total quotes`, `${Number(quoteAnalytics?.conversionRate || 0).toFixed(2)}% conversion`],
                            status: 'Live'
                        }
                    ]
                };
            }
            default:
                return { stats: [], records: [] };
        }
    },

    deleteUser: async (userId) => {
        await api.delete(`/Users/${userId}`);
    },

    createCategory: async (payload) => {
        return await categoryService.createCategory(payload);
    },

    updateCategory: async (categoryId, payload) => {
        return await categoryService.updateCategory(categoryId, payload);
    },

    deleteCategory: async (categoryId) => {
        await categoryService.deleteCategory(categoryId);
    },

    verifySeller: async (companyId, adminUserId, notes = '') => {
        return await companyService.verifyCompany(companyId, adminUserId, notes);
    },

    toggleProductStatus: async (productId, isActive) => {
        return await productService.toggleProductStatus(productId, isActive);
    },

    moderateReview: async (payload) => {
        return await api.post('/Review/moderate', payload);
    }
};

export default adminService;