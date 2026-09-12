import Link from 'next/link';
import { Clapperboard, Youtube, Instagram, Twitter, Github } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Home', href: '/' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
  ],
  categories: [
    { label: 'CapCut Editing', href: '/tutorials?category=CapCut+Editing' },
    { label: 'After Effects', href: '/tutorials?category=After+Effects' },
    { label: 'Color Grading', href: '/tutorials?category=Color+Grading' },
    { label: 'Cinematic Editing', href: '/tutorials?category=Cinematic+Editing' },
    { label: 'Transitions', href: '/tutorials?category=Transitions' },
    { label: 'Reels Editing', href: '/tutorials?category=Reels+Editing' },
  ],
  resources: [
    { label: 'Presets', href: '/resources?category=Presets' },
    { label: 'LUTs', href: '/resources?category=LUTs' },
    { label: 'Templates', href: '/resources?category=Templates' },
    { label: 'Sound Effects', href: '/resources?category=Sound+Effects' },
    { label: 'Overlays', href: '/resources?category=Overlays' },
    { label: 'Project Files', href: '/resources?category=Project+Files' },
  ],
};

const socialLinks = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center shadow-glow-accent">
                <Clapperboard size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="gradient-text">Prasads</span><span className="text-text-primary">_Visuals</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-6">
              Helping creators learn, edit, and create better content. Professional
              video editing tutorials, resources, presets, templates, and project
              files â€” all in one place.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            Â© {new Date().getFullYear()} Prasads Visuals. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-text-muted text-sm hover:text-accent transition-colors"
            >
              Contact
            </Link>
            <a
              href="#"
              className="text-text-muted text-sm hover:text-accent transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

