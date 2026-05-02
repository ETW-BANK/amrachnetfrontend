import api from './api';
import mockProductService from './mockProductService';

// Set this to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

const normalizeProductListResponse = (response, page = 1, pageSize = 20) => {
    if (Array.isArray(response)) {
        return {
            items: response,
            totalCount: response.length,
            page,
            pageSize,
            totalPages: Math.ceil(response.length / pageSize)
        };
    }

    if (Array.isArray(response?.items)) {
        return response;
    }

    return {
        items: [],
        totalCount: 0,
        page,
        pageSize,
        totalPages: 0
    };
};

export const productService = {
    // Get all products
    getAllProducts: async (page = 1, pageSize = 20) => {
        if (USE_MOCK_DATA) {
            return await mockProductService.getAllProducts(page, pageSize);
        }
        
        try {
            const response = await api.get(`/Product?page=${page}&pageSize=${pageSize}`);
            return normalizeProductListResponse(response, page, pageSize);
        } catch (error) {
            console.error('Error fetching products:', error);
            return { items: [], totalCount: 0 };
        }
    },

    // Get product by ID
    getProductById: async (id) => {
        if (USE_MOCK_DATA) {
            return await mockProductService.getProductById(id);
        }
        
        try {
            return await api.get(`/Product/${id}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Get products by category
    getProductsByCategory: async (categoryId, page = 1, pageSize = 20) => {
        if (USE_MOCK_DATA) {
            return await mockProductService.getProductsByCategory(categoryId, page, pageSize);
        }
        
        try {
            const response = await api.get(`/Product/category/${categoryId}?page=${page}&pageSize=${pageSize}`);
            return normalizeProductListResponse(response, page, pageSize);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return { items: [], totalCount: 0 };
        }
    },

    // Get products by supplier
    getProductsBySupplier: async (supplierId, page = 1, pageSize = 20) => {
        if (USE_MOCK_DATA) {
            return await mockProductService.getProductsBySupplier(supplierId, page, pageSize);
        }
        
        try {
            return await api.get(`/Product/supplier/${supplierId}?page=${page}&pageSize=${pageSize}`);
        } catch (error) {
            console.error('Error fetching products by supplier:', error);
            return { items: [], totalCount: 0 };
        }
    },

    // Search products
    // Supports:
    // - searchProducts('laptop', 1, 20)
    // - searchProducts({ searchTerm: 'laptop', page: 1, pageSize: 20 })
    searchProducts: async (searchTermOrBody, page = 1, pageSize = 20) => {
        const body = typeof searchTermOrBody === 'object' && searchTermOrBody !== null
            ? {
                page: searchTermOrBody.page ?? page,
                pageSize: searchTermOrBody.pageSize ?? pageSize,
                ...searchTermOrBody,
            }
            : {
                searchTerm: String(searchTermOrBody ?? ''),
                page,
                pageSize,
            };

        if (USE_MOCK_DATA) {
            const query = body.searchTerm || '';
            const mockPage = body.page || 1;
            const mockPageSize = body.pageSize || 20;
            return await mockProductService.searchProducts(query, mockPage, mockPageSize);
        }

        try {
            const response = await api.post('/Product/search', body);
            return response;
        } catch (error) {
            console.error('Error searching products:', error);
            return { items: [], totalCount: 0, message: 'No products available yet' };
        }
    },
    // Get product variants
    getProductVariants: async (productId) => {
        if (USE_MOCK_DATA) {
            return await mockProductService.getProductVariants(productId);
        }
        
        try {
            return await api.get(`/Product/${productId}/variants`);
        } catch (error) {
            console.error('Error fetching product variants:', error);
            return [];
        }
    },

    toggleProductStatus: async (productId, isActive) => {
        if (USE_MOCK_DATA) {
            return true;
        }

        try {
            return await api.patch(`/Product/${productId}/toggle-status`, isActive);
        } catch (error) {
            console.error('Error toggling product status:', error);
            throw error;
        }
    },
};

export default productService;