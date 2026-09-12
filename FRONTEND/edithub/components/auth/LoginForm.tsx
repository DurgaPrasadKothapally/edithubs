'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error: urlError }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlError === 'auth_failed' ? 'Authentication failed. Please try again.' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      if (!data.user) {
        setError('Authentication failed. Please try again.');
        return;
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (data.user.email === adminEmail) {
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.success('Signed in successfully!');
        router.push('/');
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="text-center mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">Welcome back</h2>
        <p className="text-text-muted text-sm mt-1">
          Admin? You will be redirected to your dashboard.
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-12 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      {/* Back to site */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-text-muted text-sm hover:text-accent transition-colors"
        >
          ← Continue browsing without signing in
        </Link>
      </div>
    </form>
  );
}