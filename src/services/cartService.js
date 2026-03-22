// Local storage based cart service (no API calls)
const CART_KEY = 'amrach_cart';

const getLocalCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], subtotal: 0, total: 0, discount: 0 };
};

const saveLocalCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + ((item.unitPrice || 0) * item.quantity), 0);
    return {
        subtotal,
        total: subtotal - (items[0]?.discount || 0),
        discount: items[0]?.discount || 0
    };
};

export const cartService = {
    // Get cart
    getCart: async () => {
        const cart = getLocalCart();
        const totals = calculateTotals(cart.items);
        return {
            ...cart,
            ...totals,
            id: 'local_cart'
        };
    },

    // Add to cart
    addToCart: async (productVariantId, quantity = 1, productDetails = {}) => {
        const cart = getLocalCart();
        const existingItem = cart.items.find(item => item.productVariantId === productVariantId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                id: Date.now(),
                productVariantId,
                productName: productDetails.name || 'Product',
                unitPrice: productDetails.price || 0,
                quantity: quantity,
                productImage: productDetails.image || null,
                sku: productDetails.sku || null
            });
        }
        
        saveLocalCart(cart);
        return { success: true };
    },

    // Update cart item
    updateCartItem: async (cartItemId, quantity) => {
        const cart = getLocalCart();
        const item = cart.items.find(item => item.id === cartItemId);
        if (item) {
            item.quantity = quantity;
            saveLocalCart(cart);
        }
        return { success: true };
    },

    // Remove cart item
    removeCartItem: async (cartItemId) => {
        const cart = getLocalCart();
        cart.items = cart.items.filter(item => item.id !== cartItemId);
        saveLocalCart(cart);
        return { success: true };
    },

    // Apply coupon
    applyCoupon: async (couponCode) => {
        if (couponCode === 'SAVE10') {
            const cart = getLocalCart();
            const totals = calculateTotals(cart.items);
            const discount = totals.subtotal * 0.1;
            cart.discount = discount;
            cart.total = totals.subtotal - discount;
            saveLocalCart(cart);
            return { success: true, discount };
        }
        throw new Error('Invalid coupon');
    },

    // Remove coupon
    removeCoupon: async () => {
        const cart = getLocalCart();
        cart.discount = 0;
        const totals = calculateTotals(cart.items);
        cart.total = totals.subtotal;
        saveLocalCart(cart);
        return { success: true };
    },

    // Clear cart
    clearCart: async () => {
        localStorage.removeItem(CART_KEY);
        return { success: true };
    }
};

export default cartService;