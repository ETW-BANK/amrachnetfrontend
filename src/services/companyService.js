import api from './api';

export const companyService = {
    // Get all companies
    getAllCompanies: async () => {
        try {
            const response = await fetch('https://amrachapi2026.runasp.net/api/Companies');
            const data = await response.json();
            console.log('Companies from API:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    },

    // Get company by ID
    getCompanyById: async (id) => {
        try {
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Companies/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching company:', error);
            throw error;
        }
    },

    // Get company by TIN
    getCompanyByTIN: async (tin) => {
        try {
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Companies/tin/${tin}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching company by TIN:', error);
            return null;
        }
    },

    // Get verified companies
    getVerifiedCompanies: async () => {
        try {
            const response = await fetch('https://amrachapi2026.runasp.net/api/Companies/verified');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching verified companies:', error);
            return [];
        }
    },

    // Search suppliers - Get all and filter locally
    searchSuppliers: async (query) => {
        if (!query || query.trim().length === 0) {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        try {
            // Get all companies
            const allCompanies = await companyService.getAllCompanies();
            console.log('All companies for filtering:', allCompanies);
            
            // Filter locally
            const filtered = allCompanies.filter(company => 
                company.name?.toLowerCase().includes(searchTerm) ||
                company.description?.toLowerCase().includes(searchTerm) ||
                company.tin?.toLowerCase().includes(searchTerm) ||
                company.businessType?.toLowerCase().includes(searchTerm)
            );
            
            console.log(`Found ${filtered.length} companies matching "${searchTerm}"`);
            return filtered;
            
        } catch (error) {
            console.error('Error searching suppliers:', error);
            return [];
        }
    }
};

export default companyService;