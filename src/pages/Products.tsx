import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { api } from '../services/api';
import type { Product } from '../types';
import { PlusIcon, Edit2Icon, SearchIcon } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: 'batch',
    basePrice: 0,
    flavor: '',
    description: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        type: 'batch',
        basePrice: 0,
        flavor: '',
        description: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const updated = await api.products.update(
          editingProduct.id,
          formData
        );
        setProducts(products.map((p) => p.id === updated.id ? updated : p));
      } else {
        const created = await api.products.create(formData);
        setProducts([...products, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updated = await api.products.toggleActive(id);
      setProducts(products.map((p) => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error('Failed to toggle product', error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
            Products
          </h2>
          <p className="text-muted-foreground mt-1">Manage your catalog.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zm-teal text-sm"
            />
          </div>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {product.flavor || product.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.type}</td>
                  <td className="px-6 py-4 font-medium">
                    KWD {product.basePrice}
                  </td>
                  <td className="px-6 py-4">
                    <Toggle
                      checked={product.isActive}
                      onChange={() => handleToggleActive(product.id)}
                      label={product.isActive ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenModal(product)}
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.basePrice}
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
            }
            placeholder="e.g. Sourdough Boule"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={formData.type || 'batch'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'batch' | 'custom'
                })
              }
              options={[
                { value: 'batch', label: 'Batch' },
                { value: 'custom', label: 'Custom' }
              ]}
            />

            <Input
              label="Base Price (KWD )"
              type="number"
              min="0"
              step="0.01"
              value={formData.basePrice || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basePrice: parseFloat(e.target.value)
                })
              }
              required
            />
          </div>

          <Input
            label="Flavor (Optional)"
            value={formData.flavor || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                flavor: e.target.value
              })
            }
            placeholder="e.g. Classic, Cinnamon"
          />

          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zm-teal focus:border-transparent min-h-[100px]"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              placeholder="Product description..."
            />
          </div>

          <div className="pt-2">
            <Toggle
              checked={formData.isActive ?? true}
              onChange={(checked) =>
                setFormData({
                  ...formData,
                  isActive: checked
                })
              }
              label="Active (Visible in shop)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
