'use client';

import { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError || !data.user) {
        setError('Invalid email or password. Please try again.');
        return;
      }
      toast.success('Welcome back, Admin!');
      // Hard redirect ? forces middleware + session cookie to be re-evaluated
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="adm-email" className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="durga.k6585@gmail.com" required autoComplete="email"
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors" />
        </div>
      </div>
      <div>
        <label htmlFor="adm-pass" className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input id="adm-pass" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="????????" required autoComplete="current-password"
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-12 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">{error}</div>}
      <button type="submit" disabled={loading || !email || !password}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none">
        {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>Signing in...</>) : (<><LogIn size={18} />Sign In</>)}
      </button>
    </form>
  );
}