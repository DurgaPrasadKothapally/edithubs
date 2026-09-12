import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Package } from 'lucide-react';
import { getResources } from '@/lib/resources';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourcesFilter } from '@/components/resources/ResourcesFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FilterState } from '@/types';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Free video editing resources — presets, LUTs, templates, overlays, sound effects, fonts, project files, and PNG packs.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: Partial<FilterState> = {
    search: params.search || '',
    category: params.category || 'All',
    sortBy: (params.sort as FilterState['sortBy']) || 'newest',
  };

  const resources = await getResources(filters);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Package size={18} className="text-orange-DEFAULT" />
            <span className="text-orange-DEFAULT text-sm font-semibold uppercase tracking-wider">Free Downloads</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            Editing Resources
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Free presets, LUTs, templates, overlays, sound effects, project files, and more —
            ready to download and use in your edits.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24 bg-surface rounded-2xl animate-pulse" />}>
            <ResourcesFilter />
          </Suspense>
        </div>

        {/* Count */}
        <div className="mb-6">
          <p className="text-text-muted text-sm">
            {resources.length === 0
              ? 'No resources found'
              : `${resources.length} resource${resources.length === 1 ? '' : 's'} available`}
          </p>
        </div>

        {/* Grid */}
        {resources.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No resources found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
