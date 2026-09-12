import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen, Package, Download, TrendingUp,
  Plus, ArrowRight, Clapperboard, Clock,
} from 'lucide-react';
import { getAdminUser, getAdminStats } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatRelativeDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  const stats = await getAdminStats();

  const statCards = [
    {
      label: 'Total Tutorials',
      value: stats.totalTutorials,
      icon: BookOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
      href: '/admin/tutorials',
    },
    {
      label: 'Total Resources',
      value: stats.totalResources,
      icon: Package,
      color: 'text-orange-DEFAULT',
      bg: 'bg-orange-DEFAULT/10',
      border: 'border-orange-DEFAULT/20',
      href: '/admin/resources',
    },
    {
      label: 'Total Downloads',
      value: stats.totalDownloads,
      icon: Download,
      color: 'text-violet-DEFAULT',
      bg: 'bg-violet-DEFAULT/10',
      border: 'border-violet-DEFAULT/20',
      href: '#',
    },
    {
      label: 'Recent Uploads',
      value: stats.recentUploads.length,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      href: '#',
    },
  ];

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-dark border-b border-surface-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-muted text-xs mt-0.5">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/tutorials/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-background-DEFAULT text-sm font-semibold hover:bg-accent-light active:scale-95 transition-all shadow-glow-accent"
              >
                <Plus size={15} />
                New Tutorial
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className={`group flex items-center gap-4 p-5 rounded-2xl bg-background-card border ${card.border} hover:shadow-card-hover transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={22} className={card.color} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs font-medium">{card.label}</p>
                    <p className={`font-display text-3xl font-bold mt-0.5 ${card.color}`}>
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  href: '/admin/tutorials/new',
                  icon: BookOpen,
                  title: 'Add New Tutorial',
                  desc: 'Upload a video or add a YouTube link',
                  color: 'text-accent',
                  bg: 'bg-accent/10',
                  border: 'hover:border-accent/30',
                },
                {
                  href: '/admin/resources/new',
                  icon: Package,
                  title: 'Add New Resource',
                  desc: 'Upload presets, LUTs, templates, etc.',
                  color: 'text-orange-DEFAULT',
                  bg: 'bg-orange-DEFAULT/10',
                  border: 'hover:border-orange-DEFAULT/30',
                },
                {
                  href: '/admin/tutorials',
                  icon: Clapperboard,
                  title: 'Manage Tutorials',
                  desc: 'Edit, delete or unpublish tutorials',
                  color: 'text-violet-DEFAULT',
                  bg: 'bg-violet-DEFAULT/10',
                  border: 'hover:border-violet-DEFAULT/30',
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`group flex items-start gap-4 p-5 rounded-2xl bg-background-card border border-surface-border ${action.border} transition-all hover:-translate-y-0.5 hover:shadow-card`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={18} className={action.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm">{action.title}</p>
                      <p className="text-text-muted text-xs mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-text-muted mt-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent uploads */}
          {stats.recentUploads.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Clock size={18} className="text-text-muted" />
                  Recent Uploads
                </h2>
                <div className="flex gap-2">
                  <Link href="/admin/tutorials" className="text-xs text-accent hover:text-accent-light transition-colors">
                    All tutorials →
                  </Link>
                </div>
              </div>

              <div className="bg-background-card border border-surface-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider">Title</th>
                      <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Type</th>
                      <th className="text-left px-5 py-3 text-text-muted text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Uploaded</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUploads.map((item) => (
                      <tr key={`${item.type}-${item.id}`} className="border-b border-surface-border last:border-0 hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {item.thumbnail_url ? (
                              <div className="w-10 h-7 rounded-lg overflow-hidden bg-surface shrink-0">
                                <Image
                                  src={item.thumbnail_url}
                                  alt={item.title}
                                  width={40}
                                  height={28}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-7 rounded-lg bg-surface border border-surface-border shrink-0 flex items-center justify-center">
                                {item.type === 'tutorial'
                                  ? <BookOpen size={12} className="text-text-muted" />
                                  : <Package size={12} className="text-text-muted" />
                                }
                              </div>
                            )}
                            <span className="text-text-primary font-medium truncate max-w-[200px]">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.type === 'tutorial'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-orange-DEFAULT/10 text-orange-DEFAULT'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">
                          {formatRelativeDate(item.created_at)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={item.type === 'tutorial' ? `/admin/tutorials/${item.id}` : `/admin/resources/${item.id}`}
                            className="text-xs text-text-muted hover:text-accent transition-colors"
                          >
                            Edit →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
