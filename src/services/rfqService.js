import api from './api';

export const rfqService = {
    // Get all RFQs
    getAllRFQs: async (page = 1, pageSize = 20) => {
        try {
            const response = await api.get(`/RFQ?page=${page}&pageSize=${pageSize}`);
            return response;
        } catch (error) {
            console.error('Error fetching RFQs:', error);
            return { items: [], totalCount: 0 };
        }
    },

    // Get RFQ by ID
    getRFQById: async (id) => {
        try {
            return await api.get(`/RFQ/${id}`);
        } catch (error) {
            console.error('Error fetching RFQ:', error);
            throw error;
        }
    },

    // Create RFQ
    createRFQ: async (rfqData) => {
        try {
            return await api.post('/RFQ', rfqData);
        } catch (error) {
            console.error('Error creating RFQ:', error);
            throw error;
        }
    },

    // Update RFQ
    updateRFQ: async (id, rfqData) => {
        try {
            return await api.put(`/RFQ/${id}`, rfqData);
        } catch (error) {
            console.error('Error updating RFQ:', error);
            throw error;
        }
    },

    // Search RFQs
    searchRFQs: async (searchQuery) => {
        try {
            return await api.post('/RFQ/search', searchQuery);
        } catch (error) {
            console.error('Error searching RFQs:', error);
            return { items: [], totalCount: 0 };
        }
    },

    // Get RFQ quotes
    getRFQQuotes: async (rfqId) => {
        try {
            return await api.get(`/RFQ/${rfqId}/quotes`);
        } catch (error) {
            console.error('Error fetching RFQ quotes:', error);
            return [];
        }
    },

    // Submit quote to RFQ (for suppliers)
    submitQuote: async (rfqId, quoteData) => {
        try {
            return await api.post(`/RFQ/${rfqId}/quotes`, quoteData);
        } catch (error) {
            console.error('Error submitting quote:', error);
            throw error;
        }
    },

    // Accept quote (for buyers)
    acceptQuote: async (rfqId, quoteId) => {
        try {
            return await api.post(`/RFQ/${rfqId}/quotes/${quoteId}/accept`);
        } catch (error) {
            console.error('Error accepting quote:', error);
            throw error;
        }
    }
};

export default rfqService;