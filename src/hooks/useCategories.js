import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRootCategories = () => {
        return categories.filter(cat => !cat.parentCategoryId);
    };

    const getSubCategories = (parentId) => {
        return categories.filter(cat => cat.parentCategoryId === parentId);
    };

    const getCategoryById = (id) => {
        return categories.find(cat => cat.id === parseInt(id));
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        getRootCategories,
        getSubCategories,
        getCategoryById,
    };
};

export default useCategories;