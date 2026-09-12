import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, EyeOff, Package, Download } from 'lucide-react';
import { getAdminUser } from '@/lib/auth';
import { getAllResourcesAdmin } from '@/lib/resources';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminResourceActions } from '@/components/admin/AdminResourceActions';
import { formatDate, getCategoryColor, formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Manage Resources — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminResourcesPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  const resources = await getAllResourcesAdmin();

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-dark border-b border-surface-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-text-primary">Resources</h1>
              <p className="text-text-muted text-xs mt-0.5">{resources.length} resource{resources.length !== 1 ? 's' : ''} total</p>
            </div>
            <Link
              href="/admin/resources/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-DEFAULT text-white text-sm font-semibold hover:bg-orange-light active:scale-95 transition-all shadow-glow-orange"
            >
              <Plus size={15} />
              New Resource
            </Link>
          </div>
        </header>

        <div className="p-6">
          {resources.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-surface-border flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-text-muted" />
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">No resources yet</h3>
              <p className="text-text-secondary text-sm mb-6">Upload your first resource to get started.</p>
              <Link
                href="/admin/resources/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-DEFAULT text-white font-semibold text-sm"
              >
                <Plus size={15} />
                Add Resource
              </Link>
            </div>
          ) : (
            <div className="bg-background-card border border-surface-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider">Resource</th>
                    <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Downloads</th>
                    <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="px-5 py-3 text-right text-text-muted text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="border-b border-surface-border last:border-0 hover:bg-surface/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {resource.preview_image_url ? (
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-surface shrink-0">
                              <Image
                                src={resource.preview_image_url}
                                alt={resource.title}
                                width={56}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-10 rounded-lg bg-surface border border-surface-border shrink-0 flex items-center justify-center">
                              <Package size={14} className="text-text-muted" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-text-primary font-medium truncate max-w-[180px] sm:max-w-xs">{resource.title}</p>
                            <p className="text-text-muted text-xs mt-0.5">{resource.file_type?.toUpperCase()} · {formatFileSize(resource.file_size)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getCategoryColor(resource.category))}>
                          {resource.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="flex items-center gap-1.5 text-text-muted text-xs">
                          <Download size={11} />
                          {resource.download_count.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                          resource.is_published ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}>
                          {resource.is_published ? <Eye size={11} /> : <EyeOff size={11} />}
                          {resource.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <AdminResourceActions resource={resource} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
