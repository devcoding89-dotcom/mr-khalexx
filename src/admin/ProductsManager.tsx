import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/store/adminStore';
import { createProduct, updateProduct, deleteProduct } from '@/lib/supabase';
import type { Product, Category } from '@/types/database';

const categories: { value: Category; label: string }[] = [
  { value: 'phones', label: 'Phones' },
  { value: 'accounts', label: 'CoD Accounts' },
  { value: 'cp', label: 'CP Points' },
];

export default function ProductsManager() {
  const { products, addProduct, updateProduct: updateProductInStore, removeProduct } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'phones' as Category,
    image: '',
    stock: '',
    rating: '4.5',
    reviews: '0',
    features: '',
    badge: '',
    is_new: false,
    is_bestseller: false,
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: 'phones',
      image: '',
      stock: '',
      rating: '4.5',
      reviews: '0',
      features: '',
      badge: '',
      is_new: false,
      is_bestseller: false,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      features: product.features.join(', '),
      badge: product.badge || '',
      is_new: product.is_new || false,
      is_bestseller: product.is_bestseller || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const success = await deleteProduct(id);
    if (success) {
      removeProduct(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      badge: formData.badge || undefined,
      is_new: formData.is_new,
      is_bestseller: formData.is_bestseller,
    };

    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, productData);
      if (updated) {
        updateProductInStore(editingProduct.id, updated);
      }
    } else {
      const created = await createProduct(productData);
      if (created) {
        addProduct(created);
      }
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
            />
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="btn-primary hover:scale-105 transition-transform shadow-lg glow-gold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#0f0f14] border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-['Orbitron']">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₦)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Original Price (₦) (optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge (optional)</Label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Hot, New, Sale..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Features (comma separated)</Label>
                <Input
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5"
                  />
                  <span className="text-sm text-gray-300">Mark as New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5"
                  />
                  <span className="text-sm text-gray-300">Bestseller</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary"
                >
                  {isSubmitting ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="glass rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-white/10 to-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 stagger-fade-in">
              {filteredProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-white/5 transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                        />
                        {product.is_new && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">N</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{product.name}</p>
                        {product.badge && (
                          <Badge className="mt-1 text-xs gradient-gold text-black">{product.badge}</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm capitalize font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[#FFD700] font-bold text-sm">₦{product.price.toLocaleString()}</span>
                      {product.original_price && (
                        <span className="text-gray-500 text-xs line-through ml-2 block">₦{product.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      product.stock > 20 ? 'bg-green-500/20 text-green-400' :
                      product.stock > 10 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.is_new && (
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">NEW</Badge>
                      )}
                      {product.is_bestseller && (
                        <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-xs">BEST</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                        className="w-9 h-9 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                        className="w-9 h-9 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No products found</p>
            <p className="text-gray-600 text-sm mt-1">
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first product to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
