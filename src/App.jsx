import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './index.css';

function App() {
    return (
        <Router>
            <Navbar />
            <main className="container" style={{ flex: 1, padding: '2rem 0' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/category/:id" element={<CategoryDetailPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;