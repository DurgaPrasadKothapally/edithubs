import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar, Eye, Monitor, ArrowLeft, Package, Tag
} from 'lucide-react';
import { getTutorialBySlug, getRelatedTutorials } from '@/lib/tutorials';
import { VideoPlayer } from '@/components/tutorials/VideoPlayer';
import { DownloadResourceItem } from '@/components/tutorials/DownloadResourceItem';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) return { title: 'Tutorial Not Found' };
  return {
    title: tutorial.title,
    description: tutorial.description,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      images: tutorial.thumbnail_url ? [tutorial.thumbnail_url] : [],
    },
  };
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) notFound();

  const related = await getRelatedTutorials(tutorial.id, tutorial.category, 4);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back nav */}
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Tutorials
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video player */}
            {tutorial.video_url ? (
              <VideoPlayer
                videoUrl={tutorial.video_url}
                videoType={tutorial.video_type}
                thumbnailUrl={tutorial.thumbnail_url}
                title={tutorial.title}
              />
            ) : tutorial.thumbnail_url ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-surface-border">
                <Image
                  src={tutorial.thumbnail_url}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {/* Title + meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', getCategoryColor(tutorial.category))}>
                  {tutorial.category}
                </span>
                {tutorial.tags?.map((tag) => (
                  <Badge key={tag} label={tag} />
                ))}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-4 leading-tight">
                {tutorial.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Monitor size={14} />
                  {tutorial.software}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(tutorial.created_at)}
                </span>
                {tutorial.view_count > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {tutorial.view_count.toLocaleString()} views
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose-dark">
              <h2 className="font-display text-lg font-semibold text-text-primary mb-3">About this Tutorial</h2>
              <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {tutorial.description}
              </div>
            </div>

            {/* Downloadable Resources */}
            {tutorial.resources && tutorial.resources.length > 0 && (
              <section id="resources" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-5">
                  <Package size={18} className="text-orange-DEFAULT" />
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    Resources Included
                  </h2>
                  <span className="ml-auto text-xs text-text-muted bg-surface border border-surface-border px-2.5 py-1 rounded-full">
                    {tutorial.resources.length} file{tutorial.resources.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3">
                  {tutorial.resources.map((resource) => (
                    <DownloadResourceItem key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <aside className="space-y-6">
            {/* Quick info card */}
            <div className="glass rounded-2xl border border-white/8 p-5 space-y-4">
              <h3 className="font-display font-semibold text-text-primary">Tutorial Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-surface-border">
                  <span className="text-text-muted">Category</span>
                  <span className="text-text-secondary font-medium">{tutorial.category}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-border">
                  <span className="text-text-muted">Software</span>
                  <span className="text-text-secondary font-medium">{tutorial.software}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-border">
                  <span className="text-text-muted">Published</span>
                  <span className="text-text-secondary">{formatDate(tutorial.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Resources</span>
                  <span className="text-text-secondary">
                    {tutorial.resources?.length || 0} file{(tutorial.resources?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {tutorial.resources && tutorial.resources.length > 0 && (
                <a
                  href="#resources"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-DEFAULT/10 border border-orange-DEFAULT/30 text-orange-DEFAULT text-sm font-semibold hover:bg-orange-DEFAULT hover:text-white transition-all duration-200"
                >
                  <Package size={15} />
                  Download Resources
                </a>
              )}
            </div>

            {/* Tags */}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <div className="glass rounded-2xl border border-white/8 p-5">
                <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-text-muted" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tutorials?search=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-full bg-surface border border-surface-border text-xs text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More in category */}
            <div className="glass rounded-2xl border border-white/8 p-5">
              <h3 className="font-display font-semibold text-text-primary mb-2">More in {tutorial.category}</h3>
              <Link
                href={`/tutorials?category=${encodeURIComponent(tutorial.category)}`}
                className="text-xs text-accent hover:text-accent-light transition-colors"
              >
                Browse all →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related tutorials */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
              Related Tutorials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((t) => (
                <TutorialCard key={t.id} tutorial={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
