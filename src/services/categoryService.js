import api from './api';

export const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        try {
            return await api.get('/Category');
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Get category by ID
    getCategoryById: async (id) => {
        try {
            return await api.get(`/Category/${id}`);
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Get category with subcategories
    getCategoryWithSubcategories: async (id) => {
        try {
            return await api.get(`/Category/${id}/with-subcategories`);
        } catch (error) {
            console.error('Error fetching category with subcategories:', error);
            return null;
        }
    },

    // Get root categories (main categories without parent)
    getRootCategories: async () => {
        try {
            const categories = await api.get('/Category');
            return categories.filter(cat => !cat.parentCategoryId);
        } catch (error) {
            console.error('Error fetching root categories:', error);
            return [];
        }
    },

    // Get category tree (complete hierarchical structure)
    getCategoryTree: async () => {
        try {
            const categories = await api.get('/Category');
            return buildCategoryTree(categories);
        } catch (error) {
            console.error('Error fetching category tree:', error);
            return [];
        }
    },

    // Search categories
    searchCategories: async (query) => {
        try {
            return await api.get(`/Category/search?q=${encodeURIComponent(query)}`);
        } catch (error) {
            console.error('Error searching categories:', error);
            return [];
        }
    },

    // Get subcategories for a category
    getSubCategories: async (parentId) => {
        try {
            const categories = await api.get('/Category');
            return categories.filter(cat => cat.parentCategoryId === parentId);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            return [];
        }
    },

    // Get category path (breadcrumb)
    getCategoryPath: async (categoryId) => {
        try {
            const categories = await api.get('/Category');
            const path = [];
            let current = categories.find(c => c.id === categoryId);
            
            while (current) {
                path.unshift(current);
                if (current.parentCategoryId) {
                    current = categories.find(c => c.id === current.parentCategoryId);
                } else {
                    break;
                }
            }
            return path;
        } catch (error) {
            console.error('Error getting category path:', error);
            return [];
        }
    }
};

// Helper function to build category tree
const buildCategoryTree = (categories) => {
    const categoryMap = new Map();
    const rootCategories = [];

    // First, create a map of all categories
    categories.forEach(category => {
        categoryMap.set(category.id, {
            ...category,
            subCategories: [],
            level: 0
        });
    });

    // Build the tree structure
    categories.forEach(category => {
        const categoryNode = categoryMap.get(category.id);
        if (category.parentCategoryId && categoryMap.has(category.parentCategoryId)) {
            const parent = categoryMap.get(category.parentCategoryId);
            parent.subCategories.push(categoryNode);
            categoryNode.level = parent.level + 1;
        } else {
            rootCategories.push(categoryNode);
        }
    });

    return rootCategories;
};

export default categoryService;