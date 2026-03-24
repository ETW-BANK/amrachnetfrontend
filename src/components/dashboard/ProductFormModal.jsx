import React, { useState, useEffect } from 'react';
import { useProductManagement } from '../../context/ProductManagementContext';
import categoryService from '../../services/categoryService';

const ProductFormModal = ({ isOpen, onClose, mode }) => {
    const { createProduct, updateProduct, selectedProduct } = useProductManagement();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    
    // Add new subcategory state
    const [showAddSubcategory, setShowAddSubcategory] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [newSubcategoryDescription, setNewSubcategoryDescription] = useState('');
    const [addingSubcategory, setAddingSubcategory] = useState(false);
    
    // Product basic info
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productSpecifications, setProductSpecifications] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    
    // Product variants
    const [variants, setVariants] = useState([]);
    const [variantForm, setVariantForm] = useState({
        name: '',
        price: '',
        sku: '',
        stockQuantity: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (mode === 'edit' && selectedProduct) {
            setProductName(selectedProduct.name);
            setProductDescription(selectedProduct.description || '');
            setProductSpecifications(selectedProduct.specifications || '');
            setSelectedSubcategoryId(selectedProduct.categoryId);
            setVariants(selectedProduct.variants || []);
            
            const productCategory = categories.find(c => c.id === selectedProduct.categoryId);
            if (productCategory && productCategory.parentCategoryId) {
                setSelectedCategory(categories.find(c => c.id === productCategory.parentCategoryId));
                loadSubcategories(productCategory.parentCategoryId);
            }
        } else {
            resetForm();
        }
    }, [mode, selectedProduct, isOpen, categories]);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadSubcategories = async (categoryId) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        if (category && category.subCategories && category.subCategories.length > 0) {
            setSubcategories(category.subCategories);
        } else {
            setSubcategories([]);
        }
    };

    const handleCategorySelect = (categoryId) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        setSelectedCategory(category);
        setSelectedSubcategoryId('');
        setShowAddSubcategory(false);
        loadSubcategories(categoryId);
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategoryName.trim()) {
            alert('Please enter a subcategory name');
            return;
        }

        setAddingSubcategory(true);
        try {
            // Create new subcategory
            const newSubcategory = {
                name: newSubcategoryName,
                description: newSubcategoryDescription || '',
                parentCategoryId: selectedCategory.id
            };
            
            const created = await categoryService.createCategory(newSubcategory);
            
            // Refresh categories
            await loadCategories();
            
            // Select the newly created subcategory
            setSelectedSubcategoryId(created.id);
            setShowAddSubcategory(false);
            setNewSubcategoryName('');
            setNewSubcategoryDescription('');
            
            // Reload subcategories for the selected parent
            loadSubcategories(selectedCategory.id);
            
            alert('Subcategory added successfully!');
        } catch (error) {
            console.error('Error adding subcategory:', error);
            alert('Failed to add subcategory. Please try again.');
        } finally {
            setAddingSubcategory(false);
        }
    };

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setProductSpecifications('');
        setSelectedCategory(null);
        setSelectedSubcategoryId('');
        setSubcategories([]);
        setVariants([]);
        setShowAddSubcategory(false);
        setNewSubcategoryName('');
        setNewSubcategoryDescription('');
        setVariantForm({
            name: '',
            price: '',
            sku: '',
            stockQuantity: ''
        });
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantForm(prev => ({ ...prev, [name]: value }));
    };

    const addVariant = () => {
        if (!variantForm.name || !variantForm.price) {
            alert('Please enter variant name and price');
            return;
        }
        
        const newVariant = {
            id: Date.now(),
            variantName: variantForm.name,
            price: parseFloat(variantForm.price),
            sku: variantForm.sku || `SKU-${Date.now()}`,
            stockQuantity: parseInt(variantForm.stockQuantity) || 0
        };
        
        setVariants(prev => [...prev, newVariant]);
        setVariantForm({
            name: '',
            price: '',
            sku: '',
            stockQuantity: ''
        });
    };

    const removeVariant = (variantId) => {
        setVariants(prev => prev.filter(v => v.id !== variantId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!productName) {
            alert('Please enter product name');
            return;
        }
        
        if (!selectedSubcategoryId) {
            alert('Please select or add a subcategory');
            return;
        }
        
        if (variants.length === 0) {
            alert('Please add at least one variant (e.g., 128GB, 256GB, Silver, etc.)');
            return;
        }

        setLoading(true);
        
        const productData = {
            name: productName,
            description: productDescription,
            specifications: productSpecifications,
            unitOfMeasure: 'piece',
            minimumOrderQuantity: 1,
            leadTimeDays: 7,
            categoryId: parseInt(selectedSubcategoryId),
            variants: variants.map(v => ({
                variantName: v.variantName,
                price: v.price,
                sku: v.sku,
                initialQuantity: v.stockQuantity
            }))
        };

        let result;
        if (mode === 'edit') {
            result = await updateProduct(selectedProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }

        setLoading(false);
        
        if (result.success) {
            onClose();
            resetForm();
        } else {
            alert(result.error || 'Failed to save product');
        }
    };

    if (!isOpen) return null;

    const rootCategories = categories.filter(c => !c.parentCategoryId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-modal product-modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-modal" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    {/* Category Selection */}
                    <div className="form-section">
                        <h3>1. Select Category</h3>
                        
                        <div className="form-group">
                            <label>Main Category *</label>
                            <select
                                value={selectedCategory?.id || ''}
                                onChange={(e) => handleCategorySelect(e.target.value)}
                                required
                            >
                                <option value="">Select a category</option>
                                {rootCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedCategory && (
                            <div className="form-group">
                                <label>Subcategory *</label>
                                {!showAddSubcategory ? (
                                    <div>
                                        <select
                                            value={selectedSubcategoryId}
                                            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a subcategory</option>
                                            {subcategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                        <button 
                                            type="button"
                                            className="add-subcategory-btn"
                                            onClick={() => setShowAddSubcategory(true)}
                                        >
                                            <i className="fas fa-plus"></i> Add New Subcategory
                                        </button>
                                    </div>
                                ) : (
                                    <div className="add-subcategory-form">
                                        <input
                                            type="text"
                                            placeholder="New subcategory name *"
                                            value={newSubcategoryName}
                                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                                            className="subcategory-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description (optional)"
                                            value={newSubcategoryDescription}
                                            onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                                            className="subcategory-input"
                                        />
                                        <div className="subcategory-actions">
                                            <button 
                                                type="button"
                                                className="btn-primary small"
                                                onClick={handleAddSubcategory}
                                                disabled={addingSubcategory}
                                            >
                                                {addingSubcategory ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
                                            </button>
                                            <button 
                                                type="button"
                                                className="btn-outline small"
                                                onClick={() => {
                                                    setShowAddSubcategory(false);
                                                    setNewSubcategoryName('');
                                                    setNewSubcategoryDescription('');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="form-section">
                        <h3>2. Product Information</h3>
                        
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g., iPhone 15 Pro Max, Dell XPS 15"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                rows="3"
                                placeholder="Describe your product..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Specifications</label>
                            <textarea
                                value={productSpecifications}
                                onChange={(e) => setProductSpecifications(e.target.value)}
                                rows="3"
                                placeholder="Technical specifications, features, compatibility..."
                            />
                        </div>
                    </div>

                    {/* Product Variants */}
                    <div className="form-section">
                        <h3>3. Product Variants</h3>
                        <p className="section-hint">
                            Add different versions of your product (e.g., storage sizes, colors, RAM options)<br/>
                            <strong>Example:</strong> For iPhone 15 Pro Max, add variants: 128GB, 256GB, 512GB, 1TB
                        </p>
                        
                        {variants.length > 0 && (
                            <div className="variants-list">
                                <h4>Added Variants:</h4>
                                {variants.map(variant => (
                                    <div key={variant.id} className="variant-item">
                                        <div className="variant-info">
                                            <strong>{variant.variantName}</strong>
                                            <span>Price: ${variant.price.toFixed(2)}</span>
                                            {variant.sku && <span>SKU: {variant.sku}</span>}
                                            <span>Stock: {variant.stockQuantity}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeVariant(variant.id)}
                                            className="remove-variant-btn"
                                            title="Remove variant"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="add-variant-form">
                            <h4>Add New Variant</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Variant Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={variantForm.name}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., 128GB, Silver, 16GB RAM"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={variantForm.price}
                                        onChange={handleVariantChange}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>SKU (Optional)</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={variantForm.sku}
                                        onChange={handleVariantChange}
                                        placeholder="Stock keeping unit"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Stock</label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={variantForm.stockQuantity}
                                        onChange={handleVariantChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={addVariant}
                                className="add-variant-btn"
                            >
                                <i className="fas fa-plus"></i> Add Variant
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                            ) : (
                                <>{mode === 'edit' ? 'Update Product' : 'Add Product'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;