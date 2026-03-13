import React, { useEffect, useState, Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { StockIndicator } from '../../components/ui/StockIndicator';
import { Button } from '../../components/ui/Button';
export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'batch' | 'custom'>('all');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.shop.getActiveProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filteredProducts = products.filter((p) =>
  filter === 'all' ? true : p.type === filter
  );
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zm-teal"></div>
      </div>);

  }
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-zm-warm rounded-3xl shadow-soft">
        <h1 className="font-heading text-5xl md:text-6xl text-zm-teal mb-4">
          Fresh from the Oven
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Artisan breads and pastries, baked with love and the finest
          ingredients. Pre-order your favorites for pickup.
        </p>
      </section>

      {/* Filters */}
      <div className="flex justify-center space-x-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          onClick={() => setFilter('all')}
          className="rounded-full">

          All Items
        </Button>
        <Button
          variant={filter === 'batch' ? 'primary' : 'outline'}
          onClick={() => setFilter('batch')}
          className="rounded-full">

          Daily Bakes
        </Button>
        <Button
          variant={filter === 'custom' ? 'primary' : 'outline'}
          onClick={() => setFilter('custom')}
          className="rounded-full">

          Custom Orders
        </Button>
      </div>

      {/* Product Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {filteredProducts.map((product) =>
        <motion.div key={product.id} variants={item}>
            <Link to={`/shop/product/${product.id}`} className="block h-full">
              <Card
              hoverable
              className="h-full flex flex-col overflow-hidden group">

                <div className="aspect-square w-full overflow-hidden bg-muted relative">
                  <img
                  src={
                  product.image ||
                  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />

                  {/* Mock stock indicator for grid view - assuming 10 available for display */}
                  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                    <StockIndicator available={10} />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="font-semibold text-zm-teal ml-2">
                      KWD {product.basePrice}
                    </span>
                  </div>
                  {product.flavor &&
                <p className="text-sm text-muted-foreground mb-4">
                      {product.flavor}
                    </p>
                }
                  <div className="mt-auto pt-4 border-t border-border">
                    <Button
                    variant="outline"
                    className="w-full group-hover:bg-zm-teal group-hover:text-white group-hover:border-zm-teal transition-colors">

                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {filteredProducts.length === 0 &&
      <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">No products found in this category.</p>
        </div>
      }
    </div>);

}