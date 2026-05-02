export const adminModules = [
    {
        key: 'users',
        title: 'User Management',
        icon: 'fas fa-users-cog',
        description: 'Control registered buyers, sellers, and admins from one place.',
        actions: [
            'View all registered users',
            'Delete user accounts',
            'Block or unblock users',
            'Change user roles',
            'Reset user passwords',
            'View user activity logs',
            'Approve or reject seller registrations',
            'Review user details such as email, phone, address, and join date'
        ]
    },
    {
        key: 'categories',
        title: 'Category Management',
        icon: 'fas fa-tags',
        description: 'Manage catalog categories and their storefront visibility.',
        actions: [
            'View all categories',
            'Add new categories',
            'Edit category names and descriptions',
            'Delete categories with confirmation',
            'View products in each category',
            'Enable or disable categories',
            'Set category order or priority',
            'Add category images or icons'
        ],
        relatedLinks: [
            { label: 'Browse categories', to: '/categories' }
        ]
    },
    {
        key: 'subcategories',
        title: 'Subcategory Management',
        icon: 'fas fa-sitemap',
        description: 'Organize category hierarchies and child navigation flows.',
        actions: [
            'View all subcategories',
            'Add new subcategories under a parent category',
            'Edit subcategory details',
            'Delete subcategories',
            'Enable or disable subcategories',
            'Set subcategory order within a category'
        ],
        relatedLinks: [
            { label: 'Open category tree', to: '/categories' }
        ]
    },
    {
        key: 'products',
        title: 'Product Management',
        icon: 'fas fa-boxes',
        description: 'Monitor and moderate products across all sellers.',
        actions: [
            'View all products from all sellers',
            'Search products by name, seller, or category',
            'Delete any product',
            'Approve or reject products',
            'Edit product details including price, description, and stock',
            'Enable or disable products',
            'View product analytics such as views and purchases',
            'Flag inappropriate products',
            'Run bulk delete or disable actions'
        ],
        relatedLinks: [
            { label: 'Browse all products', to: '/products' },
            { label: 'Supplier product workspace', to: '/dashboard/products' }
        ]
    },
    {
        key: 'orders',
        title: 'Order Management',
        icon: 'fas fa-receipt',
        description: 'Inspect marketplace-wide order activity and reporting.',
        actions: [
            'View all orders across all sellers',
            'Track order status',
            'View order details',
            'Cancel orders when needed',
            'Review daily, weekly, and monthly order analytics',
            'Export order reports'
        ]
    },
    {
        key: 'rfqs',
        title: 'RFQ Management',
        icon: 'fas fa-file-signature',
        description: 'Review buyer quotation requests and supplier matching.',
        actions: [
            'View all RFQs',
            'Delete RFQs',
            'View RFQ responses and quotes',
            'Match buyers with sellers',
            'Review RFQ analytics'
        ],
        relatedLinks: [
            { label: 'Open RFQ marketplace', to: '/rfq' }
        ]
    },
    {
        key: 'quotes',
        title: 'Quotation Management',
        icon: 'fas fa-file-invoice-dollar',
        description: 'Track quote exchanges and lifecycle states.',
        actions: [
            'View all quotes sent by sellers',
            'View all quotes received by buyers',
            'Delete quotes',
            'Track quote status such as accepted, rejected, and pending'
        ]
    },
    {
        key: 'sellers',
        title: 'Seller Management',
        icon: 'fas fa-store',
        description: 'Approve, monitor, and moderate supplier accounts.',
        actions: [
            'View all sellers',
            'Approve new seller applications',
            'Delete seller accounts',
            'View seller ratings and reviews',
            'View seller sales analytics',
            'Set seller commissions or rates',
            'Suspend sellers for policy violations'
        ],
        relatedLinks: [
            { label: 'Open supplier directory', to: '/companies' }
        ]
    },
    {
        key: 'moderation',
        title: 'Content Moderation',
        icon: 'fas fa-shield-alt',
        description: 'Handle reviews, reports, and marketplace disputes.',
        actions: [
            'View product reviews',
            'Delete inappropriate reviews',
            'View reported content or issues',
            'Resolve disputes between buyers and sellers'
        ]
    },
    {
        key: 'settings',
        title: 'System Settings',
        icon: 'fas fa-sliders-h',
        description: 'Configure core marketplace rules and platform defaults.',
        actions: [
            'Configure platform settings',
            'Set minimum and maximum order values',
            'Configure shipping options',
            'Set tax rates',
            'Manage payment methods',
            'Configure email templates'
        ]
    },
    {
        key: 'reports',
        title: 'Reports & Analytics',
        icon: 'fas fa-chart-pie',
        description: 'Review operational reports and export marketplace analytics.',
        actions: [
            'View user registration reports',
            'Review product performance reports',
            'Review sales reports',
            'Review category performance reports',
            'Export reports to Excel, CSV, or PDF'
        ]
    }
];

export const adminModuleMap = Object.fromEntries(
    adminModules.map(module => [module.key, module])
);