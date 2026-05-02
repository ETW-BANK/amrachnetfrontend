const toNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
};

export const getVariantAvailableQuantity = (variant) => {
    if (!variant) {
        return 0;
    }

    return toNumber(variant.availableQuantity ?? variant.stockQuantity ?? 0);
};

export const getProductAvailableQuantity = (product, selectedVariant = null) => {
    if (selectedVariant) {
        return getVariantAvailableQuantity(selectedVariant);
    }

    if (product?.totalStock !== undefined && product?.totalStock !== null) {
        return toNumber(product.totalStock);
    }

    if (product?.stockQuantity !== undefined && product?.stockQuantity !== null) {
        return toNumber(product.stockQuantity);
    }

    if (Array.isArray(product?.variants) && product.variants.length > 0) {
        return product.variants.reduce((sum, variant) => sum + getVariantAvailableQuantity(variant), 0);
    }

    return 0;
};

export const isProductInStock = (product, selectedVariant = null) => {
    if (selectedVariant?.isInStock !== undefined) {
        return Boolean(selectedVariant.isInStock) || getVariantAvailableQuantity(selectedVariant) > 0;
    }

    if (getProductAvailableQuantity(product, selectedVariant) > 0) {
        return true;
    }

    if (Array.isArray(product?.variants) && product.variants.length > 0) {
        return product.variants.some(variant => Boolean(variant?.isInStock) || getVariantAvailableQuantity(variant) > 0);
    }

    return false;
};