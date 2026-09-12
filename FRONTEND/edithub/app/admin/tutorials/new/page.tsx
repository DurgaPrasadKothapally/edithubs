import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAdminUser } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TutorialForm } from '@/components/admin/TutorialForm';

export const metadata: Metadata = {
  title: 'New Tutorial — Admin',
  robots: { index: false, follow: false },
};

export default async function NewTutorialPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-dark border-b border-surface-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/tutorials"
              className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-text-primary">New Tutorial</h1>
              <p className="text-text-muted text-xs">Add a new video editing tutorial</p>
            </div>
          </div>
        </header>
        <div className="p-6">
          <TutorialForm mode="create" />
        </div>
      </div>
    </div>
  );
}
