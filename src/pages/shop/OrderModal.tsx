import { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { PickupDatePicker } from '../../components/ui/PickupDatePicker';
import { customersApi, bookingsApi } from '../../services/api';
import type { ShopBatch, ShopVariantOption } from '../../services/api.types';
import { MinusIcon, PlusIcon, CheckIcon } from 'lucide-react';

interface OrderModalProps {
  batch: ShopBatch;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

type ModalStep = 'order' | 'confirmation';

export function OrderModal({
  batch,
  isOpen,
  onClose,
  onOrderSuccess,
}: OrderModalProps) {
  // Variants shown to customer:
  // - is_enabled=false  → hidden entirely
  // - is_enabled=true, is_available=false → greyed out "Sold Out"
  // - is_enabled=true, is_available=true  → selectable
  const visibleVariants = batch.variants.filter((v: ShopVariantOption) => v.isEnabled);
  const availableVariants = visibleVariants.filter((v: ShopVariantOption) => v.isAvailable);
  const hasAvailability = availableVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ShopVariantOption | null>(
    availableVariants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wamd'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<ModalStep>('order');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    variantLabel: string;
    qty: number;
    total: number;
    pickupDate: string;
  } | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const firstAvailable = batch.variants
        .filter((v: ShopVariantOption) => v.isEnabled && v.isAvailable)[0] || null;
      setSelectedVariant(firstAvailable);
      setQuantity(1);
      setPickupDate(null);
      setCustomerName('');
      setCustomerPhone('');
      setPaymentMethod('cash');
      setError(null);
      setStep('order');
      setConfirmedOrder(null);
    }
  }, [isOpen, batch.id]);

  const maxQty = selectedVariant
    ? Math.floor(batch.availablePieces / selectedVariant.pieces)
    : 1;

  const computedTotal = selectedVariant ? selectedVariant.price * quantity : 0;

  const handleVariantSelect = (variant: ShopVariantOption) => {
    if (!variant.isAvailable) return;
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQtyChange = (delta: number) => {
    setQuantity((prev: number) => Math.max(1, Math.min(maxQty, prev + delta)));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!selectedVariant) { setError('Please select a box size.'); return; }
    if (!pickupDate) { setError('Please select a pickup date.'); return; }
    if (!customerName.trim()) { setError('Please enter your name.'); return; }
    if (!customerPhone.trim()) { setError('Please enter your phone number.'); return; }

    setIsSubmitting(true);
    try {
      const customer = await customersApi.findOrCreateByPhone(
        customerName.trim(),
        customerPhone.trim()
      );

      await bookingsApi.create(
        { pickupDate, qty: quantity, paymentStatus: 'unpaid', discount: 0 },
        parseInt(customer.id.toString()),
        parseInt(batch.id),
        parseInt(selectedVariant.variantId)
      );

      setConfirmedOrder({
        variantLabel: selectedVariant.label,
        qty: quantity,
        total: computedTotal,
        pickupDate,
      });
      setStep('confirmation');
      onOrderSuccess();
    } catch (err: unknown) {
      const anyErr = err as any;
      const msg =
        anyErr?.response?.data?.detail ||
        String(Object.values(anyErr?.response?.data || {})[0] || '') ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Confirmation screen ──────────────────────────────
  if (step === 'confirmation' && confirmedOrder) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Order Placed!">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-zm-success-light flex items-center justify-center">
            <CheckIcon className="h-8 w-8 text-zm-success" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Thank you, {customerName}!
            </h3>
            <p className="text-muted-foreground mt-1">Your order has been placed.</p>
          </div>

          <div className="w-full bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium">{batch.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Box size</span>
              <span className="font-medium">{confirmedOrder.variantLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{confirmedOrder.qty} box(es)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup date</span>
              <span className="font-medium">
                {new Date(confirmedOrder.pickupDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-zm-teal">
                KWD {confirmedOrder.total.toFixed(3)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Payment is due at pickup.
          </p>

          <Button variant="primary" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  // ── Order form ───────────────────────────────────────
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={batch.productName}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !selectedVariant ||
              !pickupDate ||
              !customerName.trim() ||
              !customerPhone.trim() ||
              !hasAvailability
            }
          >
            {isSubmitting ? 'Placing order...' : 'Place Order'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Product image */}
        {batch.productImage && (
          <img
            src={batch.productImage}
            alt={batch.productName}
            className="w-full h-40 object-cover rounded-xl"
          />
        )}

        {batch.productFlavor && (
          <p className="text-sm text-muted-foreground">{batch.productFlavor}</p>
        )}

        {/* 1. STATUS PILL — always above pickup date */}
        <StatusPill
          isProductActive={batch.productActive}
          hasAvailability={hasAvailability}
        />

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {/* 2. Box size selection */}
        {visibleVariants.length > 0 ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Choose your box size</label>
            <div className="grid grid-cols-1 gap-2">
              {visibleVariants.map((variant: ShopVariantOption) => {
                const isSelected = selectedVariant?.variantId === variant.variantId;
                const isSoldOut = !variant.isAvailable;
                return (
                  <button
                    key={variant.variantId}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => handleVariantSelect(variant)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSoldOut
                        ? 'opacity-50 cursor-not-allowed border-border bg-muted/30'
                        : isSelected
                        ? 'border-zm-teal bg-zm-teal/5 ring-1 ring-zm-teal'
                        : 'border-border hover:border-zm-teal/50 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected && !isSoldOut ? 'border-zm-teal bg-zm-teal' : 'border-border'
                        }`}
                      >
                        {isSelected && !isSoldOut && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isSoldOut ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {variant.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {variant.pieces} pieces{isSoldOut && ' · Sold Out'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${isSoldOut ? 'text-muted-foreground' : 'text-zm-teal'}`}>
                      KWD {variant.price.toFixed(3)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No box sizes available for this batch.</p>
        )}

        {/* 3. Quantity */}
        {selectedVariant && hasAvailability && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQtyChange(-1)}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 disabled:opacity-40 transition-colors"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQtyChange(1)}
                disabled={quantity >= maxQty}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 disabled:opacity-40 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              {maxQty <= 3 && maxQty > 0 && (
                <span className="text-xs text-destructive ml-1">
                  Only {maxQty} box{maxQty !== 1 ? 'es' : ''} left
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4. PICKUP DATE — below status pill, above total */}
        {hasAvailability && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Pickup Date</label>
            <PickupDatePicker
              batchStartDate={batch.startDate}
              value={pickupDate}
              onChange={setPickupDate}
            />
          </div>
        )}

        {/* 5. Total */}
        {selectedVariant && quantity > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
            <span className="text-sm text-muted-foreground">
              {quantity} × {selectedVariant.label}
            </span>
            <span className="text-lg font-bold text-zm-teal">
              KWD {computedTotal.toFixed(3)}
            </span>
          </div>
        )}

        {/* 6. Customer info */}
        <div className="space-y-3 pt-1 border-t border-border">
          <p className="text-sm font-medium text-foreground">Your details</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Full name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name"
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zm-teal"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Phone number</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 99001234"
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zm-teal"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Payment method</label>
            <div className="flex gap-2">
              {(['cash', 'wamd'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? 'border-zm-teal bg-zm-teal/5 text-zm-teal'
                      : 'border-border text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  {method === 'wamd' ? 'WAMD' : 'Cash'}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Payment is collected at pickup.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}