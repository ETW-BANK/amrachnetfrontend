import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const token = authService.getToken();
        const storedUser = authService.getUser();
        
        if (token && storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
            // Debug: Log user roles when loading from storage
            console.log('User loaded from storage:', storedUser);
            console.log('User roles:', storedUser?.roles);
            console.log('User role:', storedUser?.role);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
            // Debug: Log user roles after successful login
            console.log('Login successful - User:', result.user);
            console.log('User roles:', result.user?.roles);
            console.log('User role:', result.user?.role);
        }
        return result;
    };

    const register = async (userData) => {
        const result = await authService.register(userData);
        if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
            // Debug: Log user roles after successful registration
            console.log('Registration successful - User:', result.user);
            console.log('User roles:', result.user?.roles);
            console.log('User role:', result.user?.role);
        }
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        console.log('User logged out');
    };

    const updateUser = async (userData) => {
        const result = await authService.updateProfile(userData);
        if (result.success) {
            setUser(result.user);
            console.log('User updated:', result.user);
        }
        return result;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        hasRole: (role) => {
            if (!user) return false;
            // Check both roles array and role property
            const userRoles = user?.roles || [user?.role];
            if (role === 'Admin') return userRoles.includes('Admin');
            if (role === 'Supplier') return userRoles.includes('Supplier') || userRoles.includes('Admin');
            if (role === 'Buyer') return userRoles.includes('Buyer') || userRoles.includes('Admin');
            return false;
        },
        getUserRole: () => {
            // Return first role from roles array or the single role
            if (user?.roles && user.roles.length > 0) {
                return user.roles[0];
            }
            return user?.role || null;
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};