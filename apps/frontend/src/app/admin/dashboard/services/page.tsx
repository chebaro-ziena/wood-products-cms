'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { servicesService } from '../../../../services';
import type { Service } from '../../../../types';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await servicesService.list();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '' });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await servicesService.update(editing.id, form);
        toast.success('Service updated');
      } else {
        await servicesService.create(form);
        toast.success('Service created');
      }
      resetForm();
      load();
    } catch {
      toast.error('Failed to save service');
    }
  };

  const onEdit = (service: Service) => {
    setEditing(service);
    setForm({ title: service.title, description: service.description });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await servicesService.remove(id);
    toast.success('Service deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Services</h1>

      <form onSubmit={onSubmit} className="card-surface p-6 mb-8 space-y-4 max-w-xl">
        <p className="text-sm text-[var(--color-clay-500)]">
          {editing ? `Editing: ${editing.title}` : 'New service'}
        </p>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          required
          className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
        />
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            {editing ? 'Save changes' : 'Create service'}
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
          {services.map((service) => (
            <div key={service.id} className="card-surface p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{service.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{service.description}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button onClick={() => onEdit(service)} className="text-[var(--color-blue-300)] hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(service.id)}
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
