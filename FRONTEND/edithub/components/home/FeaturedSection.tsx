import Link from 'next/link';
import { ArrowRight, BookOpen, Package, Download } from 'lucide-react';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { ResourceCard } from '@/components/resources/ResourceCard';
import type { Tutorial, Resource } from '@/types';

interface FeaturedSectionProps {
  tutorials: Tutorial[];
  resources: Resource[];
}

export function FeaturedSection({ tutorials, resources }: FeaturedSectionProps) {
  return (
    <>
      {/* Featured Tutorials */}
      {tutorials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-accent" />
                <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                  Latest Tutorials
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                Start Learning Today
              </h2>
              <p className="text-text-secondary mt-2 max-w-xl">
                Step-by-step video tutorials for every skill level — from beginner to pro.
              </p>
            </div>
            <Link
              href="/tutorials"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors group"
            >
              View all tutorials
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all text-sm font-medium"
            >
              View all tutorials
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* Categories strip */}
      <section className="py-12 px-4 sm:px-6 border-y border-surface-border bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-text-muted text-sm mb-6 uppercase tracking-widest">Browse by Category</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'CapCut Editing', 'After Effects', 'Adobe Premiere Pro',
              'Color Grading', 'Cinematic Editing', 'Transitions',
              'Mobile Editing', 'Reels Editing', 'YouTube Editing',
            ].map((cat) => (
              <Link
                key={cat}
                href={`/tutorials?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-xl glass border border-white/8 text-sm text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {resources.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package size={18} className="text-orange-DEFAULT" />
                <span className="text-orange-DEFAULT text-sm font-semibold uppercase tracking-wider">
                  Free Resources
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                Download & Create
              </h2>
              <p className="text-text-secondary mt-2 max-w-xl">
                Free presets, LUTs, templates, overlays, and project files to level up your edits.
              </p>
            </div>
            <Link
              href="/resources"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-orange-DEFAULT hover:text-orange-light transition-colors group"
            >
              View all resources
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-border text-text-secondary hover:text-text-primary hover:border-orange-DEFAULT/30 transition-all text-sm font-medium"
            >
              View all resources
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-accent/20 glass p-10 sm:p-16 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-violet-DEFAULT/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-accent/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-text-primary mb-4">
                Ready to{' '}
                <span className="gradient-text">Level Up</span>{' '}
                your edits?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                Explore all tutorials, download free resources, and start creating cinematic content today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/tutorials"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-95 transition-all duration-200"
                >
                  Explore All Tutorials
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-text-primary font-semibold text-base hover:border-orange-DEFAULT/40 hover:text-orange-DEFAULT active:scale-95 transition-all duration-200"
                >
                  Free Downloads
                  <Download size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


