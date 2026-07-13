'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { priceListService } from '../../../../services';
import type { PriceCategory } from '../../../../types';
import { formatCzech } from '../../../../lib/format';

type DraftItem = {
  id?: string;
  length: string;
  width: string;
  thickness: string;
  pricePerM3: string;
  pricePerPiece: string;
};

type DraftCategory = {
  id?: string;
  name: string;
  items: DraftItem[];
};

const emptyItem: DraftItem = { length: '', width: '', thickness: '', pricePerM3: '', pricePerPiece: '' };

function toDraft(category: PriceCategory): DraftCategory {
  return {
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      id: item.id,
      length: String(item.length),
      width: String(item.width),
      thickness: String(item.thickness),
      pricePerM3: String(item.pricePerM3),
      pricePerPiece: String(item.pricePerPiece),
    })),
  };
}

function calcM3(item: DraftItem): number {
  const l = parseFloat(item.length) || 0;
  const w = parseFloat(item.width) || 0;
  const t = parseFloat(item.thickness) || 0;
  return (l * w * t) / 1_000_000_000;
}

export default function PriceListAdminPage() {
  const [categories, setCategories] = useState<DraftCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await priceListService.list();
      setCategories(data.map(toDraft));
    } catch {
      toast.error('Failed to load price list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = () => {
    setCategories((prev) => [...prev, { name: '', items: [{ ...emptyItem }] }]);
  };

  const updateCategoryName = (catIndex: number, name: string) => {
    setCategories((prev) => prev.map((cat, i) => (i === catIndex ? { ...cat, name } : cat)));
  };

  const addRow = (catIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) => (i === catIndex ? { ...cat, items: [...cat.items, { ...emptyItem }] } : cat)),
    );
  };

  const deleteRow = (catIndex: number, itemIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, items: cat.items.length > 1 ? cat.items.filter((_, j) => j !== itemIndex) : cat.items }
          : cat,
      ),
    );
  };

  const updateItemField = (catIndex: number, itemIndex: number, field: keyof DraftItem, value: string) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              items: cat.items.map((item, j) => (j === itemIndex ? { ...item, [field]: value } : item)),
            }
          : cat,
      ),
    );
  };

  const saveCategory = async (catIndex: number) => {
    const category = categories[catIndex];
    if (!category.name.trim()) {
      toast.error('Enter a category name');
      return;
    }
    const items = category.items.map((item) => ({
      length: Number(item.length),
      width: Number(item.width),
      thickness: Number(item.thickness),
      pricePerM3: Number(item.pricePerM3),
      pricePerPiece: Number(item.pricePerPiece),
    }));
    if (items.some((item) => Object.values(item).some((v) => Number.isNaN(v)))) {
      toast.error('Fill in every field before saving');
      return;
    }

    setSavingIndex(catIndex);
    try {
      const payload = { name: category.name.trim(), items };
      const { data } = category.id
        ? await priceListService.update(category.id, payload)
        : await priceListService.create(payload);
      setCategories((prev) => prev.map((cat, i) => (i === catIndex ? toDraft(data) : cat)));
      toast.success('Category saved');
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSavingIndex(null);
    }
  };

  const deleteCategory = async (catIndex: number) => {
    const category = categories[catIndex];
    if (!confirm(`Delete "${category.name || 'this category'}"?`)) return;

    if (category.id) {
      try {
        await priceListService.remove(category.id);
        toast.success('Category deleted');
      } catch {
        toast.error('Failed to delete category');
        return;
      }
    }
    setCategories((prev) => prev.filter((_, i) => i !== catIndex));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Price list</h1>
        <button type="button" onClick={addCategory} className="btn-primary">
          + Add category
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">No categories yet. Add one to get started.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((category, catIndex) => (
            <div key={category.id ?? `new-${catIndex}`} className="card-surface p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                  placeholder="Category name (e.g. buk pr)"
                  value={category.name}
                  onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                  className="flex-1 min-w-[200px] rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => saveCategory(catIndex)}
                  disabled={savingIndex === catIndex}
                  className="btn-primary disabled:opacity-60"
                >
                  {savingIndex === catIndex ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(catIndex)}
                  className="text-sm text-[var(--color-clay-500)] hover:underline"
                >
                  Delete category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead>
                    <tr className="text-left text-[var(--color-text-muted)] border-b border-white/10">
                      <th className="p-2 font-normal">délka</th>
                      <th className="p-2 font-normal">šířka</th>
                      <th className="p-2 font-normal">tloušťka</th>
                      <th className="p-2 font-normal">m3 (auto)</th>
                      <th className="p-2 font-normal">cena m3</th>
                      <th className="p-2 font-normal">cena ks.</th>
                      <th className="p-2 font-normal" />
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-white/5 last:border-0">
                        {(['length', 'width', 'thickness'] as const).map((field) => (
                          <td key={field} className="p-2">
                            <input
                              type="number"
                              step="any"
                              value={item[field]}
                              onChange={(e) => updateItemField(catIndex, itemIndex, field, e.target.value)}
                              className="w-24 rounded-md bg-[var(--color-ink-700)] border border-white/10 px-2 py-1.5 text-sm"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-[var(--color-text-muted)]">{formatCzech(calcM3(item), 4)}</td>
                        {(['pricePerM3', 'pricePerPiece'] as const).map((field) => (
                          <td key={field} className="p-2">
                            <input
                              type="number"
                              step="any"
                              value={item[field]}
                              onChange={(e) => updateItemField(catIndex, itemIndex, field, e.target.value)}
                              className="w-24 rounded-md bg-[var(--color-ink-700)] border border-white/10 px-2 py-1.5 text-sm"
                            />
                          </td>
                        ))}
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => deleteRow(catIndex, itemIndex)}
                            aria-label="Delete row"
                            title="Delete row"
                            className="text-[var(--color-clay-500)] hover:text-[var(--color-clay-300)]"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addRow(catIndex)}
                className="mt-3 text-sm text-[var(--color-blue-300)] hover:underline"
              >
                + Add row
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
