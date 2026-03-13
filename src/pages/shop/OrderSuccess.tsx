import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Order } from '../../types';
export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  useEffect(() => {
    if (!order) {
      navigate('/shop', {
        replace: true
      });
    }
  }, [order, navigate]);
  if (!order) return null;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(order.token);
    // Could add a toast here
  };
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100
        }}
        className="text-center mb-10">

        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-zm-success-light mb-6">
          <CheckCircleIcon className="h-12 w-12 text-zm-success" />
        </div>
        <h1 className="font-heading text-5xl text-foreground mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your order, {order.customer.name}. We've received it and
          are getting it ready.
        </p>
      </motion.div>

      <Card className="p-6 md:p-8 mb-8 border-2 border-zm-teal/20">
        <div className="text-center mb-8 pb-8 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Your Tracking Token
          </p>
          <div className="flex items-center justify-center space-x-3">
            <code className="text-2xl md:text-3xl font-bold text-zm-teal bg-zm-teal-light/50 px-4 py-2 rounded-lg">
              {order.token}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy token">

              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Save this token to track your order status later.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">
            Order Summary
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) =>
            <div key={idx} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium text-foreground">
                    {item.quantity}x {item.productName}
                  </span>
                  <p className="text-muted-foreground mt-1">
                    Pickup: {new Date(item.pickupDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-medium">
                  KWD {item.price * item.quantity}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium text-muted-foreground">
              Payment Method
            </span>
            <span className="uppercase text-sm font-semibold">
              {order.paymentMethod}
            </span>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-zm-teal">KWD {order.totalAmount}</span>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="primary"
          className="py-6 px-8 text-lg"
          onClick={() => navigate(`/order/${order.token}`)}>

          <ExternalLinkIcon className="h-5 w-5 mr-2" />
          Track Order Now
        </Button>
        <Button
          variant="outline"
          className="py-6 px-8 text-lg"
          onClick={() => navigate('/shop')}>

          Continue Shopping
        </Button>
      </div>
    </div>);

}