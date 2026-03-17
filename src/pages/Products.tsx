import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { ImagePicker } from '../components/ui/ImagePicker';
import { api } from '../services/api';
import type { Product, ProductVariant, CreateVariantPayload } from '../services/api.types';
import { PlusIcon, Edit2Icon, SearchIcon, TrashIcon, AlertCircleIcon } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: 'batch',
    basePrice: 0,
    flavor: '',
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Variant state
  const [variantForm, setVariantForm] = useState<{
    pieces: string;
    label: string;
    price: string;
  }>({ pieces: '', label: '', price: '' });
  const [addingVariant, setAddingVariant] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [variantSubmitting, setVariantSubmitting] = useState(false);

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
    setFormError(null);
    setImageFile(undefined);
    setAddingVariant(false);
    setVariantError(null);
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
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(undefined);
    setAddingVariant(false);
    setVariantError(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editingProduct) {
        const updated = await api.products.update(editingProduct.id, formData, imageFile);
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.products.create(formData, imageFile);
        setProducts([...products, created]);
      }
      handleCloseModal();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to save product.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updated = await api.products.toggleActive(id);
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    } catch (error) {
      console.error('Failed to toggle product', error);
    }
  };

  // ── Variant handlers ─────────────────────────────────

  const handleToggleVariant = async (product: Product, variant: ProductVariant) => {
    try {
      const updated = await api.products.updateVariant(product.id, variant.id, {
        is_active: !variant.isActive,
      });
      setProducts(
        products.map((p) =>
          p.id === product.id
            ? { ...p, variants: p.variants.map((v) => (v.id === updated.id ? updated : v)) }
            : p
        )
      );
      if (editingProduct?.id === product.id) {
        setEditingProduct((prev) =>
          prev
            ? { ...prev, variants: prev.variants.map((v) => (v.id === updated.id ? updated : v)) }
            : prev
        );
      }
    } catch (error) {
      console.error('Failed to toggle variant', error);
    }
  };

  const handleDeleteVariant = async (product: Product, variantId: string) => {
    if (!window.confirm('Delete this box size? This cannot be undone.')) return;
    try {
      await api.products.deleteVariant(product.id, variantId);
      const updatedVariants = product.variants.filter((v) => v.id !== variantId);
      setProducts(
        products.map((p) => (p.id === product.id ? { ...p, variants: updatedVariants } : p))
      );
      if (editingProduct?.id === product.id) {
        setEditingProduct((prev) =>
          prev ? { ...prev, variants: updatedVariants } : prev
        );
      }
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Cannot delete this variant.';
      setVariantError(msg);
    }
  };

  const handleAddVariant = async () => {
    if (!editingProduct) return;
    setVariantError(null);
    if (!variantForm.pieces || !variantForm.label || !variantForm.price) {
      setVariantError('All variant fields are required.');
      return;
    }
    setVariantSubmitting(true);
    try {
      const payload: CreateVariantPayload = {
        pieces: parseInt(variantForm.pieces),
        label: variantForm.label,
        price: parseFloat(variantForm.price).toFixed(3),
        is_active: true,
        sort_order: parseInt(variantForm.pieces),
      };
      const newVariant = await api.products.createVariant(editingProduct.id, payload);
      const updatedVariants = [...editingProduct.variants, newVariant];
      setEditingProduct({ ...editingProduct, variants: updatedVariants });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, variants: updatedVariants } : p
        )
      );
      setVariantForm({ pieces: '', label: '', price: '' });
      setAddingVariant(false);
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to add box size.';
      setVariantError(msg);
    } finally {
      setVariantSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">Products</h2>
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

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Box Sizes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(product.imageUrl || product.image) && (
                        <img
                          src={product.imageUrl || product.image || ''}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                      )}
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {product.flavor || product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.type}</td>
                  <td className="px-6 py-4 font-medium">KWD {product.basePrice.toFixed(3)}</td>
                  <td className="px-6 py-4">
                    {product.type === 'batch' ? (
                      product.variants.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((v) => (
                            <span
                              key={v.id}
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                v.isActive
                                  ? 'bg-zm-teal/10 border-zm-teal/30 text-zm-teal'
                                  : 'bg-muted border-border text-muted-foreground line-through'
                              }`}
                            >
                              {v.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircleIcon className="h-3 w-3" /> No box sizes
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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

      {/* Product Modal */}
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
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {formError}
            </div>
          )}

          {/* Product Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Product Image</label>
            <ImagePicker
              currentImageUrl={editingProduct?.imageUrl || editingProduct?.image}
              onImageSelected={(file) => setImageFile(file)}
              onImageRemoved={() => setImageFile(undefined)}
            />
          </div>

          <Input
            label="Product Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Brownies"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={formData.type || 'batch'}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'batch' | 'custom' })
              }
              options={[
                { value: 'batch', label: 'Batch' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
            <Input
              label="Base Price (KWD)"
              type="number"
              min="0"
              step="0.001"
              value={formData.basePrice || ''}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
              }
              required
            />
          </div>

          <Input
            label="Flavor (Optional)"
            value={formData.flavor || ''}
            onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
            placeholder="e.g. Classic Chocolate"
          />

          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zm-teal focus:border-transparent min-h-[80px]"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
            />
          </div>

          <div className="pt-2">
            <Toggle
              checked={formData.isActive ?? true}
              onChange={(checked) => setFormData({ ...formData, isActive: checked })}
              label="Active (Visible in shop)"
            />
          </div>

          {/* Box Sizes — only for batch products being edited */}
          {formData.type === 'batch' && editingProduct && (
            <div className="pt-2 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Box Sizes</h4>
                {!addingVariant && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAddingVariant(true);
                      setVariantError(null);
                    }}
                  >
                    <PlusIcon className="h-3 w-3 mr-1" /> Add Box Size
                  </Button>
                )}
              </div>

              {editingProduct.variants.length === 0 && !addingVariant && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg">
                  <AlertCircleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  No box sizes yet. This product won't appear in the shop until at least one is added.
                </div>
              )}

              {variantError && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                  {variantError}
                </div>
              )}

              {/* Variant rows */}
              {editingProduct.variants.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Label</th>
                        <th className="px-3 py-2 text-left font-medium">Pcs</th>
                        <th className="px-3 py-2 text-left font-medium">Price</th>
                        <th className="px-3 py-2 text-center font-medium">Active</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {editingProduct.variants.map((v) => (
                        <tr key={v.id} className="bg-card">
                          <td className="px-3 py-2">{v.label}</td>
                          <td className="px-3 py-2">{v.pieces}</td>
                          <td className="px-3 py-2">KWD {v.price.toFixed(3)}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleVariant(editingProduct, v)}
                              className={`w-8 h-4 rounded-full transition-colors relative ${
                                v.isActive ? 'bg-zm-teal' : 'bg-border'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                                  v.isActive ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(editingProduct, v.id)}
                              className="text-destructive/60 hover:text-destructive transition-colors"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add variant inline form */}
              {addingVariant && (
                <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-3">
                  <p className="text-xs font-medium text-foreground">New Box Size</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Pieces</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="12"
                        value={variantForm.pieces}
                        onChange={(e) =>
                          setVariantForm({ ...variantForm, pieces: e.target.value })
                        }
                        className="px-2 py-1.5 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-zm-teal"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Label</label>
                      <input
                        type="text"
                        placeholder="12 pcs box"
                        value={variantForm.label}
                        onChange={(e) =>
                          setVariantForm({ ...variantForm, label: e.target.value })
                        }
                        className="px-2 py-1.5 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-zm-teal"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Price (KWD)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        placeholder="4.500"
                        value={variantForm.price}
                        onChange={(e) =>
                          setVariantForm({ ...variantForm, price: e.target.value })
                        }
                        className="px-2 py-1.5 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-zm-teal"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={handleAddVariant}
                      disabled={variantSubmitting}
                    >
                      {variantSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingVariant(false);
                        setVariantForm({ pieces: '', label: '', price: '' });
                        setVariantError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Note: Box sizes can only be added after the product is saved. Save first,
                then reopen to add box sizes.
              </p>
            </div>
          )}

          {formData.type === 'batch' && !editingProduct && (
            <p className="text-xs text-muted-foreground pt-1 border-t border-border">
              💡 After saving, reopen this product to add box sizes (3pc, 6pc, 12pc etc.)
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}