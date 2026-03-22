// Base API configuration
const API_BASE_URL = 'https://amrachapi2026.runasp.net/api';

class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('amrach_auth_token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle 401 Unauthorized - token expired
            if (response.status === 401) {
                // Try to refresh token
                const refreshSuccess = await this.refreshToken();
                if (refreshSuccess) {
                    // Retry the original request with new token
                    const newToken = localStorage.getItem('amrach_auth_token');
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    const retryResponse = await fetch(url, config);
                    if (!retryResponse.ok) {
                        throw new Error(`API Error: ${retryResponse.status}`);
                    }
                    return await retryResponse.json();
                } else {
                    // Redirect to login
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }
            }
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('amrach_refresh_token');
        if (!refreshToken) return false;
        
        try {
            const response = await fetch(`${this.baseURL}/Auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('amrach_auth_token', data.token);
                    if (data.refreshToken) {
                        localStorage.setItem('amrach_refresh_token', data.refreshToken);
                    }
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiService(API_BASE_URL);
export default api;