import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getAdminUser } from '@/lib/auth';
import { getTutorialByIdAdmin } from '@/lib/tutorials';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TutorialForm } from '@/components/admin/TutorialForm';

export const metadata: Metadata = {
  title: 'Edit Tutorial — Admin',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTutorialPage({ params }: PageProps) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  const { id } = await params;
  const tutorial = await getTutorialByIdAdmin(id);
  if (!tutorial) notFound();

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-dark border-b border-surface-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/tutorials"
                className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={15} />
              </Link>
              <div>
                <h1 className="font-display text-xl font-bold text-text-primary">Edit Tutorial</h1>
                <p className="text-text-muted text-xs truncate max-w-xs">{tutorial.title}</p>
              </div>
            </div>
            <Link
              href={`/tutorials/${tutorial.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
            >
              <ExternalLink size={12} />
              View on site
            </Link>
          </div>
        </header>
        <div className="p-6">
          <TutorialForm tutorial={tutorial} mode="edit" />
        </div>
      </div>
    </div>
  );
}
