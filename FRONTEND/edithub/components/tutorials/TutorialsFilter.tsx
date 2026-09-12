'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn, TUTORIAL_CATEGORIES, SORT_OPTIONS } from '@/lib/utils';

export function TutorialsFilter() {
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

  const clearAll = () => {
    setSearch('');
    router.push(pathname, { scroll: false });
  };

  const hasFilters = currentSearch || currentCategory !== 'All' || currentSort !== 'newest';
  const allCategories = ['All', ...TUTORIAL_CATEGORIES];

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search tutorials, software, effects...'
            className={cn(
              'w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm',
              'placeholder:text-text-muted',
              'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50',
              'transition-colors duration-200'
            )}
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
              'bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-accent/30'
            )}
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
                  onClick={() => {
                    updateParams({ sort: opt.value });
                    setSortOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    currentSort === opt.value
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              currentCategory === cat
                ? 'bg-accent text-background-DEFAULT shadow-glow-accent'
                : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-accent/30'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Active filters:</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">
              &ldquo;{currentSearch}&rdquo;
              <button onClick={() => { setSearch(''); updateParams({ search: '' }); }}>
                <X size={10} />
              </button>
            </span>
          )}
          {currentCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-DEFAULT/10 border border-violet-DEFAULT/20 text-xs text-violet-DEFAULT">
              {currentCategory}
              <button onClick={() => updateParams({ category: 'All' })}>
                <X size={10} />
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-text-muted hover:text-error transition-colors ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
