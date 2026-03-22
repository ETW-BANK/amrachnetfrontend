import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        // User fields
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Buyer',
        phone: '',
        
        // Company fields (for suppliers)
        companyName: '',
        companyDescription: '',
        businessType: 'General Trading',
        tin: '',
        businessLicenseNumber: '',
        yearsInBusiness: 1,
        establishedDate: '',
        website: '',
        city: '',
        address: '',
        country: 'Ethiopia'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [checkingTin, setCheckingTin] = useState(false);
    const [tinAvailable, setTinAvailable] = useState(true);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Check TIN availability when user types
        if (name === 'tin' && value.length >= 5) {
            checkTinAvailability(value);
        }
    };

    const checkTinAvailability = async (tin) => {
        setCheckingTin(true);
        try {
            const response = await fetch(`https://amrachapi2026.runasp.net/api/Companies/tin/${tin}`);
            if (response.status === 200) {
                // TIN exists
                setTinAvailable(false);
                setError('This TIN is already registered. Please use a different TIN.');
            } else if (response.status === 404) {
                // TIN not found - available
                setTinAvailable(true);
                setError('');
            }
        } catch (error) {
            console.error('Error checking TIN:', error);
            setTinAvailable(true);
        } finally {
            setCheckingTin(false);
        }
    };

    const handleNext = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.role === 'Supplier') {
            if (!formData.companyName) {
                setError('Please enter your company name');
                return;
            }
            if (!formData.tin) {
                setError('Please enter your company TIN (Tax Identification Number)');
                return;
            }
            if (!tinAvailable) {
                setError('This TIN is already registered. Please use a different TIN.');
                return;
            }
            if (!formData.businessLicenseNumber) {
                setError('Please enter your business license number');
                return;
            }
        }
        
        setLoading(true);
        setError('');
        
        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone,
            ...(formData.role === 'Supplier' && {
                companyName: formData.companyName,
                companyDescription: formData.companyDescription,
                businessType: formData.businessType,
                tin: formData.tin,
                businessLicenseNumber: formData.businessLicenseNumber,
                yearsInBusiness: parseInt(formData.yearsInBusiness) || 1,
                establishedDate: formData.establishedDate || new Date().toISOString(),
                website: formData.website,
                city: formData.city,
                address: formData.address,
                country: formData.country
            })
        };
        
        const result = await register(userData);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    const businessTypes = [
        'General Trading',
        'Manufacturing',
        'Technology',
        'Agriculture',
        'Construction',
        'Healthcare',
        'Education',
        'Transportation',
        'Consulting',
        'Retail',
        'Wholesale',
        'Import/Export',
        'Logistics',
        'Other'
    ];

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card register-card">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join Amrach B2B Marketplace</p>
                        {step === 2 && formData.role === 'Supplier' && (
                            <div className="step-indicator">
                                Step 2 of 2 - Company Information
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="auth-error">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Step 1: User Information */}
                        {step === 1 && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                        />
                                        <small className="form-hint">At least 6 characters</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password *</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Account Type *</label>
                                    <select name="role" value={formData.role} onChange={handleChange} required>
                                        <option value="Buyer">Buyer - Purchase products</option>
                                        <option value="Supplier">Supplier - Sell products</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+251 911 234 567"
                                    />
                                </div>
                                
                                <button type="button" className="btn-primary" onClick={handleNext}>
                                    Next <i className="fas fa-arrow-right"></i>
                                </button>
                            </>
                        )}
                        
                        {/* Step 2: Company Information (for Suppliers) */}
                        {step === 2 && formData.role === 'Supplier' && (
                            <>
                                <div className="form-group">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Company Name"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Company Description</label>
                                    <textarea
                                        name="companyDescription"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Brief description of your company and what you do"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Business Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleChange}>
                                        {businessTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>TIN (Tax Identification Number) *</label>
                                        <input
                                            type="text"
                                            name="tin"
                                            value={formData.tin}
                                            onChange={handleChange}
                                            required
                                            placeholder="123456789"
                                            className={!tinAvailable && formData.tin ? 'input-error' : ''}
                                        />
                                        {checkingTin && <small className="form-hint">Checking availability...</small>}
                                        {!tinAvailable && formData.tin && (
                                            <small className="form-hint error-hint">
                                                This TIN is already registered. Please use a different one.
                                            </small>
                                        )}
                                        {tinAvailable && formData.tin && formData.tin.length > 5 && (
                                            <small className="form-hint success-hint">
                                                ✓ TIN is available
                                            </small>
                                        )}
                                        <small className="form-hint">Your company's tax identification number (must be unique)</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Business License Number *</label>
                                        <input
                                            type="text"
                                            name="businessLicenseNumber"
                                            value={formData.businessLicenseNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="LIC123456"
                                        />
                                        <small className="form-hint">Official business license number</small>
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Years in Business *</label>
                                        <input
                                            type="number"
                                            name="yearsInBusiness"
                                            value={formData.yearsInBusiness}
                                            onChange={handleChange}
                                            min="1"
                                            max="100"
                                            required
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Established Date</label>
                                        <input
                                            type="date"
                                            name="establishedDate"
                                            value={formData.establishedDate}
                                            onChange={handleChange}
                                        />
                                        <small className="form-hint">When was your company founded?</small>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://www.yourcompany.com"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Addis Ababa"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <select name="country" value={formData.country} onChange={handleChange}>
                                            <option value="Ethiopia">Ethiopia</option>
                                            <option value="Kenya">Kenya</option>
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="South Africa">South Africa</option>
                                            <option value="Uganda">Uganda</option>
                                            <option value="Tanzania">Tanzania</option>
                                            <option value="Rwanda">Rwanda</option>
                                            <option value="Ghana">Ghana</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street address, building, floor"
                                    />
                                </div>
                                
                                <div className="form-buttons">
                                    <button type="button" className="btn-outline" onClick={handleBack}>
                                        <i className="fas fa-arrow-left"></i> Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-primary" 
                                        disabled={loading || (formData.role === 'Supplier' && !tinAvailable)}
                                    >
                                        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Register Company'}
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {step === 2 && formData.role === 'Buyer' && (
                            <>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Create Account'}
                                </button>
                            </>
                        )}
                    </form>
                    
                    {step === 1 && (
                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/login">Sign in</Link></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;