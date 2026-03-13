import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../services/api';
import type { Batch, Product } from '../types';
import {
  PlusIcon,
  CalendarIcon,
  Edit2Icon,
  EyeIcon,
  XCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
interface BatchesProps {
  onViewBookings: (batchId: string) => void;
}
export function Batches({ onViewBookings }: BatchesProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState<Partial<Batch>>({
    productName: '',
    startDate: '',
    endDate: '',
    totalQty: 0,
    pricePerUnit: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'close' | 'reopen';
    batchId: string | null;
  }>({
    isOpen: false,
    type: 'close',
    batchId: null
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchesData, productsData] = await Promise.all([
          api.batches.getAll(),
          api.products.getAll()
        ]);
        setBatches(batchesData);
        setProducts(
          productsData.filter((p) => p.type === 'batch' && p.isActive)
        );
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData(batch);
    } else {
      setEditingBatch(null);
      setFormData({
        productName: products.length > 0 ? products[0].name : '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).
        toISOString().
        split('T')[0],
        totalQty: 50,
        pricePerUnit: products.length > 0 ? products[0].basePrice : 0
      });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBatch) {
        const updated = await api.batches.update(editingBatch.id, formData);
        setBatches(batches.map((b) => b.id === updated.id ? updated : b));
      } else {
        // Find the selected product to get its ID
        const selectedProduct = products.find(p => p.name === formData.productName);
        if (!selectedProduct) {
          throw new Error('Product not found');
        }
        const created = await api.batches.create(formData, parseInt(selectedProduct.id));
        setBatches([...batches, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save batch', error);
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
        setBatches(batches.map((b) => b.id === updated.id ? updated : b));
      } else {
        const updated = await api.batches.reopen(confirmModal.batchId);
        setBatches(batches.map((b) => b.id === updated.id ? updated : b));
      }
      setConfirmModal({
        isOpen: false,
        type: 'close',
        batchId: null
      });
    } catch (error) {
      console.error('Failed to update batch status', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal"></div>
      </div>);

  }
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Batches
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your production runs.
          </p>
        </div>
        <Button className="hidden md:flex" onClick={() => handleOpenModal()}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch, index) => {
          const available = batch.totalQty - batch.bookedQty;
          const isFull = available === 0;
          return (
            <motion.div
              key={batch.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.4
              }}>

              <Card className="p-5 md:p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {batch.productName}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      {new Date(batch.startDate).toLocaleDateString()} -{' '}
                      {new Date(batch.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={batch.status}>{batch.status}</Badge>
                    {isFull && <Badge variant="full">Sold Out</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6 bg-muted/50 p-3 rounded-lg text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">{batch.totalQty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booked</p>
                    <p className="font-semibold text-zm-warning">
                      {batch.bookedQty}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Collected</p>
                    <p className="font-semibold text-zm-success">
                      {batch.collectedQty}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p
                      className={`font-semibold ${available === 0 ? 'text-destructive' : 'text-zm-teal'}`}>

                      {available}
                    </p>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <ProgressBar
                    total={batch.totalQty}
                    booked={batch.bookedQty}
                    collected={batch.collectedQty} />

                </div>

                <div className="flex items-center space-x-3 mt-auto pt-4 border-t border-border">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => onViewBookings(batch.id)}>

                    <EyeIcon className="h-4 w-4 mr-2" />
                    Bookings
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenModal(batch)}>

                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  {batch.status === 'active' || batch.status === 'upcoming' ?
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 border-destructive/20"
                    onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      type: 'close',
                      batchId: batch.id
                    })
                    }
                    title="Close Batch">

                      <XCircleIcon className="h-4 w-4" />
                    </Button> :

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-zm-success hover:bg-zm-success-light/50 border-zm-success/20"
                    onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      type: 'reopen',
                      batchId: batch.id
                    })
                    }
                    title="Reopen Batch">

                      <CheckCircleIcon className="h-4 w-4" />
                    </Button>
                  }
                </div>
              </Card>
            </motion.div>);

        })}
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => handleOpenModal()}>

          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBatch ? 'Edit Batch Stock' : 'Create Batch'}
        footer={
        <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
            isSubmitting || !formData.productName || !formData.totalQty
            }>

              {isSubmitting ? 'Saving...' : 'Save Batch'}
            </Button>
          </>
        }>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingBatch ?
          <Select
            label="Product"
            value={formData.productName || ''}
            onChange={(e) => {
              const prod = products.find((p) => p.name === e.target.value);
              setFormData({
                ...formData,
                productName: e.target.value,
                pricePerUnit: prod ? prod.basePrice : 0
              });
            }}
            options={products.map((p) => ({
              value: p.name,
              label: p.name
            }))} /> :


          <Input
            label="Product"
            value={formData.productName || ''}
            disabled />

          }

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value
              })
              }
              required />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate || ''}
              onChange={(e) =>
              setFormData({
                ...formData,
                endDate: e.target.value
              })
              }
              required />

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Quantity"
              type="number"
              min={editingBatch ? editingBatch.bookedQty : 1}
              value={formData.totalQty || ''}
              onChange={(e) =>
              setFormData({
                ...formData,
                totalQty: parseInt(e.target.value)
              })
              }
              required />

            <Input
              label="Price Per Unit (KWD )"
              type="number"
              min="0"
              value={formData.pricePerUnit || ''}
              onChange={(e) =>
              setFormData({
                ...formData,
                pricePerUnit: parseFloat(e.target.value)
              })
              }
              required />

          </div>
        </form>
      </Modal>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() =>
        setConfirmModal({
          isOpen: false,
          type: 'close',
          batchId: null
        })
        }
        title={confirmModal.type === 'close' ? 'Close Batch' : 'Reopen Batch'}
        footer={
        <>
            <Button
            variant="ghost"
            onClick={() =>
            setConfirmModal({
              isOpen: false,
              type: 'close',
              batchId: null
            })
            }>

              Cancel
            </Button>
            <Button
            variant={
            confirmModal.type === 'close' ? 'destructive' : 'primary'
            }
            onClick={handleConfirmAction}
            disabled={isSubmitting}>

              {isSubmitting ?
            'Processing...' :
            confirmModal.type === 'close' ?
            'Close Batch' :
            'Reopen Batch'}
            </Button>
          </>
        }>

        <p className="text-muted-foreground">
          Are you sure you want to{' '}
          {confirmModal.type === 'close' ? 'close' : 'reopen'} this batch?
          {confirmModal.type === 'close' &&
          ' Customers will no longer be able to book items from it.'}
        </p>
      </Modal>
    </div>);

}