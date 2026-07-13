'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { productsService } from '../../../../services';
import type { Product } from '../../../../types';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    status: 'DRAFT',
    featured: false,
  });

  const load = async () => {
    setLoading(true);
    const { data } = await productsService.list({ page: 1 });
    setProducts(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', status: 'DRAFT', featured: false });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: form.price ? Number(form.price) : undefined };
      if (editing) {
        await productsService.update(editing.id, payload as any);
        toast.success('Product updated');
      } else {
        await productsService.create(payload as any);
        toast.success('Product created');
      }
      resetForm();
      load();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const onEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price ? String(product.price) : '',
      status: product.status,
      featured: product.featured,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await productsService.remove(id);
    toast.success('Product deleted');
    load();
  };

  const onUploadImage = async (id: string, file: File) => {
    await productsService.uploadImage(id, file);
    toast.success('Image uploaded');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Products</h1>

      <form onSubmit={onSubmit} className="card-surface p-6 mb-8 space-y-4 max-w-xl">
        <p className="text-sm text-[var(--color-clay-500)]">
          {editing ? `Editing: ${editing.name}` : 'New product'}
        </p>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            {editing ? 'Save changes' : 'Create product'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="text-sm text-[var(--color-text-muted)]">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Loading…</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="card-surface p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {product.status} {product.featured && '· Featured'} · {product.images.length} image(s)
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <label className="cursor-pointer text-[var(--color-blue-300)] hover:underline">
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUploadImage(product.id, e.target.files[0])}
                  />
                </label>
                <button onClick={() => onEdit(product)} className="text-[var(--color-blue-300)] hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-[var(--color-clay-500)] hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
