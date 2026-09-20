'use client';

import { useState, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw,
  ExternalLink
} from 'lucide-react';
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
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);

  const embedUrl = videoType === 'youtube'
    ? getYoutubeEmbedUrl(videoUrl)
    : videoType === 'vimeo'
    ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
    : null;

  const thumbnail =
    thumbnailUrl ||
    (videoType === 'youtube' ? getYoutubeThumbnail(videoUrl) : null) ||
    '/images/placeholder-tutorial.jpg';

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  };

  // ── Uploaded video (full custom player) ─────────────────────────
  if (videoType === 'upload') {
    return (
      <div
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-surface-border group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          muted={muted}
          className="w-full h-full object-contain"
          onClick={() => {
            if (videoRef.current) {
              if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
              else { videoRef.current.play(); setIsPlaying(true); }
            }
          }}
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v) return;
            setCurrentTime(v.currentTime);
            setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onEnded={() => { setIsPlaying(false); setShowControls(true); }}
        />

        {/* Big play button overlay when paused */}
        {!isPlaying && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={() => { videoRef.current?.play(); setIsPlaying(true); }}
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-glow-accent scale-100 hover:scale-110 transition-transform duration-200">
              <Play size={34} className="text-white fill-white ml-2" />
            </div>
          </button>
        )}

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 transition-opacity duration-300
            bg-gradient-to-t from-black/80 to-transparent
            ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              const t = (Number(e.target.value) / 100) * v.duration;
              v.currentTime = t;
              setProgress(Number(e.target.value));
            }}
            className="w-full h-1 accent-accent cursor-pointer mb-2"
            aria-label="Video progress"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  if (isPlaying) { v.pause(); setIsPlaying(false); }
                  else { v.play(); setIsPlaying(true); }
                }}
                className="text-white hover:text-accent transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
              </button>

              {/* Mute */}
              <button
                onClick={() => {
                  setMuted(!muted);
                  if (videoRef.current) videoRef.current.muted = !muted;
                }}
                className="text-white hover:text-accent transition-colors"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Time */}
              <span className="text-white/70 text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Restart */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="text-white hover:text-accent transition-colors"
                aria-label="Restart"
              >
                <RotateCcw size={15} />
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => videoRef.current?.requestFullscreen()}
                className="text-white hover:text-accent transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── YouTube / Vimeo (iframe with thumbnail pre-roll) ────────────
  if (!embedUrl) {
    return (
      <div className="relative w-full aspect-video bg-surface rounded-2xl overflow-hidden flex items-center justify-center border border-surface-border">
        <p className="text-text-muted">Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-surface-border shadow-glass">
      {!isPlaying ? (
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
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-glow-accent group-hover:scale-110 transition-transform duration-300">
              <Play size={34} className="text-white fill-white ml-2" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium text-sm truncate">{title}</p>
          </div>
          {/* Open in YouTube link */}
          {videoType === 'youtube' && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white text-xs transition-colors"
            >
              <ExternalLink size={12} />
              YouTube
            </a>
          )}
        </button>
      ) : (
        <iframe
          src={`${embedUrl}&autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}