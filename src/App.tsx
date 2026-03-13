import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate } from
'react-router-dom';
import { AuthProvider } from './store/authStore';
import { CartProvider } from './store/cartStore';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { CartDrawer } from './components/cart/CartDrawer';
import { useAuth } from './store/authStore';
import { useCart } from './store/cartStore';
// Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { Batches } from './pages/Batches';
import { BatchBookings } from './pages/BatchBookings';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Shop } from './pages/shop/Shop';
import { ProductDetail } from './pages/shop/ProductDetail';
import { Checkout } from './pages/shop/Checkout';
import { OrderSuccess } from './pages/shop/OrderSuccess';
import { OrderTracking } from './pages/shop/OrderTracking';
// Wrapper for Admin Layout to sync with react-router
function AdminLayoutWrapper({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Map path to page id for AppLayout
  const pathParts = location.pathname.split('/');
  const currentPage = pathParts[2] || 'dashboard';
  const handleNavigate = (page: string) => {
    navigate(`/admin/${page}`);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}>

      {children}
    </AppLayout>);

}
// Wrapper for Public Layout to handle cart drawer
function PublicLayoutWrapper({ children }: {children: React.ReactNode;}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCart();
  return (
    <PublicLayout
      cartItemCount={getItemCount()}
      onCartClick={() => setIsCartOpen(true)}>

      {children}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </PublicLayout>);

}
export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/shop" replace />} />
            <Route path="/login" element={<AdminLogin />} />

            <Route
              path="/shop"
              element={
              <PublicLayoutWrapper>
                  <Shop />
                </PublicLayoutWrapper>
              } />

            <Route
              path="/shop/product/:id"
              element={
              <PublicLayoutWrapper>
                  <ProductDetail />
                </PublicLayoutWrapper>
              } />

            <Route
              path="/checkout"
              element={
              <PublicLayoutWrapper>
                  <Checkout />
                </PublicLayoutWrapper>
              } />

            <Route
              path="/order-success"
              element={
              <PublicLayoutWrapper>
                  <OrderSuccess />
                </PublicLayoutWrapper>
              } />

            <Route
              path="/order/:token"
              element={
              <PublicLayoutWrapper>
                  <OrderTracking />
                </PublicLayoutWrapper>
              } />


            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
              <ProtectedRoute>
                  <AdminLayoutWrapper>
                    <Dashboard />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } />

            <Route
              path="/admin/dashboard"
              element={<Navigate to="/admin" replace />} />

            <Route
              path="/admin/products"
              element={
              <ProtectedRoute>
                  <AdminLayoutWrapper>
                    <Products />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } />

            <Route
              path="/admin/batches"
              element={
              <ProtectedRoute>
                  <AdminLayoutWrapper>
                    <Batches
                    onViewBookings={(id) =>
                    window.location.href = `/admin/bookings?batch=${id}`
                    } />

                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } />

            <Route
              path="/admin/bookings"
              element={
              <ProtectedRoute>
                  <AdminLayoutWrapper>
                    <BatchBookings
                    batchId=""
                    onBack={() => window.location.href = '/admin/batches'} />

                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } />

            <Route
              path="/admin/customers"
              element={
              <ProtectedRoute>
                  <AdminLayoutWrapper>
                    <Customers />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } />


            {/* Fallback */}
            <Route path="*" element={<Navigate to="/shop" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>);

}