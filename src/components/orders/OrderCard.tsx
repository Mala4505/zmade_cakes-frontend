import React from 'react';
import {
  Calendar,
  User,
  ChevronRight,
  MapPin,
  Truck,
  ArrowRight
} from
  'lucide-react';
import { Card } from '../ui/Card';
import {
  StatusBadge,
  OrderStatus,
  getNextStatus,
  getNextStatusLabel
} from
  '../ui/StatusBadge';
import { Order } from '../../lib/data';
import { Button } from '../ui/Button';
interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}
export function OrderCard({ order, onClick, onStatusChange }: OrderCardProps) {
  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(order.status);
  const handleQuickStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99] border-l-4 border-l-zm-deepTeal relative overflow-hidden"
      onClick={onClick}>

      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-medium text-zm-greyOlive block mb-1">
            {order.order_number}
          </span>
          <h3 className="font-semibold text-zm-stoneBrown text-lg">
            {order.items.map((item) => item.flavor).join(', ')}
          </h3>
          <span className="text-xs text-zm-greyOlive truncate block max-w-[180px]">
            {Number(order.total).toFixed(3)} KWD
          </span>
        </div>
        <div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-zm-stoneBrown/80">
          <User size={14} className="mr-2 text-zm-greyOlive" />
          <span className="truncate">{order.customer_name}</span>
        </div>
        <div className="flex items-center text-sm text-zm-stoneBrown/80">
          <Calendar size={14} className="mr-2 text-zm-greyOlive" />
          <span>
            {order.delivery_date} • {order.delivery_time}
          </span>
        </div>
        <div className="flex items-center text-sm text-zm-stoneBrown/80">
          {order.pickup_or_delivery === 'pickup' ?
            <>
              <MapPin size={14} className="mr-2 text-zm-greyOlive" />
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                Pickup
              </span>
            </> :

            <>
              <Truck size={14} className="mr-2 text-zm-greyOlive" />
              <span className="text-xs bg-zm-mintCream px-2 py-0.5 rounded text-zm-deepTeal">
                Delivery
              </span>
            </>
          }
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-zm-greyOlive/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zm-greyOlive">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center text-xs font-medium text-zm-deepTeal">
            View Details <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {nextStatus ?
          <Button
            size="sm"
            variant="ghost"
            className="w-full bg-zm-deepTeal/10 text-zm-deepTeal hover:bg-zm-deepTeal/20 justify-center h-9"
            onClick={handleQuickStatusChange}>

            <span className="mr-2">{nextStatusLabel}</span>
            <ArrowRight size={14} />
          </Button> :

          <Button
            size="sm"
            variant="ghost"
            disabled
            className="w-full bg-gray-100 text-gray-400 justify-center h-9 cursor-not-allowed">

            {order.status === 'cancelled' ?
              'Order Cancelled' :
              'Order Completed'}
          </Button>
        }
      </div>
    </Card>);

}