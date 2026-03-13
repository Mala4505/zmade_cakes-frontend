import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';
import { useCart } from '../../store/cartStore';
import { api } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function Checkout() {
  const { state, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (state.items.length === 0 && !isSubmitting) {
    navigate('/shop');
    return null;
  }

  const validatePhone = (phone: string) => {
    // Kuwait format (8 digits) or international starting with 00
    const kwRegex = /^[0-9]{8}$/;
    const intRegex = /^00[0-9]{8,15}$/;
    return kwRegex.test(phone) || intRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter a valid 8-digit Kuwait number or start with 00';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Find or create customer first
      const customer = await api.customers.findOrCreateByPhone(
        formData.name,
        formData.phone
      );

      // Create bookings for each cart item
      const bookingPromises = state.items.map(async (item) => {
        return api.bookings.create({
          customerName: formData.name,
          customerPhone: formData.phone,
          qty: item.quantity,
          pickupDate: item.pickupDate,
          paymentStatus: formData.paymentMethod === 'cash' ? 'unpaid' : 'paid',
          discount: 0,
          bookingStatus: 'booked'
        }, customer.id, parseInt(item.batchStockId));
      });

      const bookings = await Promise.all(bookingPromises);

      clearCart();
      navigate('/order-success', {
        state: {
          order: {
            id: bookings[0]?.id || 'order-' + Date.now(),
            token: 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            customer: {
              name: formData.name,
              phone: formData.phone
            },
            items: state.items,
            paymentMethod: formData.paymentMethod,
            totalAmount: getTotal()
          }
        }
      });
    } catch (error) {
      console.error('Checkout failed', error);
      setErrors({
        submit: 'Failed to place order. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-zm-teal mb-8 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <h1 className="font-heading text-4xl text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Contact Information
            </h2>
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {errors.submit && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                error={errors.phone}
                placeholder="e.g. 99999999 or 0096599999999"
                type="tel"
                required
              />

              <div className="pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Payment Method
                </h2>
                <Select
                  label="Select Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  options={[
                    { value: 'cash', label: 'Cash on Pickup' },
                    { value: 'wamd', label: 'WAMD' }
                  ]}
                />
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-5">
          <Card className="p-6 md:p-8 sticky top-24 bg-muted/30">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {state.items.map((item) => (
                <div
                  key={`${item.productId}-${item.batchStockId}`}
                  className="flex items-start space-x-4 py-2"
                >
                  <div className="h-16 w-16 rounded-md overflow-hidden border border-border flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pickup: {new Date(item.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-zm-teal">
                    KWD {item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>KWD {getTotal()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-foreground pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-zm-teal">KWD {getTotal()}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              variant="primary"
              className="w-full py-6 text-lg shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Place Order
                </div>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing your order, you agree to our Terms of Service.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
