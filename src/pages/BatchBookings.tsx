import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PickupDatePicker } from '../components/ui/PickupDatePicker';
import { api } from '../services/api';
import type { Booking, Batch, BatchVariantConfig } from '../services/api.types';
import {
  ArrowLeftIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  DollarSignIcon,
  PlusIcon,
} from 'lucide-react';

interface BatchBookingsProps {
  batchId?: string;
  onBack?: () => void;
}

export function BatchBookings({ batchId: propBatchId, onBack }: BatchBookingsProps) {
  const [searchParams] = useSearchParams();
  const batchId = propBatchId || searchParams.get('batch');

  const [batch, setBatch] = useState<Batch | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wamd'>('cash');
  const [discount, setDiscount] = useState(0);
  const [variantConfigs, setVariantConfigs] = useState<BatchVariantConfig[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'collect' | 'cancel' | 'pay';
    bookingId: string | null;
  }>({ isOpen: false, type: 'collect', bookingId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (batchId) {
          const [batchesData, bookingsData] = await Promise.all([
            api.batches.getAll(),
            api.bookings.getAll(batchId),
          ]);
          const found = batchesData.find((b) => b.id === batchId) || null;
          setBatch(found);
          setBookings(bookingsData);

          // Load variant configs for the form
          if (found) {
            const configs = await api.batches.getVariantConfigs(batchId);
            const enabled = configs.filter((c) => c.isEnabled && c.variant.isActive);
            setVariantConfigs(enabled);
            if (enabled.length > 0) setSelectedVariantId(enabled[0].id);
          }
        } else {
          const bookingsData = await api.bookings.getAll();
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [batchId]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search)
  );

  const handleAction = (bookingId: string, type: 'collect' | 'cancel' | 'pay') => {
    setConfirmModal({ isOpen: true, type, bookingId });
  };

  const confirmAction = async () => {
    if (!confirmModal.bookingId) return;
    setIsSubmitting(true);
    try {
      let updated: Booking;
      if (confirmModal.type === 'collect') {
        updated = await api.bookings.markCollected(confirmModal.bookingId);
      } else if (confirmModal.type === 'cancel') {
        updated = await api.bookings.cancel(confirmModal.bookingId);
      } else {
        updated = await api.bookings.markPaid(confirmModal.bookingId);
      }
      setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
      setConfirmModal({ isOpen: false, type: 'collect', bookingId: null });
    } catch (error) {
      console.error(`Failed to ${confirmModal.type} booking`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setCustomerName('');
    setCustomerPhone('');
    setQuantity(1);
    setPickupDate(batch?.startDate || '');
    setPaymentStatus('unpaid');
    setPaymentMethod('cash');
    setDiscount(0);
    setFormError(null);
    if (variantConfigs.length > 0) setSelectedVariantId(variantConfigs[0].id);
    setIsModalOpen(true);
  };

  // Compute total for display
  const selectedConfig = variantConfigs.find((c) => c.id === selectedVariantId);
  const computedTotal = selectedConfig
    ? selectedConfig.effectivePrice * quantity - discount
    : 0;

  const maxQuantity = selectedConfig && batch
    ? Math.floor(batch.availablePieces / selectedConfig.variant.pieces)
    : 99;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch) return;
    if (!customerName || !customerPhone) {
      setFormError('Customer name and phone are required.');
      return;
    }
    if (!pickupDate) {
      setFormError('Please select a pickup date.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const customer = await api.customers.findOrCreateByPhone(customerName, customerPhone);
      const variantId = selectedConfig ? parseInt(selectedConfig.variant.id) : undefined;

      const newBooking = await api.bookings.create(
        {
          pickupDate,
          qty: quantity,
          paymentStatus,
          discount,
        },
        parseInt(customer.id.toString()),
        parseInt(batch.id),
        variantId
      );
      setBookings([newBooking, ...bookings]);
      setIsModalOpen(false);
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        Object.values(error?.response?.data || {})[0] ||
        'Failed to create booking.';
      setFormError(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="font-heading text-2xl md:text-3xl text-foreground">
            {batch ? `${batch.productName} Bookings` : 'All Bookings'}
          </h2>
          <p className="text-sm text-muted-foreground">{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zm-teal text-sm"
          />
        </div>
        {batch && (
          <Button onClick={openAddModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Box Size</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Pickup</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className={`hover:bg-muted/20 transition-colors ${
                    booking.bookingStatus !== 'booked' ? 'opacity-60 bg-muted/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{booking.customerName}</div>
                    <div className="text-xs text-muted-foreground">{booking.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {booking.variantLabel || '—'}
                  </td>
                  <td className="px-6 py-4 font-medium">{booking.qty}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={booking.paymentStatus}>{booking.paymentStatus}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={booking.bookingStatus}>{booking.bookingStatus}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {booking.paymentStatus !== 'paid' && booking.bookingStatus === 'booked' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(booking.id, 'pay')}
                        className="text-zm-teal hover:bg-zm-teal-light/50 border-zm-teal/20"
                        title="Mark Paid"
                      >
                        <DollarSignIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={booking.bookingStatus !== 'booked'}
                      onClick={() => handleAction(booking.id, 'collect')}
                      className="text-zm-success hover:bg-zm-success-light/50 border-zm-success/20"
                      title="Mark Collected"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={booking.bookingStatus !== 'booked'}
                      onClick={() => handleAction(booking.id, 'cancel')}
                      className="text-destructive hover:bg-destructive/10 border-destructive/20"
                      title="Cancel Booking"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className={`p-4 ${booking.bookingStatus !== 'booked' ? 'opacity-70' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-foreground text-lg">{booking.customerName}</div>
                <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
              </div>
              <Badge variant={booking.bookingStatus}>{booking.bookingStatus}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {booking.variantLabel && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Box size:</span>{' '}
                  <span className="font-medium">{booking.variantLabel}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Qty:</span>{' '}
                <span className="font-medium">{booking.qty}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pickup:</span>{' '}
                <span className="font-medium">
                  {new Date(booking.pickupDate).toLocaleDateString()}
                </span>
              </div>
              <div className="col-span-2 flex items-center mt-1">
                <span className="text-muted-foreground mr-2">Payment:</span>
                <Badge variant={booking.paymentStatus}>{booking.paymentStatus}</Badge>
              </div>
            </div>

            {booking.bookingStatus === 'booked' && (
              <div className="flex space-x-2 pt-3 border-t border-border">
                {booking.paymentStatus !== 'paid' && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-zm-teal border-zm-teal/20"
                    onClick={() => handleAction(booking.id, 'pay')}
                  >
                    <DollarSignIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 text-zm-success border-zm-success/20"
                  onClick={() => handleAction(booking.id, 'collect')}
                >
                  <CheckIcon className="h-4 w-4 mr-2" /> Collect
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive border-destructive/20"
                  onClick={() => handleAction(booking.id, 'cancel')}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Booking"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateBooking}
              disabled={isSubmitting || !customerName || !customerPhone || !pickupDate}
            >
              {isSubmitting ? 'Saving...' : 'Save Booking'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {formError}
            </div>
          )}

          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />

          {/* Box size selector */}
          {variantConfigs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Box Size</label>
              <div className="grid grid-cols-1 gap-2">
                {variantConfigs.map((cfg) => {
                  const piecesLeft = batch
                    ? Math.floor(batch.availablePieces / cfg.variant.pieces)
                    : 0;
                  return (
                    <label
                      key={cfg.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedVariantId === cfg.id
                          ? 'border-zm-teal bg-zm-teal/5'
                          : 'border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="variant"
                          value={cfg.id}
                          checked={selectedVariantId === cfg.id}
                          onChange={() => {
                            setSelectedVariantId(cfg.id);
                            setQuantity(1);
                          }}
                          className="accent-zm-teal"
                        />
                        <div>
                          <p className="text-sm font-medium">{cfg.variant.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {cfg.variant.pieces} pcs · max {piecesLeft} boxes
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        KWD {cfg.effectivePrice.toFixed(3)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity (boxes)"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />

            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'wamd')}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'wamd', label: 'WAMD' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'unpaid')}
              options={[
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'paid', label: 'Paid' },
              ]}
            />

            <Input
              label="Discount (KWD)"
              type="number"
              min="0"
              step="0.001"
              value={discount || ''}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Pickup date — date picker with enabled range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Pickup Date</label>
            {batch ? (
              <PickupDatePicker
                batchStartDate={batch.startDate}
                value={pickupDate}
                onChange={setPickupDate}
              />
            ) : (
              <Input
                label="Pickup Date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            )}
          </div>

          {/* Total preview */}
          {selectedConfig && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {quantity} × {selectedConfig.variant.label} @ KWD{' '}
                  {selectedConfig.effectivePrice.toFixed(3)}
                </span>
                <span className="font-semibold">
                  KWD {computedTotal.toFixed(3)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {quantity * selectedConfig.variant.pieces} pieces total
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Confirm action modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'collect', bookingId: null })}
        title={
          confirmModal.type === 'collect'
            ? 'Confirm Collection'
            : confirmModal.type === 'cancel'
            ? 'Cancel Booking'
            : 'Mark as Paid'
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setConfirmModal({ isOpen: false, type: 'collect', bookingId: null })
              }
            >
              Back
            </Button>
            <Button
              variant={confirmModal.type === 'cancel' ? 'destructive' : 'primary'}
              onClick={confirmAction}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to{' '}
          {confirmModal.type === 'collect'
            ? 'mark this booking as collected'
            : confirmModal.type === 'cancel'
            ? 'cancel this booking'
            : 'mark this booking as paid'}
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}