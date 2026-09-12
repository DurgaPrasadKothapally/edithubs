'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Download, ChevronRight, Sparkles } from 'lucide-react';

// Animated timeline track items (simulates editing software timeline)
const TIMELINE_ITEMS = [
  { color: '#00b4d8', w: 80, label: 'Clip 01' },
  { color: '#8b5cf6', w: 120, label: 'Transition' },
  { color: '#f97316', w: 60,  label: 'Clip 02' },
  { color: '#10b981', w: 100, label: 'Audio' },
  { color: '#00b4d8', w: 90,  label: 'Clip 03' },
  { color: '#8b5cf6', w: 50,  label: 'Effect' },
  { color: '#f97316', w: 110, label: 'Clip 04' },
  { color: '#10b981', w: 70,  label: 'Music' },
  { color: '#00b4d8', w: 95,  label: 'Clip 05' },
  { color: '#8b5cf6', w: 65,  label: 'LUT' },
  { color: '#f97316', w: 85,  label: 'Clip 06' },
  { color: '#10b981', w: 55,  label: 'SFX' },
];

const STATS = [
  { value: '100+', label: 'Tutorials' },
  { value: '50+', label: 'Free Resources' },
  { value: '10K+', label: 'Downloads' },
];

const TAGS = [
  'CapCut', 'After Effects', 'Premiere Pro', 'Color Grading',
  'Transitions', 'LUTs', 'Cinematic', 'Reels',
];

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ['#00b4d8', '#8b5cf6', '#f97316', '#10b981'];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 180, 216, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-hero-gradient">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-DEFAULT/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-DEFAULT/4 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,180,216,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-10">
        <div className="flex flex-col items-center text-center">

          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/20 text-xs font-medium text-accent mb-8 animate-fade-down">
            <Sparkles size={12} className="animate-pulse" />
            New tutorials added every week
            <ChevronRight size={12} />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-up">
            <span className="gradient-text">Learn.</span>{' '}
            <span className="text-text-primary">Edit.</span>{' '}
            <span className="gradient-text-orange">Create.</span>
          </h1>

          {/* Subheading */}
          <p className="text-text-secondary text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Professional video editing tutorials, resources, presets, templates,
            and project files â€”{' '}
            <span className="text-text-primary font-medium">all in one place.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/tutorials"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light hover:shadow-glow-accent active:scale-95 transition-all duration-200"
            >
              <Play size={18} className="fill-current" />
              Explore Tutorials
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/resources"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-white/10 text-text-primary font-bold text-base hover:border-accent/30 hover:bg-accent/5 active:scale-95 transition-all duration-200"
            >
              <Download size={18} />
              Browse Resources
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 sm:gap-16 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-text-muted text-xs sm:text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Floating tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-16 animate-fade-up" style={{ animationDelay: '0.35s' }}>
            {TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/tutorials?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 text-xs rounded-full glass border border-white/8 text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Animated Timeline mockup */}
        <div className="relative animate-fade-up mx-auto max-w-4xl" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-2xl border border-white/8 overflow-hidden shadow-glass">
            {/* App header bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-background-DEFAULT/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-text-muted font-mono">Prasads Visuals Studio — Timeline</span>
              <div className="ml-auto flex items-center gap-3">
                <div className="w-16 h-1.5 rounded-full bg-accent/40" />
                <div className="w-8 h-1.5 rounded-full bg-violet-DEFAULT/40" />
              </div>
            </div>

            {/* Timeline tracks */}
            <div className="px-4 py-4 space-y-2 overflow-hidden">
              {['Video 1', 'Video 2', 'Audio', 'Effects'].map((track, trackIdx) => (
                <div key={track} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-14 shrink-0 font-mono">{track}</span>
                  <div className="flex-1 h-7 relative overflow-hidden rounded-lg bg-background-DEFAULT/60">
                    {/* Scrolling timeline clips */}
                    <div
                      className="absolute flex items-center h-full gap-1"
                      style={{
                        animation: `timeline ${15 + trackIdx * 3}s linear infinite`,
                        width: 'max-content',
                      }}
                    >
                      {[...TIMELINE_ITEMS, ...TIMELINE_ITEMS].map((item, i) => (
                        <div
                          key={i}
                          className="h-5 rounded flex items-center px-2 shrink-0"
                          style={{
                            width: item.w + (trackIdx * 10),
                            backgroundColor: item.color + '33',
                            borderLeft: `2px solid ${item.color}88`,
                          }}
                        >
                          <span className="text-[9px] font-mono truncate" style={{ color: item.color }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Playhead */}
                    {trackIdx === 0 && (
                      <div className="absolute left-1/3 top-0 bottom-0 w-[1.5px] bg-accent z-10">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/5 bg-background-DEFAULT/30">
              <div className="flex gap-2">
                {['#00b4d8', '#8b5cf6', '#f97316', '#10b981'].map((c) => (
                  <div key={c} className="w-5 h-5 rounded" style={{ backgroundColor: c + '44', border: `1px solid ${c}66` }} />
                ))}
              </div>
              <div className="h-1 flex-1 rounded-full bg-surface overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-accent-gradient" />
              </div>
              <span className="text-xs text-text-muted font-mono">00:42 / 02:15</span>
            </div>
          </div>

          {/* Glow under the mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-accent/10 blur-2xl rounded-full" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-muted">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-accent animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}


