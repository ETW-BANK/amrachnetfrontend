import api from './api';

// Set to false to use real API
const USE_MOCK_PRODUCT_MANAGEMENT = true;

// Mock data - store products per supplier
let mockProducts = [
    {
        id: 1,
        name: "Industrial Grade Computer",
        description: "High-performance industrial computer designed for manufacturing environments",
        price: 1250.00,
        stockQuantity: 15,
        categoryId: 2,
        categoryName: "Computers",
        supplierId: 1,  // Supplier company ID
        isActive: true,
        images: [],
        variants: [{ id: 101, price: 1250.00, sku: "IND-COMP-001", stockQuantity: 15 }],
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-03-01T14:30:00Z"
    },
    {
        id: 2,
        name: "Gaming Laptop Pro X",
        description: "High-end gaming laptop with RTX 4080 graphics, 32GB RAM, and 1TB SSD",
        price: 1899.99,
        stockQuantity: 8,
        categoryId: 2,
        categoryName: "Computers",
        supplierId: 1,  // Supplier company ID
        isActive: true,
        images: [],
        variants: [{ id: 102, price: 1899.99, sku: "GAM-LAP-002", stockQuantity: 8 }],
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-02-15T14:30:00Z"
    }
];

export const productManagementService = {
    // Get all products for current supplier
    getSupplierProducts: async (supplierId) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            // Filter products by supplier ID
            const filtered = mockProducts.filter(p => p.supplierId === supplierId);
            console.log(`Found ${filtered.length} products for supplier ${supplierId}`);
            return filtered;
        }
        
        try {
            const response = await api.get(`/Product/supplier/${supplierId}`);
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Error fetching supplier products:', error);
            return [];
        }
    },

    // Get single product by ID
    getProductById: async (productId) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            return mockProducts.find(p => p.id === productId);
        }
        
        try {
            return await api.get(`/Product/${productId}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Create new product
    createProduct: async (productData) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            const newProduct = {
                id: Math.max(...mockProducts.map(p => p.id), 0) + 1,
                ...productData,
                supplierId: productData.supplierId,  // Ensure supplier ID is set
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true,
                images: []
            };
            mockProducts.push(newProduct);
            console.log(`Created new product for supplier ${newProduct.supplierId}:`, newProduct);
            return newProduct;
        }
        
        try {
            // Match API CreateProductDto
            const requestBody = {
                name: productData.name,
                description: productData.description,
                specifications: productData.specifications || '',
                unitOfMeasure: productData.unitOfMeasure || 'piece',
                minimumOrderQuantity: productData.minimumOrderQuantity || 1,
                leadTimeDays: productData.leadTimeDays || 7,
                categoryId: productData.categoryId,
                supplierId: productData.supplierId,  // Required field
                variants: [{
                    variantName: "Standard",
                    price: productData.price,
                    currency: "USD",
                    initialQuantity: productData.stockQuantity || 0
                }]
            };
            
            return await api.post('/Product', requestBody);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update product
    updateProduct: async (productId, productData) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            const index = mockProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                mockProducts[index] = {
                    ...mockProducts[index],
                    ...productData,
                    updatedAt: new Date().toISOString()
                };
                return mockProducts[index];
            }
            throw new Error('Product not found');
        }
        
        try {
            const requestBody = {
                name: productData.name,
                description: productData.description,
                specifications: productData.specifications || '',
                unitOfMeasure: productData.unitOfMeasure || 'piece',
                minimumOrderQuantity: productData.minimumOrderQuantity || 1,
                leadTimeDays: productData.leadTimeDays || 7,
                categoryId: productData.categoryId,
                isActive: productData.isActive !== undefined ? productData.isActive : true
            };
            
            return await api.put(`/Product/${productId}`, requestBody);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            const index = mockProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                mockProducts.splice(index, 1);
                return { success: true };
            }
            throw new Error('Product not found');
        }
        
        try {
            return await api.delete(`/Product/${productId}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Toggle product status (active/inactive)
    toggleProductStatus: async (productId, currentStatus) => {
        const newStatus = !currentStatus;
        
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            const index = mockProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                mockProducts[index].isActive = newStatus;
                mockProducts[index].updatedAt = new Date().toISOString();
                return mockProducts[index];
            }
            throw new Error('Product not found');
        }
        
        try {
            return await api.patch(`/Product/${productId}/toggle-status`, newStatus);
        } catch (error) {
            console.error('Error toggling product status:', error);
            throw error;
        }
    },

    // Update stock quantity
    updateStock: async (productId, newQuantity) => {
        if (USE_MOCK_PRODUCT_MANAGEMENT) {
            const index = mockProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                mockProducts[index].stockQuantity = newQuantity;
                if (mockProducts[index].variants && mockProducts[index].variants.length > 0) {
                    mockProducts[index].variants[0].stockQuantity = newQuantity;
                }
                mockProducts[index].updatedAt = new Date().toISOString();
                return mockProducts[index];
            }
            throw new Error('Product not found');
        }
        
        try {
            return await api.post(`/Inventory/receive`, {
                productVariantId: productId,
                locationId: 1,
                quantity: newQuantity,
                reference: "Stock update"
            });
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }
};

export default productManagementService;