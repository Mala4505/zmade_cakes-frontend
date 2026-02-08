import React from 'react';
import { OrderForm } from '../components/orders/OrderForm';
import { mockOrders } from '../mockData';
interface OrderFormPageProps {
  mode: 'new' | 'edit';
  orderId?: string;
  onNavigate: (page: string) => void;
}
export function OrderFormPage({
  mode,
  orderId,
  onNavigate
}: OrderFormPageProps) {
  const initialData =
  mode === 'edit' ? mockOrders.find((o) => o.id === orderId) : undefined;
  const handleSave = (data: any) => {
    console.log('Saving order:', data);
    // In a real app, this would save to API
    onNavigate('orders');
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-zm-stoneBrown">
          {mode === 'new' ? 'New Order' : 'Edit Order'}
        </h1>
        <p className="text-zm-greyOlive text-sm">
          {mode === 'new' ?
          'Create a new order for a customer' :
          `Editing order #${initialData?.number}`}
        </p>
      </div>

      <OrderForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => onNavigate('orders')} />

    </div>);

}