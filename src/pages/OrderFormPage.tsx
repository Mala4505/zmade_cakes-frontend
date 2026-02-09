// import React, { useEffect, useState } from 'react';
// import { OrderForm } from '../components/orders/OrderForm';
// import {
//   getAdminOrderById,
//   createAdminOrder,
//   updateAdminOrder
// } from '../api/endpoints';
// import { useToast } from '../components/ui/Toast';

// interface OrderFormPageProps {
//   mode: 'new' | 'edit';
//   orderId?: string;
//   onNavigate: (page: string) => void;
// }

// export function OrderFormPage({ mode, orderId, onNavigate }: OrderFormPageProps) {
//   const [initialData, setInitialData] = useState<any>(undefined);
//   const [loading, setLoading] = useState(mode === 'edit');
//   const { showToast } = useToast();

//   useEffect(() => {
//     if (mode === 'edit' && orderId) {
//       const fetchOrder = async () => {
//         try {
//           const data = await getAdminOrderById(Number(orderId));
//           setInitialData(data);
//         } catch {
//           showToast('Failed to load order', 'error');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchOrder();
//     }
//   }, [mode, orderId]);

//   const handleSave = async (data: any) => {
//     try {
//       if (mode === 'new') {
//         await createAdminOrder(data);
//         showToast('Order created successfully', 'success');
//       } else if (mode === 'edit' && orderId) {
//         await updateAdminOrder(Number(orderId), data);
//         showToast('Order updated successfully', 'success');
//       }
//       onNavigate('orders');
//     } catch {
//       showToast('Failed to save order', 'error');
//     }
//   };

//   if (loading) {
//     return <div className="p-6">Loading order...</div>; // replace with skeleton if desired
//   }

//   return (
//     <div className="max-w-5xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-3xl font-heading text-zm-stoneBrown">
//           {mode === 'new' ? 'New Order' : 'Edit Order'}
//         </h1>
//         <p className="text-zm-greyOlive text-sm">
//           {mode === 'new'
//             ? 'Create a new order for a customer'
//             : `Editing order #${initialData?.order_number}`}
//         </p>
//       </div>

//       <OrderForm
//         initialData={initialData}
//         onSave={handleSave}
//         onCancel={() => onNavigate('orders')}
//       />
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { OrderForm } from '../components/orders/OrderForm';
import {
  getAdminOrderById,
  createAdminOrder,
  updateAdminOrder
} from '../api/endpoints';
import { useToast } from '../components/ui/Toast';
import { useNavigate, useParams } from 'react-router-dom';

interface OrderFormPageProps {
  mode: 'new' | 'edit';
}

export function OrderFormPage({ mode }: OrderFormPageProps) {
  const [initialData, setInitialData] = useState<any>(undefined);
  const [loading, setLoading] = useState(mode === 'edit');
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchOrder = async () => {
        try {
          const data = await getAdminOrderById(Number(id));
          setInitialData(data);
        } catch {
          showToast('Failed to load order', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [mode, id]);

  const handleSave = async (data: any) => {
    try {
      if (mode === 'new') {
        await createAdminOrder(data);
        showToast('Order created successfully', 'success');
      } else if (mode === 'edit' && id) {
        await updateAdminOrder(Number(id), data);
        showToast('Order updated successfully', 'success');
      }
      navigate('/orders');
    } catch {
      showToast('Failed to save order', 'error');
    }
  };

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-zm-stoneBrown">
          {mode === 'new' ? 'New Order' : 'Edit Order'}
        </h1>
        <p className="text-zm-greyOlive text-sm">
          {mode === 'new'
            ? 'Create a new order for a customer'
            : `Editing order #${initialData?.order_number}`}
        </p>
      </div>

      <OrderForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate('/orders')}
      />
    </div>
  );
}
