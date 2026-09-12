'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn, RESOURCE_CATEGORIES, SORT_OPTIONS } from '@/lib/utils';

export function ResourcesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';

  const [search, setSearch] = useState(currentSearch);
  const [sortOpen, setSortOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v && v !== 'All' && v !== 'newest') {
          params.set(k, v);
        } else {
          params.delete(k);
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const timer = setTimeout(() => updateParams({ search: value }), 400);
      return () => clearTimeout(timer);
    },
    [updateParams]
  );

  const allCategories = ['All', ...RESOURCE_CATEGORIES];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search presets, LUTs, templates..."
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-colors"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">
              {SORT_OPTIONS.find((o) => o.value === currentSort)?.label || 'Newest First'}
            </span>
            <ChevronDown size={14} className={cn('transition-transform', sortOpen && 'rotate-180')} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 glass-dark border border-surface-border rounded-2xl shadow-glass overflow-hidden z-20">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { updateParams({ sort: opt.value }); setSortOpen(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    currentSort === opt.value ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              currentCategory === cat
                ? 'bg-orange-DEFAULT text-white shadow-glow-orange'
                : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-orange-DEFAULT/30'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
