import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Prasads Visuals — Learn. Edit. Create.',
    template: '%s | Prasads Visuals',
  },

  description:
    'Professional video editing tutorials, resources, presets, templates, and project files — all in one place.',

  keywords: [
    'video editing tutorials',
    'CapCut tutorial',
    'After Effects',
    'Premiere Pro',
    'color grading',
    'LUTs',
    'presets',
    'cinematic editing',
    'reels editing',
    'video effects',
    'transitions',
    'mobile editing',
  ],

  verification: {
    google: 'google8431ff88992c6b21.html',
  },

  openGraph: {
    type: 'website',
    siteName: 'Prasads Visuals',
    title: 'Prasads Visuals — Learn. Edit. Create.',
    description:
      'Professional video editing tutorials, resources, presets, templates, and project files.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Prasads Visuals — Learn. Edit. Create.',
    description:
      'Professional video editing resources and downloads.',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background-DEFAULT text-text-primary antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141c2b',
              color: '#f1f5f9',
              border: '1px solid #1e2d42',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#141c2b' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#141c2b' },
            },
          }}
        />
        <Navbar />
        <main className="page-enter">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
