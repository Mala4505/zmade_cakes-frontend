import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { shopApi } from '../../services/api';
import type { ShopBatch } from '../../services/api.types';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Button } from '../../components/ui/Button';
import { OrderModal } from './OrderModal';

export function Shop() {
  const [productBatches, setProductBatches] = useState<ShopBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<ShopBatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupByProduct = (data: ShopBatch[]): ShopBatch[] =>
    Object.values(
      data.reduce<Record<string, ShopBatch>>((acc, batch) => {
        const existing = acc[batch.productId];
        if (!existing || batch.availablePieces > existing.availablePieces) {
          acc[batch.productId] = batch;
        }
        return acc;
      }, {})
    );

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await shopApi.getOpenBatches();
        setProductBatches(groupByProduct(data));
      } catch (error) {
        console.error('Failed to fetch shop batches', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleCardClick = (batch: ShopBatch) => {
    if (!batch.productActive) return;
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBatch(null);
  };

  const handleOrderSuccess = async () => {
    try {
      const data = await shopApi.getOpenBatches();
      setProductBatches(groupByProduct(data));
    } catch {
      // silent refresh failure — not critical
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 px-4 bg-zm-warm rounded-3xl shadow-soft">
        <h1 className="font-heading text-5xl md:text-6xl text-zm-teal mb-4">
          Fresh from the Oven
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Artisan bakes, made with love and the finest ingredients.
          Pre-order your favorites for pickup.
        </p>
      </section>

      {/* Product grid */}
      {productBatches.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">No products available right now.</p>
          <p className="text-sm mt-2">Check back soon!</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {productBatches.map((batch) => {
            const isDisabled = !batch.productActive;
            const hasAvailability = batch.variants.some(
              (v) => v.isAvailable && v.isEnabled
            );
            const enabledVariants = batch.variants.filter((v) => v.isEnabled);
            const minPrice =
              enabledVariants.length > 0
                ? Math.min(...enabledVariants.map((v) => v.price))
                : null;

            return (
              <motion.div key={batch.id} variants={item}>
                <div
                  onClick={() => handleCardClick(batch)}
                  className={`block h-full ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Card
                    hoverable={!isDisabled}
                    className={`h-full flex flex-col overflow-hidden group transition-opacity ${
                      isDisabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-muted relative">
                      <img
                        src={
                          batch.productImage ||
                          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={batch.productName}
                        className={`h-full w-full object-cover object-center transition-transform duration-500 ${
                          !isDisabled ? 'group-hover:scale-105' : ''
                        }`}
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                          {batch.productName}
                        </h3>
                        {minPrice !== null && !isDisabled && (
                          <span className="font-semibold text-zm-teal ml-2 whitespace-nowrap">
                            from KWD {minPrice.toFixed(3)}
                          </span>
                        )}
                      </div>

                      {batch.productFlavor && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {batch.productFlavor}
                        </p>
                      )}

                      {/* Status pill */}
                      <div className="mb-3">
                        <StatusPill
                          isProductActive={batch.productActive}
                          hasAvailability={hasAvailability}
                        />
                      </div>

                      <div className="mt-auto pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          className={`w-full transition-colors ${
                            !isDisabled
                              ? 'group-hover:bg-zm-teal group-hover:text-white group-hover:border-zm-teal'
                              : 'opacity-50'
                          }`}
                          disabled={isDisabled}
                        >
                          {isDisabled
                            ? 'Unavailable'
                            : hasAvailability
                            ? 'Order Now'
                            : 'Sold Out'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedBatch && (
        <OrderModal
          batch={selectedBatch}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}