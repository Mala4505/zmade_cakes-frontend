import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { OrdersListPage } from './pages/OrdersListPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrderFormPage } from './pages/OrderFormPage';
import { InvoicePage } from './pages/InvoicePage';
import { ToastProvider } from './components/ui/Toast';
export function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentOrderId, setCurrentOrderId] = useState<string | undefined>(
    undefined
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) setCurrentOrderId(id);
    window.scrollTo(0, 0);
  };
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('orders');
  };
  // Public pages (no auth required)
  if (currentPage.startsWith('invoice')) {
    return (
      <ToastProvider>
        <InvoicePage
          token={currentOrderId || ''}
          onBack={() => handleNavigate('orders')} />

      </ToastProvider>);

  }
  return (
    <ToastProvider>
      {!isAuthenticated && currentPage === 'login' ?
        <LoginPage onLogin={handleLogin} /> :

        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          {currentPage === 'orders' &&
            <OrdersListPage onNavigate={handleNavigate} />
          }

          {currentPage === 'order-detail' && currentOrderId &&
            <OrderDetailPage
              orderId={currentOrderId}
              onNavigate={handleNavigate} />

          }

          {currentPage === 'new-order' &&
            <OrderFormPage mode="new" onNavigate={handleNavigate} />
          }

          {currentPage === 'edit-order' && currentOrderId &&
            <OrderFormPage
              mode="edit"
              orderId={currentOrderId}
              onNavigate={handleNavigate} />

          }
        </Layout>
      }
    </ToastProvider>);

}