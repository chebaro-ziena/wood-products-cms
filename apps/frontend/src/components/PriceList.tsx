'use client';

import { useState } from 'react';
import { PriceCategory } from '../types';
import { formatCzech } from '../lib/format';

const PAGE_SIZE = 2;

export function PriceList({ categories }: { categories: PriceCategory[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const visible = categories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (delta: number) => setPage((p) => (p + delta + pageCount) % pageCount);

  return (
    <section>
      <h2 className="font-title font-bold uppercase text-4xl sm:text-5xl tracking-wider text-white mb-10 md:mb-14">
        Price list
      </h2>

      {categories.length === 0 ? (
        <div className="rounded-[2rem] bg-[#E0E0E0] text-[#1C0D07] p-10 text-center">
          Price list will appear here once added in the CMS.
        </div>
      ) : (
        <div className="relative px-8 md:px-14">
          {pageCount > 1 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 text-[var(--color-blue-300)] hover:text-white transition-colors"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="space-y-6 md:space-y-8">
            {visible.map((category) => (
              <div key={category.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Dimensions card */}
                <div className="rounded-[2rem] bg-[#E0E0E0] text-[#1C0D07] overflow-hidden">
                  <table className="w-full text-sm md:text-base">
                    <thead className="border-b border-black/15">
                      <tr>
                        <th className="w-0" />
                        <th className="text-left font-semibold px-4 py-4">délka</th>
                        <th className="text-left font-semibold px-4 py-4">šířka</th>
                        <th className="text-left font-semibold px-4 py-4">tloušťka</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {category.items.map((item, i) => (
                        <tr key={item.id}>
                          {i === 0 && (
                            <td
                              rowSpan={category.items.length}
                              className="align-top font-semibold px-4 py-4 whitespace-nowrap"
                            >
                              {category.name}
                            </td>
                          )}
                          <td className="px-4 py-3">{formatCzech(Number(item.length), 0)}</td>
                          <td className="px-4 py-3">{formatCzech(Number(item.width), 0)}</td>
                          <td className="px-4 py-3">{formatCzech(Number(item.thickness), 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pricing card */}
                <div className="rounded-[2rem] bg-[#E0E0E0] text-[#1C0D07] overflow-hidden">
                  <table className="w-full text-sm md:text-base">
                    <thead className="border-b border-black/15">
                      <tr>
                        <th className="text-left font-semibold px-4 py-4">m3</th>
                        <th className="text-left font-semibold px-4 py-4">cena m3</th>
                        <th className="text-left font-bold px-4 py-4 bg-[#E49975] rounded-tr-[2rem]">
                          cena ks.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {category.items.map((item, i) => {
                        const isLast = i === category.items.length - 1;
                        return (
                          <tr key={item.id}>
                            <td className="px-4 py-3">{formatCzech(item.m3, 4)}</td>
                            <td className="px-4 py-3">{formatCzech(Number(item.pricePerM3), 0)}</td>
                            <td
                              className={`px-4 py-3 font-bold bg-[#E49975] ${isLast ? 'rounded-br-[2rem]' : ''}`}
                            >
                              {formatCzech(Number(item.pricePerPiece), 2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 text-[var(--color-blue-300)] hover:text-white transition-colors"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
