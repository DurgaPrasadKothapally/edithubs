import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAdminUser } from '@/lib/auth';
import { getResourceByIdAdmin } from '@/lib/resources';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const metadata: Metadata = {
  title: 'Edit Resource — Admin',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResourcePage({ params }: PageProps) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  const { id } = await params;
  const resource = await getResourceByIdAdmin(id);
  if (!resource) notFound();

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-dark border-b border-surface-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/resources"
              className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-text-primary">Edit Resource</h1>
              <p className="text-text-muted text-xs truncate max-w-xs">{resource.title}</p>
            </div>
          </div>
        </header>
        <div className="p-6">
          <ResourceForm resource={resource} mode="edit" />
        </div>
      </div>
    </div>
  );
}
