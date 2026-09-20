'use client';

import Image from 'next/image';
import { Download, FileArchive, Tag } from 'lucide-react';
import { cn, getCategoryColor, formatFileSize } from '@/lib/utils';
import { useState } from 'react';
import type { Resource } from '@/types';
import { useOtpAuth } from '@/hooks/useOtpAuth';
import { OtpModal } from '@/components/auth/OtpModal';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const [downloading, setDownloading] = useState(false);
  const { showOtpModal, requireAuth, handleOtpSuccess, handleClose } = useOtpAuth();

  const performDownload = async () => {
    setDownloading(true);
    try {
      // Trigger download via our API route which also increments the counter
      const res = await fetch(`/api/download/${resource.id}?type=resource`);
      if (res.ok) {
        const { url } = await res.json();
        const a = document.createElement('a');
        a.href = url || resource.file_url;
        a.download = resource.file_name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Fallback direct link
        window.open(resource.file_url, '_blank');
      }
    } catch {
      window.open(resource.file_url, '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const handleDownload = () => {
    requireAuth(() => performDownload());
  };

  return (
    <>
      <article
        className={cn(
          'group flex flex-col rounded-2xl overflow-hidden',
          'bg-background-card border border-surface-border shadow-card',
          'transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-card-hover',
          className
        )}
      >
        {/* Preview image */}
        <div className="relative aspect-video bg-surface overflow-hidden">
          {resource.preview_image_url ? (
            <Image
              src={resource.preview_image_url}
              alt={resource.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-background-tertiary">
              <FileArchive size={40} className="text-text-muted" />
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm',
                getCategoryColor(resource.category)
              )}
            >
              {resource.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-display font-semibold text-text-primary text-base leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
              {resource.description}
            </p>
          )}

          {/* File info */}
          <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
            <span className="flex items-center gap-1">
              <Tag size={11} />
              {resource.file_type?.toUpperCase() || 'FILE'}
            </span>
            {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
            <span className="ml-auto flex items-center gap-1">
              <Download size={11} />
              {resource.download_count.toLocaleString()}
            </span>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl',
              'text-sm font-semibold transition-all duration-200 active:scale-95',
              downloading
                ? 'bg-surface text-text-muted cursor-wait'
                : 'bg-orange-DEFAULT/10 border border-orange-DEFAULT/30 text-orange-DEFAULT hover:bg-orange-DEFAULT hover:text-white hover:shadow-glow-orange'
            )}
          >
            <Download size={15} className={downloading ? 'animate-bounce' : ''} />
            {downloading ? 'Preparing...' : '\u2B07 Download Resource'}
          </button>
        </div>
      </article>

      <OtpModal
        isOpen={showOtpModal}
        onClose={handleClose}
        onSuccess={handleOtpSuccess}
        title="Verify to Download"
        description="Enter your email to get a one-time code and start your download."
      />
    </>
  );
}
