import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../services/api';
import type { Batch, Product, BatchVariantConfig } from '../services/api.types';
import {
  PlusIcon,
  CalendarIcon,
  Edit2Icon,
  EyeIcon,
  XCircleIcon,
  CheckCircleIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface BatchesProps {
  onViewBookings: (batchId: string) => void;
}

export function Batches({ onViewBookings }: BatchesProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [totalPieces, setTotalPieces] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Variant config panel state
  const [configBatchId, setConfigBatchId] = useState<string | null>(null);
  const [configs, setConfigs] = useState<BatchVariantConfig[]>([]);
  const [configsLoading, setConfigsLoading] = useState(false);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'close' | 'reopen';
    batchId: string | null;
  }>({ isOpen: false, type: 'close', batchId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchesData, productsData] = await Promise.all([
          api.batches.getAll(),
          api.products.getAll(),
        ]);
        setBatches(batchesData);
        setProducts(productsData.filter((p) => p.type === 'batch' && p.isActive));
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const computedEndDate = (start: string) => {
    if (!start) return '';
    const d = new Date(start);
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const handleOpenModal = (batch?: Batch) => {
    setFormError(null);
    setShowDatePicker(false);
    if (batch) {
      setEditingBatch(batch);
      setSelectedProductId(batch.productId);
      setSelectedProduct(products.find((p) => p.id === batch.productId) || null);
      setStartDate(batch.startDate);
      setTotalPieces(batch.totalPieces);
    } else {
      setEditingBatch(null);
      const firstProduct = products[0] || null;
      setSelectedProductId(firstProduct?.id || '');
      setSelectedProduct(firstProduct);
      setStartDate('');
      setTotalPieces(0);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
    setFormError(null);
    setShowDatePicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) { setFormError('Please select a start date.'); return; }
    if (!selectedProductId) { setFormError('Please select a product.'); return; }
    if (!totalPieces || totalPieces < 1) { setFormError('Total pieces must be at least 1.'); return; }

    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editingBatch) {
        const updated = await api.batches.update(editingBatch.id, {
          startDate,
          totalPieces,
        });
        setBatches(batches.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        const created = await api.batches.create(
          { startDate, totalPieces },
          parseInt(selectedProductId)
        );
        setBatches([...batches, created]);
      }
      handleCloseModal();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to save batch.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.batchId) return;
    setIsSubmitting(true);
    try {
      if (confirmModal.type === 'close') {
        const updated = await api.batches.close(confirmModal.batchId);
        setBatches(batches.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        const updated = await api.batches.reopen(confirmModal.batchId);
        setBatches(batches.map((b) => (b.id === updated.id ? updated : b)));
      }
      setConfirmModal({ isOpen: false, type: 'close', batchId: null });
    } catch (error) {
      console.error('Failed to update batch status', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openConfigPanel = async (batchId: string) => {
    setConfigBatchId(batchId);
    setConfigsLoading(true);
    setConfigPanelOpen(true);
    try {
      const data = await api.batches.getVariantConfigs(batchId);
      setConfigs(data);
    } catch (error) {
      console.error('Failed to load variant configs', error);
    } finally {
      setConfigsLoading(false);
    }
  };

  const handleToggleConfig = async (config: BatchVariantConfig) => {
    if (!configBatchId) return;
    try {
      const updated = await api.batches.updateVariantConfig(
        configBatchId,
        config.id,
        { is_enabled: !config.isEnabled }
      );
      setConfigs(configs.map((c) => (c.id === updated.id ? updated : c)));
    } catch (error) {
      console.error('Failed to update config', error);
    }
  };

  // Past dates are disabled in the batch date picker
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">Batches</h2>
          <p className="text-muted-foreground mt-1">Manage your production runs.</p>
        </div>
        <Button className="hidden md:flex" onClick={() => handleOpenModal()}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Batch
        </Button>
      </div>

      {/* Batch cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch, index) => {
          const isFull = batch.availablePieces === 0;
          return (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="p-5 md:p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {batch.productName}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      {new Date(batch.startDate).toLocaleDateString()} —{' '}
                      {new Date(batch.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={batch.status}>{batch.status}</Badge>
                    {isFull && <Badge variant="full">Sold Out</Badge>}
                  </div>
                </div>

                {/* Piece stats */}
                <div className="grid grid-cols-4 gap-2 mb-4 bg-muted/50 p-3 rounded-lg text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-sm">{batch.totalPieces}</p>
                    <p className="text-xs text-muted-foreground">pcs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booked</p>
                    <p className="font-semibold text-sm text-zm-warning">{batch.bookedPieces}</p>
                    <p className="text-xs text-muted-foreground">pcs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Collected</p>
                    <p className="font-semibold text-sm text-zm-success">{batch.collectedPieces}</p>
                    <p className="text-xs text-muted-foreground">pcs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p
                      className={`font-semibold text-sm ${
                        batch.availablePieces === 0 ? 'text-destructive' : 'text-zm-teal'
                      }`}
                    >
                      {batch.availablePieces}
                    </p>
                    <p className="text-xs text-muted-foreground">pcs</p>
                  </div>
                </div>

                {/* Variant config chips */}
                {batch.variantConfigs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {batch.variantConfigs.map((cfg) => (
                      <span
                        key={cfg.id}
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          cfg.isEnabled
                            ? 'bg-zm-teal/10 border-zm-teal/30 text-zm-teal'
                            : 'bg-muted border-border text-muted-foreground line-through'
                        }`}
                      >
                        {cfg.variant.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex-1 mb-4">
                  <ProgressBar
                    total={batch.totalPieces}
                    booked={batch.bookedPieces}
                    collected={batch.collectedPieces}
                  />
                </div>

                <div className="flex items-center space-x-2 mt-auto pt-4 border-t border-border">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => onViewBookings(batch.id)}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Bookings
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Manage box sizes"
                    onClick={() => openConfigPanel(batch.id)}
                  >
                    <ToggleRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenModal(batch)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  {batch.status === 'active' || batch.status === 'upcoming' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 border-destructive/20"
                      onClick={() =>
                        setConfirmModal({ isOpen: true, type: 'close', batchId: batch.id })
                      }
                      title="Close Batch"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-zm-success hover:bg-zm-success-light/50 border-zm-success/20"
                      onClick={() =>
                        setConfirmModal({ isOpen: true, type: 'reopen', batchId: batch.id })
                      }
                      title="Reopen Batch"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => handleOpenModal()}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Create / Edit Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBatch ? 'Edit Batch' : 'Create Batch'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !startDate || !selectedProductId || !totalPieces}
            >
              {isSubmitting ? 'Saving...' : 'Save Batch'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {formError}
            </div>
          )}

          {/* Product selector */}
          {!editingBatch ? (
            <Select
              label="Product"
              value={selectedProductId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value) || null;
                setSelectedProductId(e.target.value);
                setSelectedProduct(prod);
              }}
              options={products.map((p) => ({ value: p.id, label: p.name }))}
            />
          ) : (
            <Input label="Product" value={editingBatch.productName} disabled />
          )}

          {/* Product info pill — auto-filled from product */}
          {selectedProduct && (
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border text-sm">
              {(selectedProduct.imageUrl || selectedProduct.image) && (
                <img
                  src={selectedProduct.imageUrl || selectedProduct.image || ''}
                  alt={selectedProduct.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-medium text-foreground">{selectedProduct.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedProduct.flavor && `${selectedProduct.flavor} · `}
                  Base price: KWD {selectedProduct.basePrice.toFixed(3)}
                </p>
              </div>
            </div>
          )}

          {/* Start date — DayPicker, past dates disabled */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <button
              type="button"
              onClick={() => setShowDatePicker((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted/30 transition-colors text-left"
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {startDate
                ? new Date(startDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Select start date'}
            </button>
            {showDatePicker && (
              <div className="border border-border rounded-lg bg-card p-2 shadow-sm">
                <DayPicker
                  mode="single"
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date.toISOString().split('T')[0]);
                      setShowDatePicker(false);
                    }
                  }}
                  disabled={isPastDate}
                  fromDate={new Date()}
                />
              </div>
            )}
            {/* Auto-computed end date */}
            {startDate && (
              <p className="text-xs text-muted-foreground">
                Batch ends:{' '}
                <span className="font-medium">
                  {new Date(computedEndDate(startDate)).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>{' '}
                (3 days after start — automatic)
              </p>
            )}
          </div>

          {/* Total pieces */}
          <Input
            label="Total Pieces Baked"
            type="number"
            min={editingBatch ? editingBatch.bookedPieces : 1}
            value={totalPieces || ''}
            onChange={(e) => setTotalPieces(parseInt(e.target.value))}
            placeholder="e.g. 240"
            required
          />
          <p className="text-xs text-muted-foreground -mt-2">
            Enter the total number of individual pieces baked (not boxes).
          </p>
        </form>
      </Modal>

      {/* Variant config panel modal */}
      <Modal
        isOpen={configPanelOpen}
        onClose={() => setConfigPanelOpen(false)}
        title="Box Size Availability"
        footer={
          <Button variant="primary" onClick={() => setConfigPanelOpen(false)}>
            Done
          </Button>
        }
      >
        {configsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zm-teal" />
          </div>
        ) : configs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No box sizes configured for this batch. Add variants to the product first.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              Toggle which box sizes customers can order from this batch.
            </p>
            {configs.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{config.variant.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {config.variant.pieces} pcs · KWD{' '}
                    {config.effectivePrice.toFixed(3)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleConfig(config)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    config.isEnabled
                      ? 'bg-zm-teal/10 text-zm-teal border border-zm-teal/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {config.isEnabled ? (
                    <ToggleRightIcon className="h-3.5 w-3.5" />
                  ) : (
                    <ToggleLeftIcon className="h-3.5 w-3.5" />
                  )}
                  {config.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Close / Reopen confirm */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'close', batchId: null })}
        title={confirmModal.type === 'close' ? 'Close Batch' : 'Reopen Batch'}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ isOpen: false, type: 'close', batchId: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmModal.type === 'close' ? 'destructive' : 'primary'}
              onClick={handleConfirmAction}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : confirmModal.type === 'close'
                ? 'Close Batch'
                : 'Reopen Batch'}
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to {confirmModal.type === 'close' ? 'close' : 'reopen'} this batch?
          {confirmModal.type === 'close' &&
            ' Customers will no longer be able to book items from it.'}
        </p>
      </Modal>
    </div>
  );
}