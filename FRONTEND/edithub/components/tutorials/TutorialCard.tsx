import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, Download, Play, Monitor } from 'lucide-react';
import { cn, formatDate, getCategoryColor, truncate, getYoutubeThumbnail, getYoutubeVideoId } from '@/lib/utils';
import type { Tutorial } from '@/types';

interface TutorialCardProps {
  tutorial: Tutorial;
  className?: string;
}

export function TutorialCard({ tutorial, className }: TutorialCardProps) {
  const hasResources = tutorial.resources && tutorial.resources.length > 0;

  // Determine thumbnail
  let thumbnailSrc = tutorial.thumbnail_url;
  if (!thumbnailSrc && tutorial.video_url && tutorial.video_type === 'youtube') {
    thumbnailSrc = getYoutubeThumbnail(tutorial.video_url) || '/images/placeholder-tutorial.jpg';
  }
  thumbnailSrc = thumbnailSrc || '/images/placeholder-tutorial.jpg';

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'bg-background-card border border-surface-border',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:border-accent/20 hover:shadow-card-hover shadow-card',
        className
      )}
    >
      {/* Thumbnail */}
      <Link href={`/tutorials/${tutorial.slug}`} className="block relative aspect-video overflow-hidden bg-surface">
        <Image
          src={thumbnailSrc}
          alt={tutorial.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-DEFAULT/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-glow-accent transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="text-white fill-white ml-1" />
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm', getCategoryColor(tutorial.category))}>
            {tutorial.category}
          </span>
        </div>

        {/* Resource badge */}
        {hasResources && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-orange-DEFAULT/90 text-white backdrop-blur-sm">
              <Download size={10} />
              Files
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Software */}
        <div className="flex items-center gap-1.5 mb-2">
          <Monitor size={12} className="text-text-muted" />
          <span className="text-xs text-text-muted">{tutorial.software}</span>
        </div>

        {/* Title */}
        <Link href={`/tutorials/${tutorial.slug}`}>
          <h3 className="font-display font-semibold text-text-primary text-base leading-snug mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {tutorial.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {truncate(tutorial.description, 120)}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(tutorial.created_at)}
          </span>
          {tutorial.view_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {tutorial.view_count.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-accent text-background-DEFAULT text-xs font-semibold hover:bg-accent-light active:scale-95 transition-all duration-200"
          >
            <Play size={12} className="fill-current" />
            Watch Tutorial
          </Link>
          {hasResources && (
            <Link
              href={`/tutorials/${tutorial.slug}#resources`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface border border-surface-border text-text-secondary text-xs font-medium hover:text-orange-DEFAULT hover:border-orange-DEFAULT/30 active:scale-95 transition-all duration-200"
              title="Download Resources"
            >
              <Download size={12} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
