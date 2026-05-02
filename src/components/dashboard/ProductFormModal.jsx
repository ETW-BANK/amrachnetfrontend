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
    const [newSubcategoryIcon, setNewSubcategoryIcon] = useState('');
    const [showIconPicker, setShowIconPicker] = useState(false);
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
        stockQuantity: '',
        imageFile: null,
        imagePreviewUrl: ''
    });
    
    // ========== VARIANT IMAGES STATE ==========
    const [variantImages, setVariantImages] = useState({});
    const [uploadingImages, setUploadingImages] = useState({});

    // Available icons
    const availableIcons = [
        { name: 'mobile-alt', label: 'Phone' },
        { name: 'laptop', label: 'Laptop' },
        { name: 'tablet-alt', label: 'Tablet' },
        { name: 'tv', label: 'TV' },
        { name: 'headphones', label: 'Audio' },
        { name: 'camera', label: 'Camera' },
        { name: 'print', label: 'Printer' },
        { name: 'microchip', label: 'Components' },
        { name: 'robot', label: 'Robotics' },
        { name: 'tools', label: 'Tools' },
        { name: 'industry', label: 'Industrial' },
        { name: 'box', label: 'Packaging' },
        { name: 'truck', label: 'Logistics' },
        { name: 'leaf', label: 'Agriculture' },
        { name: 'heartbeat', label: 'Medical' },
        { name: 'building', label: 'Construction' },
        { name: 'folder', label: 'General' }
    ];

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

    const handleClose = () => {
        resetForm();
        onClose();
    };

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
            const newSubcategory = {
                name: newSubcategoryName,
                description: newSubcategoryDescription || '',
                parentCategoryId: selectedCategory.id,
                icon: newSubcategoryIcon || 'folder'
            };
            
            const created = await categoryService.createCategory(newSubcategory);
            await loadCategories();
            setSelectedSubcategoryId(created.id);
            setShowAddSubcategory(false);
            setNewSubcategoryName('');
            setNewSubcategoryDescription('');
            setNewSubcategoryIcon('');
            setShowIconPicker(false);
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
        if (variantForm.imagePreviewUrl) {
            URL.revokeObjectURL(variantForm.imagePreviewUrl);
        }
        variants.forEach(v => {
            if (v?.pendingImagePreviewUrl) {
                URL.revokeObjectURL(v.pendingImagePreviewUrl);
            }
        });

        setProductName('');
        setProductDescription('');
        setProductSpecifications('');
        setSelectedCategory(null);
        setSelectedSubcategoryId('');
        setSubcategories([]);
        setVariants([]);
        setVariantImages({});
        setShowAddSubcategory(false);
        setNewSubcategoryName('');
        setNewSubcategoryDescription('');
        setNewSubcategoryIcon('');
        setVariantForm({
            name: '',
            price: '',
            sku: '',
            stockQuantity: '',
            imageFile: null,
            imagePreviewUrl: ''
        });
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantImageSelect = (file) => {
        if (!file) return;

        setVariantForm(prev => {
            if (prev.imagePreviewUrl) {
                URL.revokeObjectURL(prev.imagePreviewUrl);
            }

            return {
                ...prev,
                imageFile: file,
                imagePreviewUrl: URL.createObjectURL(file)
            };
        });
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
            stockQuantity: parseInt(variantForm.stockQuantity) || 0,
            pendingImageFile: variantForm.imageFile || null,
            pendingImagePreviewUrl: variantForm.imagePreviewUrl || ''
        };
        
        setVariants(prev => [...prev, newVariant]);
        setVariantForm({
            name: '',
            price: '',
            sku: '',
            stockQuantity: '',
            imageFile: null,
            imagePreviewUrl: ''
        });
    };

    const removeVariant = (variantId) => {
        const existing = variants.find(v => v.id === variantId);
        if (existing?.pendingImagePreviewUrl) {
            URL.revokeObjectURL(existing.pendingImagePreviewUrl);
        }
        setVariants(prev => prev.filter(v => v.id !== variantId));
        setVariantImages(prev => {
            const newState = { ...prev };
            delete newState[variantId];
            return newState;
        });
    };

    // ========== VARIANT IMAGE FUNCTIONS ==========
    const handleVariantImageUpload = async (variantId, file) => {
        if (!file) return;
        
        setUploadingImages(prev => ({ ...prev, [variantId]: true }));
        
        const formData = new FormData();
        formData.append('image', file);
        
        const currentImages = variantImages[variantId]?.images || [];
        formData.append('isPrimary', currentImages.length === 0 ? 'true' : 'false');
        
        try {
            const token = localStorage.getItem('amrach_auth_token');
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Product/variant/${variantId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (response.ok) {
                const newImage = await response.json();
                setVariantImages(prev => ({
                    ...prev,
                    [variantId]: {
                        images: [...(prev[variantId]?.images || []), newImage],
                        primaryId: newImage.isPrimary ? newImage.id : prev[variantId]?.primaryId
                    }
                }));
            } else {
                alert('Failed to upload image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please check your connection.');
        } finally {
            setUploadingImages(prev => ({ ...prev, [variantId]: false }));
        }
    };

    const setPrimaryVariantImage = async (variantId, imageId) => {
        try {
            const token = localStorage.getItem('amrach_auth_token');
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Product/variant/${variantId}/images/${imageId}/set-primary`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setVariantImages(prev => ({
                    ...prev,
                    [variantId]: {
                        ...prev[variantId],
                        primaryId: imageId
                    }
                }));
            }
        } catch (error) {
            console.error('Error setting primary image:', error);
        }
    };

    const deleteVariantImage = async (variantId, imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        
        try {
            const token = localStorage.getItem('amrach_auth_token');
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Product/variant/${variantId}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                setVariantImages(prev => ({
                    ...prev,
                    [variantId]: {
                        images: prev[variantId]?.images?.filter(img => img.id !== imageId) || [],
                        primaryId: prev[variantId]?.primaryId === imageId ? null : prev[variantId]?.primaryId
                    }
                }));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
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
            alert('Please add at least one variant');
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
            handleClose();
        } else {
            alert(result.error || 'Failed to save product');
        }
    };

    if (!isOpen) return null;

    const rootCategories = categories.filter(c => !c.parentCategoryId);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content product-modal product-modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-modal" onClick={handleClose}>
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
                                        
                                        <div className="icon-selection">
                                            <label>Icon (optional)</label>
                                            <div className="icon-picker-trigger" onClick={() => setShowIconPicker(!showIconPicker)}>
                                                {newSubcategoryIcon ? (
                                                    <><i className={`fas fa-${newSubcategoryIcon}`}></i> {newSubcategoryIcon}</>
                                                ) : (
                                                    <><i className="fas fa-folder"></i> Select icon</>
                                                )}
                                            </div>
                                            {showIconPicker && (
                                                <div className="icon-picker">
                                                    {availableIcons.map(icon => (
                                                        <div 
                                                            key={icon.name}
                                                            className={`icon-option ${newSubcategoryIcon === icon.name ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setNewSubcategoryIcon(icon.name);
                                                                setShowIconPicker(false);
                                                            }}
                                                            title={icon.label}
                                                        >
                                                            <i className={`fas fa-${icon.name}`}></i>
                                                            <span>{icon.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
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
                                                    setNewSubcategoryIcon('');
                                                    setShowIconPicker(false);
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
                        
                        {/* Variants List with Image Upload */}
                        {variants.length > 0 && (
                            <div className="variants-list">
                                <h4>Added Variants:</h4>
                                {variants.map(variant => (
                                    <div key={variant.id} className="variant-item">
                                        {/* Image Section */}
                                        <div className="variant-image-section">
                                            <div className="variant-image-preview">
                                                {variantImages[variant.id]?.images?.length > 0 ? (
                                                    <div className="variant-images-list">
                                                        {variantImages[variant.id].images.slice(0, 1).map(img => (
                                                            <div key={img.id} className="variant-image-thumb">
                                                                <img src={img.imageUrl} alt={variant.variantName} />
                                                                {variantImages[variant.id].primaryId === img.id && (
                                                                    <span className="primary-badge">Primary</span>
                                                                )}
                                                                <div className="image-actions">
                                                                    {variantImages[variant.id].primaryId !== img.id && (
                                                                        <button 
                                                                            onClick={() => setPrimaryVariantImage(variant.id, img.id)}
                                                                            title="Set as primary"
                                                                            className="set-primary-btn"
                                                                        >
                                                                            <i className="fas fa-star"></i>
                                                                        </button>
                                                                    )}
                                                                    <button 
                                                                        onClick={() => deleteVariantImage(variant.id, img.id)}
                                                                        title="Delete"
                                                                        className="delete-image-btn"
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {variantImages[variant.id].images.length > 1 && (
                                                            <div className="more-images-badge">
                                                                +{variantImages[variant.id].images.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : variant.pendingImagePreviewUrl ? (
                                                    <div className="variant-image-thumb">
                                                        <img src={variant.pendingImagePreviewUrl} alt={`${variant.variantName} (pending)`} />
                                                        <span className="more-images-badge">Pending</span>
                                                    </div>
                                                ) : (
                                                    <div className="no-image-placeholder">
                                                        <i className="fas fa-image"></i>
                                                        <span>No image</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="variant-image-upload">
                                                <label className="upload-image-btn">
                                                    <i className="fas fa-upload"></i> Upload Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                handleVariantImageUpload(variant.id, e.target.files[0]);
                                                            }
                                                            e.target.value = '';
                                                        }}
                                                        disabled={uploadingImages[variant.id]}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                                {uploadingImages[variant.id] && (
                                                    <span className="uploading-spinner">
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
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

                        {/* Add New Variant Form */}
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Variant Image (Optional)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <label className="upload-image-btn" style={{ margin: 0 }}>
                                            <i className="fas fa-image"></i> Add Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleVariantImageSelect(e.target.files[0]);
                                                    }
                                                    e.target.value = '';
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        {variantForm.imagePreviewUrl && (
                                            <div className="variant-image-preview" style={{ width: 54, height: 54 }}>
                                                <img
                                                    src={variantForm.imagePreviewUrl}
                                                    alt="Selected variant"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </div>
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
                        <button type="button" className="btn-outline" onClick={handleClose}>
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