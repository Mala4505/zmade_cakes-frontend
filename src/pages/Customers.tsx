import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { SearchIcon, PhoneIcon, MailIcon, HistoryIcon } from 'lucide-react';
import type { Customer, Booking } from '../types';

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.customers.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleViewHistory = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoadingBookings(true);
    try {
      // Filter bookings by customer phone
      const allBookings = await api.bookings.getAll();
      const bookings = allBookings.filter(b => b.customerPhone === customer.phone);
      setCustomerBookings(bookings);
    } catch (error) {
      console.error('Failed to fetch customer bookings', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Customers
          </h2>
          <p className="text-muted-foreground mt-1">Manage your client base.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zm-teal text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} hoverable className="p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {customer.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                <span className="flex items-center">
                  <PhoneIcon className="h-3.5 w-3.5 mr-1.5" /> {customer.phone}
                </span>
              </div>
              {customer.email &&
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="flex items-center">
                    <MailIcon className="h-3.5 w-3.5 mr-1.5" /> {customer.email}
                  </span>
                </div>
              }
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-border mb-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold">{customer.totalBookings}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Collected</p>
                <p className="font-semibold text-zm-success">
                  {customer.collectedCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="font-semibold text-destructive">
                  {customer.cancelledCount}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-auto"
              onClick={() => handleViewHistory(customer)}
            >
              <HistoryIcon className="h-4 w-4 mr-2" /> View History
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="Customer History"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground">
                  {selectedCustomer.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last order</p>
                <p className="text-sm font-medium">
                  {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h5 className="font-medium text-foreground mt-6 mb-2">
              Recent Bookings
            </h5>

            {loadingBookings ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zm-teal"></div>
              </div>
            ) : customerBookings.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {customerBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Batch: {booking.batchId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.pickupDate).toLocaleDateString()} •
                        Qty: {booking.qty}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={booking.bookingStatus}>
                        {booking.bookingStatus}
                      </Badge>
                      <Badge variant={booking.paymentStatus}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No bookings found for this customer.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
