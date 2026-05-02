import api from './api';
import companyService from './companyService';
// User roles
export const UserRole = {
    BUYER: 'Buyer',
    SUPPLIER: 'Supplier',
    ADMIN: 'Admin'
};

class AuthService {
    constructor() {
        this.tokenKey = 'amrach_auth_token';
        this.userKey = 'amrach_user';
        this.refreshTokenKey = 'amrach_refresh_token';
    }

    // Store auth data
    setAuthData(token, user, refreshToken = null) {
        if (token) localStorage.setItem(this.tokenKey, token);
        if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
        if (refreshToken) localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    // Get stored token
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Get stored user
    getUser() {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    // Get refresh token
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    // Check if user is logged in
    isAuthenticated() {
        return !!this.getToken();
    }

    // Get user role
    getUserRole() {
        const user = this.getUser();
        return user?.role || null;
    }


// Login
async login(email, password) {
    try {
        const response = await api.post('/Auth/login', { 
            email, 
            password 
        });
        
        if (response.token) {
            this.setAuthData(
                response.token, 
                response.user, 
                response.refreshToken
            );
            return { 
                success: true, 
                user: response.user,
                token: response.token 
            };
        }
        return { success: false, error: 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        const normalizedMessage = String(error.message || '').toLowerCase();
        
        if (normalizedMessage.includes('401')) {
            errorMessage = 'Invalid email or password';
        } else if (normalizedMessage.includes('400')) {
            errorMessage = 'Please check your credentials';
        } else if (normalizedMessage.includes('500') || normalizedMessage.includes('an error occurred during login')) {
            errorMessage = 'The login service is failing on the server right now. This is a backend issue, not a password mismatch.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
    }
}
// Register
async register(userData) {
    try {
        let companyId = null;
        
        // If registering as Supplier, create company first
        if (userData.role === 'Supplier') {
            console.log('Creating company for supplier:', userData.companyName);
            
            const companyData = {
                name: userData.companyName,
                description: userData.companyDescription || '',
                businessType: userData.businessType || 'General Trading',
                tin: userData.tin,
                businessLicenseNumber: userData.businessLicenseNumber,
                yearsInBusiness: parseInt(userData.yearsInBusiness) || 1,
                website: userData.website || '',
                establishedDate: userData.establishedDate || new Date().toISOString(),
                city: userData.city || '',
                address: userData.address || ''
            };
            
            try {
                const company = await companyService.createCompany(companyData);
                companyId = company.id;
                console.log('Company created with ID:', companyId);
            } catch (companyError) {
                console.error('Error creating company:', companyError);
                return { 
                    success: false, 
                    error: 'Failed to create company. Please check your company information.' 
                };
            }
        }
        
        // Prepare user registration data
        const requestBody = {
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            phoneNumber: userData.phone || ''
        };
        
        // ONLY add companyId for Suppliers (and ONLY if companyId exists)
        // IMPORTANT: Do NOT send companyId for Buyers at all
        if (userData.role === 'Supplier' && companyId) {
            requestBody.companyId = companyId;
        }
        
        console.log('Register request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await api.post('/Auth/register', requestBody);
        
        if (response.token) {
            this.setAuthData(
                response.token, 
                response.user, 
                response.refreshToken
            );
            return { 
                success: true, 
                user: response.user,
                token: response.token,
                companyId: companyId
            };
        }
        return { success: false, error: 'Registration failed' };
    } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.message) {
            if (error.message.includes('email')) {
                errorMessage = 'Email already exists or is invalid.';
            } else if (error.message.includes('password')) {
                errorMessage = 'Password must be at least 6 characters.';
            } else if (error.message.includes('Company')) {
                errorMessage = 'Company information is invalid. Please check your company details.';
            }
        }
        
        return { success: false, error: errorMessage };
    }
}

    // Get current user (fetch from API)
    async fetchCurrentUser() {
        try {
            const response = await api.get('/Auth/me');
            if (response) {
                this.setAuthData(this.getToken(), response);
                return response;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    // Refresh token
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;
        
        try {
            const response = await api.post('/Auth/refresh-token', { refreshToken });
            if (response.token) {
                this.setAuthData(response.token, this.getUser(), response.refreshToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            await api.post('/Auth/change-password', { 
                currentPassword, 
                newPassword 
            });
            return { success: true };
        } catch (error) {
            console.error('Password change error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to change password' 
            };
        }
    }

    // Forgot password
    async forgotPassword(email) {
        try {
            await api.post('/Auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to send reset email' 
            };
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            await api.post('/Auth/reset-password', { token, newPassword });
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to reset password' 
            };
        }
    }

    // Logout
    async logout() {
        try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                await api.post('/Auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.refreshTokenKey);
            window.location.href = '/';
        }
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            const response = await api.put('/Users/profile', userData);
            if (response.user) {
                this.setAuthData(this.getToken(), response.user);
                return { success: true, user: response.user };
            }
            return { success: false, error: 'Update failed' };
        } catch (error) {
            console.error('Update error:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify email
    async verifyEmail(token) {
        try {
            await api.get(`/Auth/verify-email?token=${token}`);
            return { success: true };
        } catch (error) {
            console.error('Email verification error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new AuthService();