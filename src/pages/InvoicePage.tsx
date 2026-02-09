// import React, { useEffect, useState } from 'react';
// import { Printer, Download, ArrowLeft, Cake } from 'lucide-react';
// import { Button } from '../components/ui/Button';
// import { getInvoiceView } from '../api/endpoints';
// import { useToast } from '../components/ui/Toast';

// interface InvoicePageProps {
//   token: string;
//   onBack: () => void;
// }

// export function InvoicePage({ token, onBack }: InvoicePageProps) {
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const { showToast } = useToast();

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const data = await getInvoiceView(token);
//         setOrder(data);
//       } catch {
//         showToast('Failed to load invoice', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInvoice();
//   }, [token]);

//   if (loading) {
//     return <div className="p-6">Loading invoice...</div>; // replace with skeleton if desired
//   }
//   if (!order) return <div>Invoice not found</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
//       {/* Toolbar */}
//       <div className="w-full max-w-3xl flex justify-between items-center mb-6 print:hidden">
//         <Button variant="ghost" onClick={onBack}>
//           <ArrowLeft size={18} className="mr-2" /> Back
//         </Button>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => window.print()}>
//             <Printer size={18} className="mr-2" /> Print
//           </Button>
//           <Button>
//             <Download size={18} className="mr-2" /> Download PDF
//           </Button>
//         </div>
//       </div>

//       {/* Invoice Paper */}
//       <div className="w-full max-w-3xl bg-white shadow-lg rounded-none md:rounded-xl overflow-hidden print:shadow-none print:w-full">
//         {/* Header */}
//         <div className="bg-zm-deepTeal text-white p-8 print:bg-white print:text-black print:border-b">
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Cake size={24} className="text-zm-mintCream print:text-black" />
//                 <h1 className="font-heading text-3xl">ZMade Cakes</h1>
//               </div>
//               <p className="text-zm-mintCream/80 text-sm print:text-gray-600">Kuwait City, Kuwait</p>
//               <p className="text-zm-mintCream/80 text-sm print:text-gray-600">+965 9999 8888</p>
//               <p className="text-zm-mintCream/80 text-sm print:text-gray-600">@zmadecakes</p>
//             </div>
//             <div className="text-right">
//               <h2 className="text-4xl font-bold opacity-20 mb-2 print:opacity-100 print:text-gray-200">
//                 INVOICE
//               </h2>
//               <p className="font-medium">#{order.order_number}</p>
//               <p className="text-sm opacity-80 print:text-gray-600">
//                 Date: {new Date(order.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="p-8 grid grid-cols-2 gap-8">
//           <div>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
//             <p className="font-bold text-lg text-gray-800">{order.customer_name}</p>
//             <p className="text-gray-600">{order.phone}</p>
//             <p className="text-gray-600">{order.area}</p>
//             <p className="text-gray-600 text-sm mt-1">{order.address}</p>
//           </div>
//           <div className="text-right">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Details</h3>
//             <p className="font-medium text-gray-800">{order.delivery_date}</p>
//             <p className="text-gray-600">{order.delivery_time}</p>
//             <div
//               className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
//                 order.payment_status === 'paid'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-amber-100 text-amber-700'
//               }`}
//             >
//               {order.payment_status === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
//             </div>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="px-8 py-4">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b-2 border-gray-100">
//                 <th className="text-left py-3 text-sm font-bold text-gray-400 uppercase">Item Description</th>
//                 <th className="text-center py-3 text-sm font-bold text-gray-400 uppercase w-20">Qty</th>
//                 <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase w-32">Price</th>
//                 <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase w-32">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {order.items.map((item: any) => (
//                 <tr key={item.id}>
//                   <td className="py-4">
//                     <p className="font-bold text-gray-800">{item.type}</p>
//                     <p className="text-sm text-gray-500">{item.size} • {item.flavor}</p>
//                   </td>
//                   <td className="py-4 text-center text-gray-600">{item.quantity}</td>
//                   <td className="py-4 text-right text-gray-600">{Number(item.price).toFixed(3)}</td>
//                   <td className="py-4 text-right font-medium text-gray-800">
//                     {(Number(item.price) * item.quantity).toFixed(3)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Totals */}
//         <div className="p-8 bg-gray-50 border-t border-gray-100">
//           <div className="flex justify-end">
//             <div className="w-64 space-y-3">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>{Number(order.total).toFixed(3)} KWD</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Delivery</span>
//                 <span>0.000 KWD</span>
//               </div>
//               <div className="flex justify-between text-xl font-bold text-zm-deepTeal pt-3 border-t border-gray-200">
//                 <span>Total</span>
//                 <span>{Number(order.total).toFixed(3)} KWD</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-8 text-center text-sm text-gray-400 border-t border-gray-100">
//           <p>Thank you for choosing ZMade Cakes! We hope to sweeten your day again soon.</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Printer, Download, ArrowLeft, Cake } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getInvoiceView } from '../api/endpoints';
import { useToast } from '../components/ui/Toast';
import { useParams, useNavigate } from 'react-router-dom';

export function InvoicePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (token) {
          const data = await getInvoiceView(token);
          setOrder(data);
        }
      } catch {
        showToast('Failed to load invoice', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [token]);

  if (loading) {
    return <div className="p-6">Loading invoice...</div>;
  }
  if (!order) return <div>Invoice not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      {/* Toolbar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={18} className="mr-2" /> Print
          </Button>
          <Button>
            <Download size={18} className="mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-none md:rounded-xl overflow-hidden print:shadow-none print:w-full">
        {/* Header */}
        <div className="bg-zm-deepTeal text-white p-8 print:bg-white print:text-black print:border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cake size={24} className="text-zm-mintCream print:text-black" />
                <h1 className="font-heading text-3xl">ZMade Cakes</h1>
              </div>
              <p className="text-zm-mintCream/80 text-sm print:text-gray-600">Kuwait City, Kuwait</p>
              <p className="text-zm-mintCream/80 text-sm print:text-gray-600">+965 9999 8888</p>
              <p className="text-zm-mintCream/80 text-sm print:text-gray-600">@zmadecakes</p>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold opacity-20 mb-2 print:opacity-100 print:text-gray-200">
                INVOICE
              </h2>
              <p className="font-medium">#{order.order_number}</p>
              <p className="text-sm opacity-80 print:text-gray-600">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-bold text-lg text-gray-800">{order.customer_name}</p>
            <p className="text-gray-600">{order.phone}</p>
            <p className="text-gray-600">{order.area}</p>
            <p className="text-gray-600 text-sm mt-1">{order.address}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Details</h3>
            <p className="font-medium text-gray-800">{order.delivery_date}</p>
            <p className="text-gray-600">{order.delivery_time}</p>
            <div
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                order.payment_status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {order.payment_status === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 py-4">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 text-sm font-bold text-gray-400 uppercase">Item Description</th>
                <th className="text-center py-3 text-sm font-bold text-gray-400 uppercase w-20">Qty</th>
                <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase w-32">Price</th>
                <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-4">
                    <p className="font-bold text-gray-800">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.size} • {item.flavor}</p>
                  </td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{Number(item.price).toFixed(3)}</td>
                  <td className="py-4 text-right font-medium text-gray-800">
                    {(Number(item.price) * item.quantity).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{Number(order.total).toFixed(3)} KWD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>0.000 KWD</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-zm-deepTeal pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{Number(order.total).toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center text-sm text-gray-400 border-t border-gray-100">
          <p>Thank you for choosing ZMade Cakes! We hope to sweeten your day again soon.</p>
        </div>
      </div>
    </div>
  );
}
