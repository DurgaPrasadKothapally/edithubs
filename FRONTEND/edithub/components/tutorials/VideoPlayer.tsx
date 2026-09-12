'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  videoType: 'youtube' | 'upload' | 'vimeo';
  thumbnailUrl?: string;
  title: string;
}

export function VideoPlayer({ videoUrl, videoType, thumbnailUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = videoType === 'youtube'
    ? getYoutubeEmbedUrl(videoUrl)
    : videoType === 'vimeo'
    ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
    : null;

  const thumbnail =
    thumbnailUrl ||
    (videoType === 'youtube' ? getYoutubeThumbnail(videoUrl) : null) ||
    '/images/placeholder-tutorial.jpg';

  if (videoType === 'upload') {
    return (
      <div className="relative w-full aspect-video bg-background-DEFAULT rounded-2xl overflow-hidden border border-surface-border">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          poster={thumbnailUrl}
          title={title}
        />
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="relative w-full aspect-video bg-surface rounded-2xl overflow-hidden flex items-center justify-center border border-surface-border">
        <p className="text-text-muted">Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-background-DEFAULT rounded-2xl overflow-hidden border border-surface-border shadow-glass">
      {!isPlaying ? (
        // Thumbnail with play button
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Play ${title}`}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-glow-accent transform group-hover:scale-110 transition-all duration-300">
              <Play size={32} className="text-white fill-white ml-2" />
            </div>
          </div>
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium text-sm">{title}</p>
          </div>
        </button>
      ) : (
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
