import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Clapperboard, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login — Prasads Visuals',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background-DEFAULT flex items-center justify-center px-4">
      {/* Background glows */}
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
            <span className="gradient-text">Edit</span>Hub
          </h1>
          <p className="text-text-muted text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl border border-white/8 p-8 shadow-glass">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-accent" />
            <h2 className="font-display text-xl font-bold text-text-primary">Sign In</h2>
          </div>
          <AdminLoginForm />
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          This area is restricted to the site administrator only.
        </p>
      </div>
    </div>
  );
}


