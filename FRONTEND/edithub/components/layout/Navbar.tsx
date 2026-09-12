'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Clapperboard, ChevronDown } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/resources', label: 'Resources' },
  {
    label: 'Categories',
    href: '/tutorials',
    dropdown: [
      'CapCut Editing',
      'Adobe Premiere Pro',
      'After Effects',
      'Color Grading',
      'Cinematic Editing',
      'Transitions',
      'Mobile Editing',
      'Reels Editing',
    ],
  },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled ? 'glass-dark border-b border-white/5 py-3' : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Prasads Visuals Home">
            <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center shadow-glow-accent group-hover:scale-105 transition-transform duration-200">
              <Clapperboard size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text">Prasads</span>
              <span className="text-text-primary">_Visuals</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-200"
                  >
                    {link.label}
                    <ChevronDown size={14} className={cn('transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-52 glass-dark border border-surface-border rounded-2xl shadow-glass overflow-hidden z-50 animate-fade-down">
                      {link.dropdown.map((cat) => (
                        <Link
                          key={cat}
                          href={`/tutorials?category=${encodeURIComponent(cat)}`}
                          className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                    pathname === link.href
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side — UserMenu replaces static button */}
          <div className="hidden md:flex items-center gap-3">
            <UserMenu />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-surface-border text-text-secondary hover:text-text-primary transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="menu-overlay md:hidden animate-fade-in" aria-modal="true" role="dialog">
          <div className="flex items-center justify-between px-4 py-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center">
                <Clapperboard size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="gradient-text">Prasads</span>
                <span className="text-text-primary">_Visuals</span>
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-surface-border text-text-secondary"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider mt-4 mb-1">
                    {link.label}
                  </p>
                  {link.dropdown.map((cat) => (
                    <Link
                      key={cat}
                      href={`/tutorials?category=${encodeURIComponent(cat)}`}
                      className="block px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile auth section */}
          <div className="px-4 pt-4 border-t border-surface-border mt-4 space-y-3">
            <div className="flex justify-center">
              <UserMenu />
            </div>
            <Link
              href="/tutorials"
              className="flex items-center justify-center w-full py-3.5 rounded-xl bg-accent text-background-DEFAULT font-semibold text-base shadow-glow-accent"
              onClick={() => setIsOpen(false)}
            >
              Start Learning Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}