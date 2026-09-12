'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function UserMenu() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out');
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-accent/30 transition-all duration-200"
      >
        <User size={15} />
        Sign In
      </Link>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:border-accent/30 transition-all duration-200"
        aria-label="User menu"
      >
        <div className="w-7 h-7 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
        <span className="text-text-secondary text-sm hidden sm:block max-w-[120px] truncate">
          {isAdmin ? 'Admin' : user.email?.split('@')[0]}
        </span>
        {isAdmin && (
          <span className="hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">
            Admin
          </span>
        )}
        <ChevronDown size={13} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 glass-dark border border-surface-border rounded-2xl shadow-glass z-20 overflow-hidden animate-fade-down">
            {/* User info */}
            <div className="px-4 py-3 border-b border-surface-border">
              <p className="text-text-primary text-sm font-medium truncate">{user.email}</p>
              <p className="text-text-muted text-xs mt-0.5">{isAdmin ? 'Administrator' : 'Viewer'}</p>
            </div>

            {/* Admin dashboard link */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent hover:bg-accent/5 transition-colors"
              >
                <LayoutDashboard size={14} />
                Admin Dashboard
              </Link>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-error hover:bg-error/5 transition-colors border-t border-surface-border"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}