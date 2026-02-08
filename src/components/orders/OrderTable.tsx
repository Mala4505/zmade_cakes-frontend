import React from 'react';
import { Eye, Edit2, ArrowRight } from 'lucide-react';
import {
  StatusBadge,
  OrderStatus,
  getNextStatus,
  getNextStatusLabel } from
'../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Order } from '../../mockData';
interface OrderTableProps {
  orders: Order[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange?: (id: string, status: OrderStatus) => void;
}
export function OrderTable({
  orders,
  onView,
  onEdit,
  onStatusChange
}: OrderTableProps) {
  const handleQuickStatusChange = (
  e: React.MouseEvent,
  orderId: string,
  nextStatus: OrderStatus) =>
  {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(orderId, nextStatus);
    }
  };
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zm-greyOlive/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zm-mintCream text-zm-stoneBrown border-b border-zm-greyOlive/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Order #</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Delivery</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Next Step</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zm-greyOlive/10">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const nextStatusLabel = getNextStatusLabel(order.status);
              return (
                <tr
                  key={order.id}
                  className="hover:bg-zm-mintCream/30 transition-colors cursor-pointer"
                  onClick={() => onView(order.id)}>

                  <td className="px-6 py-4 font-medium text-zm-deepTeal">
                    {order.number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-zm-greyOlive">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${order.deliveryType === 'pickup' ? 'bg-gray-100' : 'bg-zm-mintCream text-zm-deepTeal'}`}>

                      {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zm-stoneBrown">
                      {order.deliveryDate}
                    </div>
                    <div className="text-xs text-zm-greyOlive">
                      {order.deliveryTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {order.total.toFixed(3)} KWD
                    </div>
                    <div className="text-xs text-zm-greyOlive truncate max-w-[140px]">
                      {order.items.map((item) => item.flavor).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}>

                    {nextStatus ?
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-zm-deepTeal/10 text-zm-deepTeal hover:bg-zm-deepTeal/20 h-8 text-xs px-3"
                      onClick={(e) =>
                      handleQuickStatusChange(e, order.id, nextStatus)
                      }>

                        {nextStatusLabel}{' '}
                        <ArrowRight size={12} className="ml-1" />
                      </Button> :

                    <span className="text-xs text-gray-400 italic px-2">
                        {order.status === 'cancelled' ?
                      'Cancelled' :
                      'Completed'}
                      </span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="flex justify-end space-x-2"
                      onClick={(e) => e.stopPropagation()}>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(order.id)}
                        title="View Order">

                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(order.id)}
                        title="Edit Order">

                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}