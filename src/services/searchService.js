import api from './api';
import productService from './productService';
import companyService from './companyService';

export const searchService = {
    // Global search across all content
    globalSearch: async (query) => {
        if (!query || query.trim().length < 2) {
            return { products: [], categories: [], companies: [], totalCount: 0 };
        }
        
        const searchTerm = query.toLowerCase().trim();
        const results = {
            products: [],
            categories: [],
            companies: [],
            totalCount: 0
        };
        
        try {
            // Search Products (using mock data)
            const products = await productService.searchProducts(searchTerm);
            results.products = products.items || [];
            
            // Search Categories (from real API)
            try {
                const categoriesResponse = await fetch('https://amrachapi2026.runasp.net/api/Category');
                const allCategories = await categoriesResponse.json();
                results.categories = Array.isArray(allCategories) ? allCategories.filter(cat => 
                    cat.name?.toLowerCase().includes(searchTerm) ||
                    (cat.description && cat.description.toLowerCase().includes(searchTerm))
                ) : [];
            } catch (error) {
                console.error('Error searching categories:', error);
                results.categories = [];
            }
            
            // Search Companies - Get all companies and filter locally
            try {
                // First, try to get all companies
                const companiesResponse = await fetch('https://amrachapi2026.runasp.net/api/Companies');
                const allCompanies = await companiesResponse.json();
                console.log('All companies from API:', allCompanies);
                
                // Filter companies by search term
                if (Array.isArray(allCompanies)) {
                    results.companies = allCompanies.filter(company => 
                        company.name?.toLowerCase().includes(searchTerm) ||
                        (company.description && company.description.toLowerCase().includes(searchTerm)) ||
                        (company.tin && company.tin.toLowerCase().includes(searchTerm)) ||
                        (company.businessType && company.businessType.toLowerCase().includes(searchTerm))
                    );
                    console.log(`Found ${results.companies.length} companies matching "${searchTerm}":`, results.companies);
                } else {
                    results.companies = [];
                }
            } catch (error) {
                console.error('Error searching companies:', error);
                results.companies = [];
            }
            
            results.totalCount = results.products.length + results.categories.length + results.companies.length;
            
            return results;
        } catch (error) {
            console.error('Global search error:', error);
            return { products: [], categories: [], companies: [], totalCount: 0 };
        }
    },
    
    // Quick search with limited results for dropdown
    quickSearch: async (query, limit = 5) => {
        const results = await searchService.globalSearch(query);
        return {
            products: Array.isArray(results.products) ? results.products.slice(0, limit) : [],
            categories: Array.isArray(results.categories) ? results.categories.slice(0, limit) : [],
            companies: Array.isArray(results.companies) ? results.companies.slice(0, limit) : [],
            totalCount: results.totalCount || 0
        };
    }
};

export default searchService;