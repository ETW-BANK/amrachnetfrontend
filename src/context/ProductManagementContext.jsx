import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import productManagementService from '../services/productManagementService';

const ProductManagementContext = createContext();

export const useProductManagement = () => {
    const context = useContext(ProductManagementContext);
    if (!context) {
        throw new Error('useProductManagement must be used within ProductManagementProvider');
    }
    return context;
};

export const ProductManagementProvider = ({ children }) => {
    const { user, getUserRole } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Get the supplier's company ID - this is the key!
    const getSupplierCompanyId = () => {
        // If user is a supplier, use their companyId
        if (user?.role === 'Supplier' || getUserRole() === 'Supplier') {
            return user?.companyId;
        }
        return null;
    };

    const loadProducts = async () => {
        const supplierId = getSupplierCompanyId();
        if (!supplierId) {
            console.log('No supplier ID found - user may not be a supplier');
            setProducts([]);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            console.log(`Loading products for supplier ID: ${supplierId}`);
            const data = await productManagementService.getSupplierProducts(supplierId);
            console.log(`Loaded ${data.length} products:`, data);
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [user?.companyId, user?.role]); // Reload when companyId or role changes

    const createProduct = async (productData) => {
        const supplierId = getSupplierCompanyId();
        if (!supplierId) {
            setError('Only suppliers can create products');
            return { success: false, error: 'Only suppliers can create products' };
        }
        
        setLoading(true);
        try {
            const newProduct = await productManagementService.createProduct({
                ...productData,
                supplierId: supplierId  // Explicitly set the supplier ID
            });
            await loadProducts();
            return { success: true, product: newProduct };
        } catch (err) {
            setError('Failed to create product');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (productId, productData) => {
        setLoading(true);
        try {
            const updatedProduct = await productManagementService.updateProduct(productId, productData);
            setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
            return { success: true, product: updatedProduct };
        } catch (err) {
            setError('Failed to update product');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return { success: false };
        }
        
        setLoading(true);
        try {
            await productManagementService.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
            return { success: true };
        } catch (err) {
            setError('Failed to delete product');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const toggleProductStatus = async (productId, currentStatus) => {
        try {
            const updatedProduct = await productManagementService.toggleProductStatus(productId, currentStatus);
            setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
            return { success: true };
        } catch (err) {
            setError('Failed to update product status');
            return { success: false, error: err.message };
        }
    };

    const updateStock = async (productVariantId, quantityDelta) => {
        try {
            await productManagementService.updateStock(productVariantId, quantityDelta);
            await loadProducts();
            return { success: true };
        } catch (err) {
            setError('Failed to update stock');
            return { success: false, error: err.message };
        }
    };

    const value = {
        products,
        loading,
        error,
        selectedProduct,
        isEditModalOpen,
        setSelectedProduct,
        setIsEditModalOpen,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        updateStock
    };

    return (
        <ProductManagementContext.Provider value={value}>
            {children}
        </ProductManagementContext.Provider>
    );
};