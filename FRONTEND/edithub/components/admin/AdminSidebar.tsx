'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Clapperboard, LayoutDashboard, BookOpen, Package,
  LogOut, Menu, X, ChevronRight, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/tutorials',
    label: 'Tutorials',
    icon: BookOpen,
    children: [
      { href: '/admin/tutorials/new', label: 'Add Tutorial', icon: Plus },
    ],
  },
  {
    href: '/admin/resources',
    label: 'Resources',
    icon: Package,
    children: [
      { href: '/admin/resources/new', label: 'Add Resource', icon: Plus },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/admin/login');
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-surface-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-gradient flex items-center justify-center shadow-glow-accent">
            <Clapperboard size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display text-base font-bold">
              <span className="gradient-text">Prasads</span><span className="text-text-primary">_Visuals</span>
            </span>
            <p className="text-[10px] text-text-muted -mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExactActive = pathname === item.href;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <ChevronRight size={14} className={cn('transition-transform', isActive && 'rotate-90')} />
                )}
              </Link>

              {/* Children */}
              {item.children && isActive && (
                <div className="mt-1 ml-7 space-y-0.5">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                          pathname === child.href
                            ? 'text-accent bg-accent/10'
                            : 'text-text-muted hover:text-text-secondary hover:bg-surface'
                        )}
                      >
                        <ChildIcon size={13} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: view site + logout */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary hover:bg-surface transition-all"
        >
          <Clapperboard size={16} />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-text-muted hover:text-error hover:bg-error/5 transition-all disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-background-secondary border-r border-surface-border">
        <SidebarContent />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-text-secondary"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-background-secondary border-r border-surface-border flex flex-col">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

