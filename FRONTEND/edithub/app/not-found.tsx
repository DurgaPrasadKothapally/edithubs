import Link from 'next/link';
import { Clapperboard, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background-DEFAULT">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surface border border-surface-border mb-6">
          <Clapperboard size={36} className="text-text-muted" />
        </div>

        <h1 className="font-display text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-3">Page Not Found</h2>
        <p className="text-text-secondary text-base max-w-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background-DEFAULT font-semibold text-sm shadow-glow-accent hover:bg-accent-light active:scale-95 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm hover:text-text-primary hover:border-accent/30 transition-all"
          >
            Browse Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
}
