import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../store/cartStore';
import { Product, Batch } from '../../types';
import { Button } from '../../components/ui/Button';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { StockIndicator } from '../../components/ui/StockIndicator';
import { Select } from '../../components/ui/Select';
export function ProductDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        const prod = await api.shop.getProductDetail(id);
        setProduct(prod);
        if (prod.type === 'batch') {
          const batchStocks = await api.shop.getProductBatchStocks(prod.id);
          setBatches(batchStocks);
          if (batchStocks.length > 0) {
            setSelectedBatchId(batchStocks[0].id);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId);
  const availableQty = selectedBatch ?
    selectedBatch.availableQty :
    0;
  const handleAddToCart = async () => {
    if (!product || !selectedBatch) return;
    setIsAdding(true);
    // Simulate network delay for adding to cart
    await new Promise((resolve) => setTimeout(resolve, 400));
    addItem({
      productId: product.id,
      productName: product.name,
      batchStockId: selectedBatch.id,
      pickupDate: selectedBatch.startDate,
      quantity,
      price: product.basePrice,
      image:
      product.image ||
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
    });
    setIsAdding(false);
    // Optional: open cart drawer here or show toast
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal"></div>
      </div>);

  }
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {error || 'Product not found'}
        </h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>);

  }
  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-zm-teal mb-8 transition-colors">

        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">

          <img
            src={
            product.image ||
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
            }
            alt={product.name}
            className="w-full h-full object-cover object-center" />

        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.1
          }}
          className="flex flex-col">

          <div className="mb-6">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-zm-teal mb-4">
              KWD {product.basePrice}
            </p>
            {product.flavor &&
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Flavor: {product.flavor}
              </p>
            }
            <p className="text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 py-6 border-y border-border mb-8">
            {product.type === 'batch' ?
            <>
                {batches.length > 0 ?
              <Select
                label="Select Pickup Date"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                options={batches.map((b) => ({
                  value: b.id,
                  label: `${new Date(b.startDate).toLocaleDateString()} (Available: ${b.availableQty})`
                }))} /> :


              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
                    Currently no active batches available for this product.
                  </div>
              }

                {selectedBatch &&
              <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Availability
                    </span>
                    <StockIndicator available={availableQty} />
                  </div>
              }
              </> :

            <div className="p-4 bg-zm-warm rounded-lg text-sm text-muted-foreground">
                This is a custom order item. Please contact us for details.
              </div>
            }

            {product.type === 'batch' && selectedBatch && availableQty > 0 &&
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={availableQty} />

              </div>
            }
          </div>

          <div className="mt-auto">
            <Button
              variant="primary"
              className="w-full py-6 text-lg rounded-xl shadow-lg"
              disabled={
              product.type === 'batch' && (
              !selectedBatch || availableQty === 0 || isAdding)
              }
              onClick={handleAddToCart}>

              {isAdding ?
              <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding...
                </div> :

              <div className="flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Add to Cart — KWD {product.basePrice * quantity}
                </div>
              }
            </Button>
          </div>
        </motion.div>
      </div>
    </div>);

}