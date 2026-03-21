import api from './api';

// For now, we'll use localStorage to store cart ID
const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cartId', cartId);
    }
    return cartId;
};

export const cartService = {
    // Get cart details
    getCart: async () => {
        const cartId = getCartId();
        try {
            // Try to fetch from API
            const response = await api.get(`/Cart/${cartId}`);
            return response;
        } catch (error) {
            // If cart doesn't exist, return empty cart structure
            console.log('Creating new cart...');
            return { 
                id: cartId, 
                items: [], 
                subtotal: 0, 
                total: 0,
                discount: 0 
            };
        }
    },

    // Add item to cart
    addToCart: async (productVariantId, quantity = 1) => {
        const cartId = getCartId();
        try {
            return await api.post('/Cart/add', {
                cartId,
                productVariantId,
                quantity
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    // Update cart item quantity
    updateCartItem: async (cartItemId, quantity) => {
        try {
            return await api.put(`/Cart/item/${cartItemId}`, { quantity });
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    // Remove item from cart
    removeCartItem: async (cartItemId) => {
        try {
            return await api.delete(`/Cart/item/${cartItemId}`);
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    },

    // Apply coupon
    applyCoupon: async (couponCode) => {
        const cartId = getCartId();
        try {
            return await api.post(`/Cart/${cartId}/coupon/${couponCode}`);
        } catch (error) {
            console.error('Error applying coupon:', error);
            throw error;
        }
    },

    // Remove coupon
    removeCoupon: async () => {
        const cartId = getCartId();
        try {
            return await api.delete(`/Cart/${cartId}/coupon`);
        } catch (error) {
            console.error('Error removing coupon:', error);
            throw error;
        }
    },

    // Get cart summary
    getCartSummary: async () => {
        const cartId = getCartId();
        try {
            return await api.get(`/Cart/${cartId}/summary`);
        } catch (error) {
            console.error('Error getting cart summary:', error);
            throw error;
        }
    },

    // Clear cart
    clearCart: async () => {
        const cartId = getCartId();
        try {
            const cart = await cartService.getCart();
            if (cart.items && cart.items.length > 0) {
                for (const item of cart.items) {
                    await cartService.removeCartItem(item.id);
                }
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    },
};

export default cartService;