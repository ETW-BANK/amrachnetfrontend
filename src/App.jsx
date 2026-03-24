import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import RFQPage from './pages/RFQPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import ProfileSettings from './components/dashboard/ProfileSettings';
import ProtectedRoute from './components/ProtectedRoute';
import { ProductManagementProvider } from './context/ProductManagementContext';
import ProductManagement from './components/dashboard/ProductManagement';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />
        <main className="container" style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:id" element={<CategoryDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/company/:id" element={<CompanyDetailPage />} />
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes - Place these AFTER public routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProductManagementProvider>
                    <DashboardLayout />
                  </ProductManagementProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="orders" element={<div>Orders Page (Coming Soon)</div>} />
              <Route path="rfqs" element={<div>My RFQs (Coming Soon)</div>} />
              <Route path="quotes" element={<div>My Quotes (Coming Soon)</div>} />
              <Route path="wishlist" element={<div>Wishlist (Coming Soon)</div>} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="company" element={<div>Company Profile (Coming Soon)</div>} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;