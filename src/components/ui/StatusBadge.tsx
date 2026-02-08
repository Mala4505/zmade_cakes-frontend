import React from 'react';
import { Badge } from './Badge';
export type OrderStatus =
'draft' |
'pending' |
'customer_confirmed' |
'preparing' |
'ready' |
'delivered' |
'cancelled';
interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config: Record<
    OrderStatus,
    {
      label: string;
      className: string;
    }> =
  {
    draft: {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-600 border border-gray-200'
    },
    pending: {
      label: 'Pending',
      className: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    customer_confirmed: {
      label: 'Confirmed',
      className: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    preparing: {
      label: 'Preparing',
      className: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    ready: {
      label: 'Ready',
      className: 'bg-green-50 text-green-700 border border-green-200'
    },
    delivered: {
      label: 'Delivered',
      className:
      'bg-zm-deepTeal/10 text-zm-deepTeal border border-zm-deepTeal/20'
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-50 text-red-700 border border-red-200'
    }
  };
  const { label, className: statusClass } = config[status] || config.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass} ${className}`}>

      {label}
    </span>);

}
export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const flow: Record<OrderStatus, OrderStatus | null> = {
    draft: 'pending',
    pending: 'customer_confirmed',
    customer_confirmed: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
    delivered: null,
    cancelled: null
  };
  return flow[current];
}
export function getNextStatusLabel(current: OrderStatus): string | null {
  const labels: Record<OrderStatus, string | null> = {
    draft: 'Mark as Pending',
    pending: 'Mark as Confirmed',
    customer_confirmed: 'Mark as Preparing',
    preparing: 'Mark as Ready',
    ready: 'Mark as Delivered',
    delivered: null,
    cancelled: null
  };
  return labels[current];
}