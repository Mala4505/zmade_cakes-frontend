import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon } from
'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
export function OrderTracking() {
  const { token } = useParams<{
    token: string;
  }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) return;
      try {
        const data = await api.orders.getOrderByToken(token);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [token]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal"></div>
      </div>);

  }
  if (error || !order) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <XCircleIcon className="h-16 w-16 text-destructive mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Order Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          We couldn't find an order with token "{token}". Please check the token
          and try again.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zm-teal focus:ring-offset-2 bg-zm-teal text-white hover:bg-zm-teal-hover shadow-sm h-10 px-4 py-2">

          Back to Shop
        </Link>
      </div>);

  }
  const getStatusIcon = () => {
    switch (order.status) {
      case 'collected':
        return <CheckCircleIcon className="h-12 w-12 text-zm-success" />;
      case 'cancelled':
        return <XCircleIcon className="h-12 w-12 text-destructive" />;
      default:
        return <PackageIcon className="h-12 w-12 text-zm-teal" />;
    }
  };
  const getStatusMessage = () => {
    switch (order.status) {
      case 'collected':
        return 'Order Collected. Enjoy!';
      case 'cancelled':
        return 'Order Cancelled';
      default:
        return 'Order Confirmed & Preparing';
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        to="/shop"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-zm-teal mb-8 transition-colors">

        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            {getStatusIcon()}
          </div>
          <h1 className="font-heading text-4xl text-foreground mb-2">
            {getStatusMessage()}
          </h1>
          <p className="text-muted-foreground">
            Tracking Token:{' '}
            <span className="font-mono font-bold text-foreground">
              {order.token}
            </span>
          </p>
        </div>

        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer</p>
              <p className="font-medium text-foreground">
                {order.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customer.phone}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Order Status
                </p>
                <Badge variant={order.status}>{order.status}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Payment</p>
                <Badge variant={order.paymentStatus}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Items</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) =>
            <div
              key={idx}
              className="flex justify-between items-start p-4 bg-muted/30 rounded-lg">

                <div>
                  <span className="font-medium text-foreground">
                    {item.quantity}x {item.productName}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Pickup: {new Date(item.pickupDate).toLocaleDateString()}
                  </div>
                </div>
                <span className="font-medium">
                  KWD {item.price * item.quantity}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-zm-teal">KWD {order.totalAmount}</span>
          </div>
        </Card>
      </motion.div>
    </div>);

}