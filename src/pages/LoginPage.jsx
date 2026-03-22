import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your Amrach account</p>
                    </div>
                    
                    {error && (
                        <div className="auth-error">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Create one</Link></p>
                        <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;