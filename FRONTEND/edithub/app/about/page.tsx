import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clapperboard, BookOpen, Package, Youtube, Instagram, Twitter, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Prasads Visuals â€” your go-to resource for professional video editing tutorials and free editing resources.',
};

const features = [
  {
    icon: BookOpen,
    title: 'In-depth Tutorials',
    description: 'Step-by-step video tutorials covering everything from basic cuts to advanced cinematic effects.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Package,
    title: 'Free Resources',
    description: 'Download free presets, LUTs, templates, overlays, sound effects, and project files.',
    color: 'text-orange-DEFAULT',
    bg: 'bg-orange-DEFAULT/10',
  },
  {
    icon: Clapperboard,
    title: 'Every Skill Level',
    description: 'Whether you\'re just starting out or a seasoned editor, there\'s something here for you.',
    color: 'text-violet-DEFAULT',
    bg: 'bg-violet-DEFAULT/10',
  },
];

const software = [
  'CapCut', 'Adobe Premiere Pro', 'After Effects',
  'DaVinci Resolve', 'Final Cut Pro', 'VN Video Editor',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-gradient shadow-glow-accent mb-6">
            <Clapperboard size={36} className="text-white" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-text-primary mb-5">
            About <span className="gradient-text">Prasads Visuals</span>
          </h1>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed">
            A platform built by a creator, for creators. Your one-stop destination
            for professional video editing tutorials, free resources, and everything
            you need to create stunning content.
          </p>
        </div>

        {/* What is Prasads Visuals */}
        <div className="glass rounded-3xl border border-white/8 p-8 sm:p-12 mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-5">
            What is Prasads Visuals?
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed text-base">
            <p>
              Prasads Visuals is a dedicated platform for sharing high-quality video editing tutorials,
              downloadable resources, presets, templates, project files, and everything a content
              creator needs to level up their editing game.
            </p>
            <p>
              Every tutorial here is crafted with care â€” real techniques, real workflows, and
              real results. From quick CapCut transitions to advanced After Effects motion graphics,
              you&apos;ll find practical guides you can actually use.
            </p>
            <p>
              All resources available for download â€” presets, LUTs, overlays, sound effects â€”
              are free to use in your own projects.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="glass rounded-2xl border border-white/8 p-6">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Software covered */}
        <div className="glass rounded-3xl border border-white/8 p-8 sm:p-10 mb-12">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Software Covered</h2>
          <div className="flex flex-wrap gap-3">
            {software.map((s) => (
              <span
                key={s}
                className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Contact / Social */}
        <div className="glass rounded-3xl border border-white/8 p-8 sm:p-10 mb-12">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-3">Get in Touch</h2>
          <p className="text-text-secondary mb-6">
            Have a suggestion for a tutorial? Want to collaborate? Reach out through
            any of the channels below.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-400 hover:border-red-400/30' },
              { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-400 hover:border-pink-400/30' },
              { icon: Twitter, label: 'Twitter / X', href: '#', color: 'hover:text-sky-400 hover:border-sky-400/30' },
              { icon: Mail, label: 'Email', href: 'mailto:durga.k6585@gmail.com', color: 'hover:text-accent hover:border-accent/30' },
            ].map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm font-medium transition-all duration-200 ${color}`}
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
            Ready to start editing?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-95 transition-all"
            >
              Explore Tutorials
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-surface-border text-text-primary font-semibold text-base hover:border-orange-DEFAULT/40 hover:text-orange-DEFAULT active:scale-95 transition-all"
            >
              Free Downloads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


