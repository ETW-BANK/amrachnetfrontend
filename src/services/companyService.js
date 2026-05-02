import api from './api';

export const companyService = {
    // Get all companies
    getAllCompanies: async () => {
        try {
            const response = await api.get('/Companies');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    },

    // Get company by ID
    getCompanyById: async (id) => {
        try {
            return await api.get(`/Companies/${id}`);
        } catch (error) {
            console.error('Error fetching company:', error);
            throw error;
        }
    },

    // Create a new company - EXACT MATCH to API DTO
    createCompany: async (companyData) => {
        try {
            // Build the exact CreateCompanyDto structure
            const requestBody = {
                name: companyData.name,
                description: companyData.description || '',
                businessType: companyData.businessType || 'General Trading',
                tin: companyData.tin,                    // Required
                businessLicenseNumber: companyData.businessLicenseNumber, // Required
                yearsInBusiness: parseInt(companyData.yearsInBusiness) || 1,
                website: companyData.website || '',
                establishedDate: companyData.establishedDate || new Date().toISOString()
            };
            
            // Add locations if provided
            if (companyData.city) {
                requestBody.locations = [{
                    city: companyData.city,
                    address: companyData.address || ''
                }];
            }
            
            console.log('Creating company with data:', requestBody);
            
            const response = await api.post('/Companies', requestBody);
            return response;
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    },

    // Get company by TIN
    getCompanyByTIN: async (tin) => {
        try {
            return await api.get(`/Companies/tin/${tin}`);
        } catch (error) {
            console.error('Error fetching company by TIN:', error);
            return null;
        }
    },

    // Get verified companies
    getVerifiedCompanies: async () => {
        try {
            const response = await api.get('/Companies/verified');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Error fetching verified companies:', error);
            return [];
        }
    },

    // Search suppliers
    searchSuppliers: async (query) => {
        try {
            const response = await api.post('/Companies/search', {
                keyword: query,
                page: 1,
                pageSize: 20
            });
            return response.items || [];
        } catch (error) {
            console.error('Error searching suppliers:', error);
            return [];
        }
    },

    verifyCompany: async (companyId, adminUserId, notes = '') => {
        try {
            const query = new URLSearchParams({
                adminUserId: String(adminUserId),
                ...(notes ? { notes } : {})
            });
            return await api.post(`/Companies/${companyId}/verify?${query.toString()}`, null);
        } catch (error) {
            console.error('Error verifying company:', error);
            throw error;
        }
    }
};

export default companyService;