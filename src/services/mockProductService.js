// Mock product data for testing
export const mockProducts = [
    {
        id: 1,
        name: "Industrial Grade Computer",
        description: "High-performance industrial computer designed for manufacturing environments with fanless cooling and wide temperature support.",
        price: 1250.00,
        stockQuantity: 15,
        categoryId: 2,
        categoryName: "Computers",
        supplier: {
            id: 101,
            companyName: "TechSupply Inc."
        },
        images: [],
        variants: [
            { id: 101, price: 1250.00, sku: "IND-COMP-001" }
        ],
        isNew: true,
        discountPercentage: 0
    },
    {
        id: 2,
        name: "Gaming Laptop Pro X",
        description: "High-end gaming laptop with RTX 4080 graphics, 32GB RAM, and 1TB SSD for ultimate performance.",
        price: 1899.99,
        stockQuantity: 8,
        categoryId: 2,
        categoryName: "Computers",
        supplier: {
            id: 102,
            companyName: "GamerTech Solutions"
        },
        images: [],
        variants: [
            { id: 102, price: 1899.99, sku: "GAM-LAP-002" }
        ],
        isNew: true,
        discountPercentage: 10
    },
    {
        id: 3,
        name: "Business Laptop Elite",
        description: "Sleek business laptop with Intel Core i7, 16GB RAM, and all-day battery life perfect for professionals.",
        price: 1299.99,
        stockQuantity: 25,
        categoryId: 2,
        categoryName: "Computers",
        supplier: {
            id: 101,
            companyName: "TechSupply Inc."
        },
        images: [],
        variants: [
            { id: 103, price: 1299.99, sku: "BUS-LAP-003" }
        ],
        isNew: false,
        discountPercentage: 0
    },
    {
        id: 4,
        name: "Smartphone Ultra",
        description: "Latest flagship smartphone with 6.8-inch AMOLED display, 5G connectivity, and 108MP camera system.",
        price: 999.99,
        stockQuantity: 25,
        categoryId: 3,
        categoryName: "Phones",
        supplier: {
            id: 103,
            companyName: "MobileTech Corp"
        },
        images: [],
        variants: [
            { id: 104, price: 999.99, sku: "PHN-ULT-001" },
            { id: 105, price: 1099.99, sku: "PHN-ULT-002", name: "Pro Version" }
        ],
        isNew: true,
        discountPercentage: 5
    },
    {
        id: 5,
        name: "Budget Smartphone",
        description: "Affordable smartphone with great features for everyday use, 6.5-inch display and dual cameras.",
        price: 299.99,
        stockQuantity: 50,
        categoryId: 3,
        categoryName: "Phones",
        supplier: {
            id: 103,
            companyName: "MobileTech Corp"
        },
        images: [],
        variants: [
            { id: 106, price: 299.99, sku: "PHN-BUD-001" }
        ],
        isNew: false,
        discountPercentage: 0
    },
    {
        id: 6,
        name: "Industrial Robot Arm",
        description: "Automated robotic arm for manufacturing and assembly lines with precision control and easy programming.",
        price: 15000.00,
        stockQuantity: 3,
        categoryId: 4,
        categoryName: "Industrial Equipment",
        supplier: {
            id: 104,
            companyName: "AutoMation Systems"
        },
        images: [],
        variants: [
            { id: 107, price: 15000.00, sku: "IND-ROB-001" },
            { id: 108, price: 18500.00, sku: "IND-ROB-002", name: "Heavy Duty Version" }
        ],
        isNew: false,
        discountPercentage: 0
    },
    {
        id: 7,
        name: "CNC Milling Machine",
        description: "Precision CNC milling machine for metalworking and fabrication with high-speed spindle.",
        price: 8500.00,
        stockQuantity: 5,
        categoryId: 4,
        categoryName: "Industrial Equipment",
        supplier: {
            id: 104,
            companyName: "AutoMation Systems"
        },
        images: [],
        variants: [
            { id: 109, price: 8500.00, sku: "CNC-MIL-001" }
        ],
        isNew: true,
        discountPercentage: 15
    },
    {
        id: 8,
        name: "Wireless Earbuds Pro",
        description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life.",
        price: 149.99,
        stockQuantity: 100,
        categoryId: 3,
        categoryName: "Phones",
        supplier: {
            id: 103,
            companyName: "MobileTech Corp"
        },
        images: [],
        variants: [
            { id: 110, price: 149.99, sku: "EAR-PRO-001" }
        ],
        isNew: true,
        discountPercentage: 0
    },
    {
        id: 9,
        name: "Smart Watch Pro",
        description: "Advanced smartwatch with health tracking, GPS, and 7-day battery life.",
        price: 299.99,
        stockQuantity: 45,
        categoryId: 3,
        categoryName: "Phones",
        supplier: {
            id: 103,
            companyName: "MobileTech Corp"
        },
        images: [],
        variants: [
            { id: 111, price: 299.99, sku: "WATCH-001" },
            { id: 112, price: 349.99, sku: "WATCH-002", name: "Stainless Steel Edition" }
        ],
        isNew: false,
        discountPercentage: 0
    },
    {
        id: 10,
        name: "Desktop Workstation",
        description: "Powerful desktop workstation with Intel Xeon processor, 64GB RAM, and professional graphics.",
        price: 3200.00,
        stockQuantity: 7,
        categoryId: 2,
        categoryName: "Computers",
        supplier: {
            id: 101,
            companyName: "TechSupply Inc."
        },
        images: [],
        variants: [
            { id: 113, price: 3200.00, sku: "WS-DSK-001" }
        ],
        isNew: false,
        discountPercentage: 0
    }
];

export const mockProductService = {
    // Get all products with pagination
    getAllProducts: async (page = 1, pageSize = 20) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = mockProducts.slice(start, end);
        
        return {
            items: paginatedProducts,
            totalCount: mockProducts.length,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(mockProducts.length / pageSize)
        };
    },

    // Get product by ID
    getProductById: async (id) => {
        const product = mockProducts.find(p => p.id === parseInt(id));
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    },

    // Get products by category
 // Get products by category
getProductsByCategory: async (categoryId, page = 1, pageSize = 20) => {
    console.log('Filtering products by category ID:', categoryId);
    
    // Filter by category ID
    const filtered = mockProducts.filter(p => p.categoryId === parseInt(categoryId));
    
    console.log(`Found ${filtered.length} products in category ${categoryId}`);
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = filtered.slice(start, end);
    
    return {
        items: paginatedProducts,
        totalCount: filtered.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
    };
},
//search products by name, description, or supplier company name    
searchProducts: async (query, page = 1, pageSize = 20) => {
    console.log('🔍 Searching mock products for:', query); // Add this line
    
    const filtered = mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        (p.supplier?.companyName && p.supplier.companyName.toLowerCase().includes(query.toLowerCase()))
    );
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = filtered.slice(start, end);
    
    return {
        items: paginatedProducts,
        totalCount: filtered.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
    };
},

    // Get products by supplier
    getProductsBySupplier: async (supplierId, page = 1, pageSize = 20) => {
        const filtered = mockProducts.filter(p => p.supplier?.id === parseInt(supplierId));
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = filtered.slice(start, end);
        
        return {
            items: paginatedProducts,
            totalCount: filtered.length,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(filtered.length / pageSize)
        };
    },

    // Get product variants
    getProductVariants: async (productId) => {
        const product = mockProducts.find(p => p.id === parseInt(productId));
        return product?.variants || [];
    }
};

export default mockProductService;