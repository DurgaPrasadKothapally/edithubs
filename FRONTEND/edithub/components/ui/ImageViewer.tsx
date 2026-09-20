'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.25, 3));
    if (e.key === '-') setZoom(z => Math.max(z - 0.25, 0.5));
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen) setZoom(1);
  }, [isOpen, src]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${alt}`}
    >
      {/* Controls */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-10"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
          className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white hover:text-accent transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-white/60 text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
          className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white hover:text-accent transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <a
          href={src}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white hover:text-accent transition-colors"
          aria-label="Download image"
          onClick={e => e.stopPropagation()}
        >
          <Download size={16} />
        </a>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white hover:text-error transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-glass select-none"
          draggable={false}
        />
      </div>

      {/* Hint */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none">
        Press Esc to close &nbsp;·&nbsp; +/- to zoom
      </p>
    </div>
  );
}

// Clickable image thumbnail that opens the viewer
interface ImageThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageThumbnail({ src, alt, className }: ImageThumbnailProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`relative group overflow-hidden rounded-xl border border-surface-border hover:border-accent/30 transition-all ${className || ''}`}
        aria-label={`View image: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
      <ImageViewer src={src} alt={alt} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}