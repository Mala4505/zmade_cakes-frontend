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
  // const navigate = useNavigate();
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
                    // navigate(`/admin/bookings?batch=${id}`)
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
                    {/* onBack={() => navigate('/admin/batches')} /> */}

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


// import { useState, Suspense, lazy, ReactNode } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   useNavigate
// } from "react-router-dom";

// import { AuthProvider } from "./store/authStore";
// import { CartProvider } from "./store/cartStore";
// import { ProtectedRoute } from "./components/layout/ProtectedRoute";
// import { AppLayout } from "./components/layout/AppLayout";
// import { PublicLayout } from "./components/layout/PublicLayout";
// import { CartDrawer } from "./components/cart/CartDrawer";

// import { useAuth } from "./store/authStore";
// import { useCart } from "./store/cartStore";

// /* -----------------------------
//    Lazy Loaded Pages
// ----------------------------- */

// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then(module => ({ default: module.AdminLogin })));
// const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
// const Batches = lazy(() => import("./pages/Batches").then(module => ({ default: module.Batches })));
// const BatchBookings = lazy(() => import("./pages/BatchBookings").then(module => ({ default: module.BatchBookings })));
// const Customers = lazy(() => import("./pages/Customers").then(module => ({ default: module.Customers })));
// const Products = lazy(() => import("./pages/Products").then(module => ({ default: module.Products })));

// const Shop = lazy(() => import("./pages/shop/Shop").then(module => ({ default: module.Shop })));
// const ProductDetail = lazy(() => import("./pages/shop/ProductDetail").then(module => ({ default: module.ProductDetail })));
// const Checkout = lazy(() => import("./pages/shop/Checkout").then(module => ({ default: module.Checkout })));
// const OrderSuccess = lazy(() => import("./pages/shop/OrderSuccess").then(module => ({ default: module.OrderSuccess })));
// const OrderTracking = lazy(() => import("./pages/shop/OrderTracking").then(module => ({ default: module.OrderTracking })));

// /* -----------------------------
//    Admin Layout Wrapper
// ----------------------------- */

// type Props = {
//   children?: ReactNode;
// };


// function AdminLayoutWrapper({ children }: Props) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const pathParts = location.pathname.split("/");
//   const currentPage = pathParts[2] || "dashboard";

//   const handleNavigate = (page: string) => {
//     navigate(`/admin/${page}`);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <AppLayout
//       currentPage={currentPage}
//       onNavigate={handleNavigate}
//       onLogout={handleLogout}
//     >
//       {children}
//     </AppLayout>
//   );
// }

// /* -----------------------------
//    Public Layout Wrapper
// ----------------------------- */

// type PublicLayoutWrapperProps = {
//   children?: ReactNode;
// };

// function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const { getItemCount } = useCart();

//   return (
//     <PublicLayout
//       cartItemCount={getItemCount()}
//       onCartClick={() => setIsCartOpen(true)}
//     >
//       {children}

//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//       />
//     </PublicLayout>
//   );
// }

// /* -----------------------------
//    Main App
// ----------------------------- */

// export function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <BrowserRouter>

//           <Suspense fallback={<div style={{padding:20}}>Loading...</div>}>

//             <Routes>

//               {/* Public Routes */}

//               <Route path="/" element={<Navigate to="/shop" replace />} />

//               <Route path="/login" element={<AdminLogin />} />

//               <Route
//                 path="/shop"
//                 element={
//                   <PublicLayoutWrapper>
//                     <Shop />
//                   </PublicLayoutWrapper>
//                 }
//               />

//               <Route
//                 path="/shop/product/:id"
//                 element={
//                   <PublicLayoutWrapper>
//                     <ProductDetail />
//                   </PublicLayoutWrapper>
//                 }
//               />

//               <Route
//                 path="/checkout"
//                 element={
//                   <PublicLayoutWrapper>
//                     <Checkout />
//                   </PublicLayoutWrapper>
//                 }
//               />

//               <Route
//                 path="/order-success"
//                 element={
//                   <PublicLayoutWrapper>
//                     <OrderSuccess />
//                   </PublicLayoutWrapper>
//                 }
//               />

//               <Route
//                 path="/order/:token"
//                 element={
//                   <PublicLayoutWrapper>
//                     <OrderTracking />
//                   </PublicLayoutWrapper>
//                 }
//               />

//               {/* Admin Routes */}

//               <Route
//                 path="/admin"
//                 element={
//                   <ProtectedRoute>
//                     <AdminLayoutWrapper>
//                       <Dashboard />
//                     </AdminLayoutWrapper>
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/admin/dashboard"
//                 element={<Navigate to="/admin" replace />}
//               />

//               <Route
//                 path="/admin/products"
//                 element={
//                   <ProtectedRoute>
//                     <AdminLayoutWrapper>
//                       <Products />
//                     </AdminLayoutWrapper>
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/admin/batches"
//                 element={
//                   <ProtectedRoute>
//                     <AdminLayoutWrapper>
//                       <Batches
//                         onViewBookings={(id) =>
//                           window.location.href = `/admin/bookings?batch=${id}`
//                         }
//                       />
//                     </AdminLayoutWrapper>
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/admin/bookings"
//                 element={
//                   <ProtectedRoute>
//                     <AdminLayoutWrapper>
//                       <BatchBookings
//                         batchId=""
//                         onBack={() => window.location.href = "/admin/batches"}
//                       />
//                     </AdminLayoutWrapper>
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/admin/customers"
//                 element={
//                   <ProtectedRoute>
//                     <AdminLayoutWrapper>
//                       <Customers />
//                     </AdminLayoutWrapper>
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Fallback */}

//               <Route path="*" element={<Navigate to="/shop" replace />} />

//             </Routes>

//           </Suspense>

//         </BrowserRouter>
//       </CartProvider>
//     </AuthProvider>
//   );
// }