import type { Metadata } from 'next';
import { Clapperboard } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Prasads Visuals',
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="min-h-screen bg-background-DEFAULT flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-violet-DEFAULT/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-gradient shadow-glow-accent mb-4">
            <Clapperboard size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            <span className="gradient-text">Prasads</span>
            <span className="text-text-primary">_Visuals</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl border border-white/8 p-8 shadow-glass">
          <LoginForm error={searchParams.error} />
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          Visitors can browse freely without signing in.
          <br />
          Sign in to access personalised features.
        </p>
      </div>
    </div>
  );
}