import { useState } from 'react';
import { Plus, Save, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ItemLine } from './ItemLine';
import { Order, OrderItem } from '../../mockData';
import { OrderStatus } from '../ui/StatusBadge';
import { useToast } from '../ui/Toast';
interface OrderFormProps {
  initialData?: Order;
  onSave: (order: Partial<Order>) => void;
  onCancel: () => void;
  isCustomerView?: boolean;
}
export function OrderForm({
  initialData,
  onSave,
  onCancel,
  isCustomerView = false
}: OrderFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<Order>>(
    initialData || {
      customerName: '',
      phone: '',
      customerAddress: '',
      customerArea: '',
      delivery_date: '',
      delivery_time: '',
      pickup_or_delivery: 'delivery',
      status: 'draft',
      items: [],
      notes: '',
      collateral: 0,
      collateralNotes: '',
      total: 0,
      isPaid: false
    }
  );
  const [items, setItems] = useState<OrderItem[]>(initialData?.items || []);
  const handleItemChange = (id: string, field: keyof OrderItem, value: any) => {
    const newItems = items.map((item) =>
      item.id === id ?
        {
          ...item,
          [field]: value
        } :
        item
    );
    setItems(newItems);
    updateTotal(newItems);
  };
  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: '',
      size: '',
      flavor: '',
      quantity: 1,
      notes: '',
      price: 0
    };
    setItems([...items, newItem]);
  };
  const handleRemoveItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    updateTotal(newItems);
  };
  const updateTotal = (currentItems: OrderItem[]) => {
    const total = currentItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setFormData((prev) => ({
      ...prev,
      total
    }));
  };
  const handleChange = (field: keyof Order, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      items
    });
    showToast('Order saved successfully!', 'success');
  };
  const statusOptions: OrderStatus[] = [
    'draft',
    'pending',
    'customer_confirmed',
    'preparing',
    'ready',
    'delivered',
    'cancelled'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between mb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="pl-0 hover:bg-transparent">

          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save size={18} className="mr-2" /> Save Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Delivery */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                required
                readOnly={isCustomerView && formData.status !== 'draft'} />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                readOnly={isCustomerView && formData.status !== 'draft'} />

              <Input
                label="Area"
                value={formData.customerArea}
                onChange={(e) => handleChange('customerArea', e.target.value)}
                readOnly={isCustomerView && formData.status !== 'draft'} />


              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-2">
                <button
                  type="button"
                  onClick={() => handleChange('pickup_or_delivery', 'delivery')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${formData.pickup_or_delivery === 'delivery' ? 'bg-white shadow text-zm-deepTeal' : 'text-gray-500'}`}>

                  <Truck size={14} /> Delivery
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('pickup_or_delivery', 'pickup')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${formData.pickup_or_delivery === 'pickup' ? 'bg-white shadow text-zm-deepTeal' : 'text-gray-500'}`}>

                  <MapPin size={14} /> Pickup
                </button>
              </div>

              {formData.pickup_or_delivery === 'delivery' &&
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zm-stoneBrown/80 ml-1">
                    Address
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-xl border border-zm-greyOlive/20 bg-white px-3 py-2 text-sm focus:border-zm-deepTeal focus:outline-none"
                    value={formData.customerAddress}
                    onChange={(e) =>
                      handleChange('customerAddress', e.target.value)
                    }
                    readOnly={isCustomerView && formData.status !== 'draft'} />

                </div>
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Date"
                type="date"
                value={formData.delivery_date}
                onChange={(e) => handleChange('delivery_date', e.target.value)}
                required
                readOnly={isCustomerView && formData.status !== 'draft'} />

              <Input
                label="Time"
                type="time"
                value={formData.delivery_time}
                onChange={(e) => handleChange('delivery_time', e.target.value)}
                required
                readOnly={isCustomerView && formData.status !== 'draft'} />


              {!isCustomerView &&
                <div className="pt-4 border-t border-zm-greyOlive/10">
                  <label className="text-sm font-medium text-zm-stoneBrown/80 ml-1 block mb-2">
                    Order Status
                  </label>
                  <select
                    className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}>

                    {statusOptions.map((s) =>
                      <option key={s} value={s}>
                        {s.replace('_', ' ').toUpperCase()}
                      </option>
                    )}
                  </select>
                </div>
              }
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              {!isCustomerView &&
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleAddItem}>

                  <Plus size={16} className="mr-1" /> Add Item
                </Button>
              }
            </CardHeader>
            <CardContent>
              {items.length === 0 ?
                <div className="text-center py-10 text-zm-greyOlive bg-gray-50 rounded-xl border border-dashed border-zm-greyOlive/30">
                  <p>No items added yet.</p>
                  {!isCustomerView &&
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-2 text-zm-deepTeal"
                      onClick={handleAddItem}>

                      Add your first item
                    </Button>
                  }
                </div> :

                <div className="space-y-4">
                  {items.map((item) =>
                    <ItemLine
                      key={item.id}
                      item={item}
                      onChange={handleItemChange}
                      onRemove={handleRemoveItem}
                      readOnly={isCustomerView} />

                  )}
                </div>
              }
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium text-zm-stoneBrown/80 ml-1 block mb-1">
                    Order Notes
                  </label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-xl border border-zm-greyOlive/20 bg-white px-3 py-2 text-sm focus:border-zm-deepTeal focus:outline-none"
                    placeholder="Internal notes or special instructions..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)} />

                </div>

                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium text-zm-stoneBrown/80 ml-1 block mb-1">
                    Collateral Deposit
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="number"
                      placeholder="Amount (KWD)"
                      value={formData.collateral}
                      onChange={(e) =>
                        handleChange(
                          'collateral',
                          parseFloat(e.target.value) || 0
                        )
                      } />

                  </div>
                  <textarea
                    className="flex min-h-[40px] w-full rounded-xl border border-zm-greyOlive/20 bg-white px-3 py-2 text-sm focus:border-zm-deepTeal focus:outline-none"
                    placeholder="Collateral notes (e.g. Glass stand deposit)"
                    value={formData.collateralNotes}
                    onChange={(e) =>
                      handleChange('collateralNotes', e.target.value)
                    } />

                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zm-greyOlive/10">
                <div className="w-full md:w-auto text-right bg-zm-mintCream p-4 rounded-xl min-w-[200px]">
                  <p className="text-sm text-zm-greyOlive mb-1">Total Amount</p>
                  <p className="text-3xl font-heading text-zm-deepTeal">
                    {(formData.total || 0).toFixed(3)}{' '}
                    <span className="text-base font-sans font-normal text-zm-stoneBrown">
                      KWD
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>);

}