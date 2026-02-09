import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Share2,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Coins
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge, OrderStatus } from '../components/ui/StatusBadge';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { getAdminOrders, updateOrderStatus, updateOrderPayment } from '../api/endpoints';
import { useParams, useNavigate } from 'react-router-dom';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<'status' | 'payment'>('status');
  const [pendingValue, setPendingValue] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getAdminOrders();
        const found = data.find((o: any) => String(o.id) === String(id));
        setOrder(found);
      } catch {
        showToast('Failed to load order', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading order details...</div>;
  }
  if (!order) return <div>Order not found</div>;

  const handleShare = async () => {
    const shareData = {
      title: `Order #${order.order_number}`,
      text: `Order details for ${order.customer_name}`,
      url: window.location.origin + `/invoice/${order.invoice_token}`
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully', 'success');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard', 'success');
      }
    } catch {
      showToast('Failed to share', 'error');
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    setActionType('status');
    setPendingValue(newStatus);
    setConfirmOpen(true);
  };

  const handlePaymentToggle = () => {
    setActionType('payment');
    setPendingValue(order.payment_status === 'paid' ? 'unpaid' : 'paid');
    setConfirmOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'status') {
        const updated = await updateOrderStatus(order.id, pendingValue);
        setOrder(updated);
        showToast(`Status updated to ${pendingValue}`, 'success');
      } else {
        const updated = await updateOrderPayment(order.id, pendingValue);
        setOrder(updated);
        showToast(
          `Payment status updated to ${pendingValue === 'paid' ? 'Paid' : 'Unpaid'}`,
          'success'
        );
      }
    } catch {
      showToast('Failed to update', 'error');
    } finally {
      setConfirmOpen(false);
    }
  };

  const statusOptions: OrderStatus[] = [
    'draft',
    'pending',
    'customer_confirmed',
    'preparing',
    'ready',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading text-zm-stoneBrown">
                {order.order_number}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-zm-greyOlive text-sm">
              Created on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/invoice/${order.invoice_token}`)}
          >
            <FileText size={16} className="mr-2" /> Invoice
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-2" /> Share
          </Button>
          <Button onClick={() => navigate(`/orders/${order.id}/edit`)}>
            <Edit size={16} className="mr-2" /> Edit
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-zm-greyOlive/10 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-zm-greyOlive">Quick Actions:</span>

          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <select
              className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-1 focus:ring-zm-deepTeal cursor-pointer"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Payment:</span>
            <button
              onClick={handlePaymentToggle}
              className={`
                text-xs font-bold px-3 py-1 rounded-full transition-colors
                ${order.payment_status === 'paid'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
              `}
            >
              {order.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                <div className="flex items-center text-zm-deepTeal mt-1">
                  <Phone size={14} className="mr-2" />
                  <a href={`tel:${order.phone}`} className="hover:underline">
                    {order.phone}
                  </a>
                </div>
              </div>
              <div className="pt-4 border-t border-zm-greyOlive/10">
                <div className="flex items-start text-zm-stoneBrown/80">
                  <MapPin size={16} className="mr-2 mt-1 text-zm-greyOlive shrink-0" />
                  <div>
                    <p className="font-medium">{order.area}</p>
                    {order.pickup_or_delivery === 'delivery' && (
                      <p className="text-sm text-zm-greyOlive">{order.address}</p>
                    )}
                    {order.pickup_or_delivery === 'pickup' && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">
                        Pickup Order
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-3 text-zm-deepTeal" />
                  <span className="font-medium">{order.delivery_date}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
                <div className="flex items-center">
                  <Clock size={18} className="mr-3 text-zm-deepTeal" />
                  <span className="font-medium">{order.delivery_time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
                <div className="flex items-center">
                  <Truck size={18} className="mr-3 text-zm-deepTeal" />
                  <span className="font-medium capitalize">
                    {order.pickup_or_delivery}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-zm-greyOlive/10">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-zm-stoneBrown">{item.type}</h4>
                        <p className="text-sm text-zm-greyOlive">
                          {item.size} • {item.flavor}
                        </p>
                        {item.notes && (
                          <div className="mt-2 text-xs bg-gray-50 p-2 rounded text-zm-stoneBrown/80 inline-block">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-zm-deepTeal">
                          {Number(item.price).toFixed(3)} KWD
                        </p>
                        <p className="text-xs text-zm-greyOlive">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zm-greyOlive/10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="w-full md:w-auto space-y-4">
                  {order.customer_notes && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm text-amber-800 max-w-md">
                      <span className="font-semibold block mb-1">Order Notes:</span>
                      {order.customer_notes}
                    </div>
                  )}

                  {Number(order.collateral) > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-md">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <Coins size={14} /> Collateral Deposit:{' '}
                        {Number(order.collateral).toFixed(3)} KWD
                      </div>
                      {order.collateralNotes && <p>{order.collateralNotes}</p>}
                    </div>
                  )}
                </div>

                <div className="text-right w-full md:w-auto">
                  <p className="text-sm text-zm-greyOlive mb-1">Total Amount</p>
                  <div className="flex items-center justify-end gap-3">
                    <p className="text-3xl font-heading text-zm-deepTeal">
                      {Number(order.total).toFixed(3)}{' '}
                      <span className="text-base font-sans font-normal text-zm-stoneBrown">
                        KWD
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={actionType === 'status' ? 'Update Status' : 'Update Payment'}
        message={`Are you sure you want to change the ${actionType} to ${
          actionType === 'payment'
            ? pendingValue === 'paid'
              ? 'Paid'
              : 'Unpaid'
            : pendingValue
        }?`}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}



// import { useState, useEffect } from 'react';
// import {
//   ArrowLeft,
//   Edit,
//   Share2,
//   FileText,
//   Phone,
//   MapPin,
//   Calendar,
//   Clock,
//   Truck,
//   Coins
// } from 'lucide-react';
// import { Button } from '../components/ui/Button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
// import { StatusBadge, OrderStatus } from '../components/ui/StatusBadge';
// import { useToast } from '../components/ui/Toast';
// import { ConfirmDialog } from '../components/ui/ConfirmDialog';
// import { getAdminOrders, updateOrderStatus, updateOrderPayment } from '../api/endpoints';

// interface OrderDetailPageProps {
//   orderId: string;
//   onNavigate: (page: string, id?: string) => void;
// }

// export function OrderDetailPage({ orderId, onNavigate }: OrderDetailPageProps) {
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const { showToast } = useToast();

//   // Dialog states
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [actionType, setActionType] = useState<'status' | 'payment'>('status');
//   const [pendingValue, setPendingValue] = useState<any>(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const data = await getAdminOrders();
//         const found = data.find((o: any) => String(o.id) === String(orderId));
//         setOrder(found);
//       } catch {
//         showToast('Failed to load order', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   if (loading) {
//     return <div className="p-6">Loading order details...</div>; // replace with skeleton if desired
//   }
//   if (!order) return <div>Order not found</div>;

//   const handleShare = async () => {
//     const shareData = {
//       title: `Order #${order.order_number}`,
//       text: `Order details for ${order.customer_name}`,
//       url: window.location.origin + `/view/${order.invoice_token}`
//     };
//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//         showToast('Shared successfully', 'success');
//       } else {
//         await navigator.clipboard.writeText(shareData.url);
//         showToast('Link copied to clipboard', 'success');
//       }
//     } catch {
//       showToast('Failed to share', 'error');
//     }
//   };

//   const handleStatusChange = (newStatus: OrderStatus) => {
//     setActionType('status');
//     setPendingValue(newStatus);
//     setConfirmOpen(true);
//   };

//   const handlePaymentToggle = () => {
//     setActionType('payment');
//     setPendingValue(order.payment_status === 'paid' ? 'unpaid' : 'paid');
//     setConfirmOpen(true);
//   };

//   const confirmAction = async () => {
//     try {
//       if (actionType === 'status') {
//         const updated = await updateOrderStatus(order.id, pendingValue);
//         setOrder(updated);
//         showToast(`Status updated to ${pendingValue}`, 'success');
//       } else {
//         const updated = await updateOrderPayment(order.id, pendingValue);
//         setOrder(updated);
//         showToast(
//           `Payment status updated to ${pendingValue === 'paid' ? 'Paid' : 'Unpaid'}`,
//           'success'
//         );
//       }
//     } catch {
//       showToast('Failed to update', 'error');
//     } finally {
//       setConfirmOpen(false);
//     }
//   };

//   const statusOptions: OrderStatus[] = [
//     'draft',
//     'pending',
//     'customer_confirmed',
//     'preparing',
//     'ready',
//     'delivered',
//     'cancelled'
//   ];

//   return (
//     <div className="space-y-6 pb-20 md:pb-0">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={() => onNavigate('orders')}>
//             <ArrowLeft size={20} />
//           </Button>
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-heading text-zm-stoneBrown">
//                 {order.order_number}
//               </h1>
//               <StatusBadge status={order.status} />
//             </div>
//             <p className="text-zm-greyOlive text-sm">
//               Created on {new Date(order.created_at).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Button variant="outline" size="sm" onClick={() => onNavigate('invoice', order.invoice_token)}>
//             <FileText size={16} className="mr-2" /> Invoice
//           </Button>
//           <Button variant="outline" size="sm" onClick={handleShare}>
//             <Share2 size={16} className="mr-2" /> Share
//           </Button>
//           <Button onClick={() => onNavigate('edit-order', order.id)}>
//             <Edit size={16} className="mr-2" /> Edit
//           </Button>
//         </div>
//       </div>

//       {/* Quick Actions Bar */}
//       <div className="bg-white p-4 rounded-xl border border-zm-greyOlive/10 shadow-sm flex flex-wrap gap-4 items-center justify-between">
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-medium text-zm-greyOlive">Quick Actions:</span>

//           <div className="flex items-center gap-2">
//             <span className="text-sm">Status:</span>
//             <select
//               className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-1 focus:ring-zm-deepTeal cursor-pointer"
//               value={order.status}
//               onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
//             >
//               {statusOptions.map((s) => (
//                 <option key={s} value={s}>
//                   {s.replace('_', ' ').toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-sm">Payment:</span>
//             <button
//               onClick={handlePaymentToggle}
//               className={`
//                 text-xs font-bold px-3 py-1 rounded-full transition-colors
//                 ${order.payment_status === 'paid'
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
//               `}
//             >
//               {order.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column: Customer Info */}
//         <div className="lg:col-span-1 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{order.customer_name}</h3>
//                 <div className="flex items-center text-zm-deepTeal mt-1">
//                   <Phone size={14} className="mr-2" />
//                   <a href={`tel:${order.phone}`} className="hover:underline">
//                     {order.phone}
//                   </a>
//                 </div>
//               </div>
//               <div className="pt-4 border-t border-zm-greyOlive/10">
//                 <div className="flex items-start text-zm-stoneBrown/80">
//                   <MapPin size={16} className="mr-2 mt-1 text-zm-greyOlive shrink-0" />
//                   <div>
//                     <p className="font-medium">{order.area}</p>
//                     {order.pickup_or_delivery === 'delivery' && (
//                       <p className="text-sm text-zm-greyOlive">{order.address}</p>
//                     )}
//                     {order.pickup_or_delivery === 'pickup' && (
//                       <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">
//                         Pickup Order
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Delivery Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
//                 <div className="flex items-center">
//                   <Calendar size={18} className="mr-3 text-zm-deepTeal" />
//                   <span className="font-medium">{order.delivery_date}</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
//                 <div className="flex items-center">
//                   <Clock size={18} className="mr-3 text-zm-deepTeal" />
//                   <span className="font-medium">{order.delivery_time}</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-zm-mintCream rounded-lg">
//                 <div className="flex items-center">
//                   <Truck size={18} className="mr-3 text-zm-deepTeal" />
//                   <span className="font-medium capitalize">
//                     {order.pickup_or_delivery}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column: Items & Payment */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Items</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="divide-y divide-zm-greyOlive/10">
//                 {order.items.map((item: any) => (
//                   <div key={item.id} className="py-4 first:pt-0 last:pb-0">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h4 className="font-semibold text-zm-stoneBrown">{item.type}</h4>
//                         <p className="text-sm text-zm-greyOlive">
//                           {item.size} • {item.flavor}
//                         </p>
//                         {item.notes && (
//                           <div className="mt-2 text-xs bg-gray-50 p-2 rounded text-zm-stoneBrown/80 inline-block">
//                             Note: {item.notes}
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-zm-deepTeal">
//                           {Number(item.price).toFixed(3)} KWD
//                         </p>
//                         <p className="text-xs text-zm-greyOlive">Qty: {item.quantity}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6 pt-6 border-t border-zm-greyOlive/10 flex flex-col md:flex-row justify-between items-end gap-4">
//                 <div className="w-full md:w-auto space-y-4">
//                   {order.customer_notes && (
//                     <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm text-amber-800 max-w-md">
//                       <span className="font-semibold block mb-1">Order Notes:</span>
//                       {order.customer_notes}
//                     </div>
//                   )}

//                   {Number(order.collateral) > 0 && (
//                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-md">
//                       <div className="flex items-center gap-2 font-semibold mb-1">
//                         <Coins size={14} /> Collateral Deposit:{' '}
//                         {Number(order.collateral).toFixed(3)} KWD
//                       </div>
//                       {order.collateralNotes && <p>{order.collateralNotes}</p>}
//                     </div>
//                   )}
//                 </div>

//                 <div className="text-right w-full md:w-auto">
//                   <p className="text-sm text-zm-greyOlive mb-1">Total Amount</p>
//                   <div className="flex items-center justify-end gap-3">
//                     <p className="text-3xl font-heading text-zm-deepTeal">
//                       {Number(order.total).toFixed(3)}{' '}
//                       <span className="text-base font-sans font-normal text-zm-stoneBrown">
//                         KWD
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <ConfirmDialog
//         isOpen={confirmOpen}
//         title={actionType === 'status' ? 'Update Status' : 'Update Payment'}
//         message={`Are you sure you want to change the ${actionType} to ${
//           actionType === 'payment'
//             ? pendingValue === 'paid'
//               ? 'Paid'
//               : 'Unpaid'
//             : pendingValue
//         }?`}
//         onConfirm={confirmAction}
//         onCancel={() => setConfirmOpen(false)}
//       />
//     </div>
//   );
// }
