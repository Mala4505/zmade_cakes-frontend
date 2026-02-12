import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { OrdersListPage } from "./pages/OrdersListPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { OrderFormPage } from "./pages/OrderFormPage";
import { InvoicePage } from "./pages/InvoicePage";
import { ToastProvider } from "./components/ui/Toast";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/orders" replace />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path="/invoice/:token" element={<InvoicePage />} />

          {/* Protected routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Layout title="Orders">
                  <OrdersListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute>
                <Layout title="New Order">
                  <OrderFormPage mode="new" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <Layout title="Order Details">
                  <OrderDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <ProtectedRoute>
                <Layout title="Edit Order">
                  <OrderFormPage mode="edit" />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
