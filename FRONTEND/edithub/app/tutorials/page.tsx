import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import { getTutorials } from '@/lib/tutorials';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { TutorialsFilter } from '@/components/tutorials/TutorialsFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import type { FilterState } from '@/types';

export const metadata: Metadata = {
  title: 'Tutorials',
  description: 'Browse all video editing tutorials — CapCut, After Effects, Premiere Pro, color grading, transitions, and more.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}

export default async function TutorialsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: Partial<FilterState> = {
    search: params.search || '',
    category: params.category || 'All',
    sortBy: (params.sort as FilterState['sortBy']) || 'newest',
  };

  const tutorials = await getTutorials(filters);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-accent" />
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">All Tutorials</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            Video Editing Tutorials
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Step-by-step guides for every skill level. Learn CapCut, After Effects, Premiere Pro,
            color grading, cinematic editing, and much more.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24 bg-surface rounded-2xl animate-pulse" />}>
            <TutorialsFilter />
          </Suspense>
        </div>

        {/* Result count */}
        <div className="mb-6">
          <p className="text-text-muted text-sm">
            {tutorials.length === 0
              ? 'No tutorials found'
              : `${tutorials.length} tutorial${tutorials.length === 1 ? '' : 's'} found`}
          </p>
        </div>

        {/* Tutorial grid */}
        {tutorials.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No tutorials found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
