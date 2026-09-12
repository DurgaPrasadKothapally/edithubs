'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Resource } from '@/types';

export function AdminResourceActions({ resource }: { resource: Resource }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('resources').delete().eq('id', resource.id);
    if (error) {
      toast.error('Failed to delete resource');
    } else {
      toast.success('Resource deleted');
      router.refresh();
    }
    setDeleting(false);
    setOpen(false);
  };

  const handleTogglePublish = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from('resources')
      .update({ is_published: !resource.is_published })
      .eq('id', resource.id);
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(resource.is_published ? 'Unpublished' : 'Published');
      router.refresh();
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/resources/${resource.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-text-secondary hover:text-orange-DEFAULT hover:border-orange-DEFAULT/30 transition-all"
      >
        <Edit size={12} />
        Edit
      </Link>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
        >
          <MoreHorizontal size={14} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-44 glass-dark border border-surface-border rounded-xl shadow-glass z-20 overflow-hidden">
              <button
                onClick={handleTogglePublish}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <Eye size={13} />
                {resource.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-error hover:bg-error/5 transition-colors border-t border-surface-border"
              >
                <Trash2 size={13} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
