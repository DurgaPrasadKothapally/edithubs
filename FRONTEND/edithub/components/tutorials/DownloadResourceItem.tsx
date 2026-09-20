'use client';

import { useState } from 'react';
import { Download, FileArchive, CheckCircle } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import type { TutorialResource } from '@/types';
import { useOtpAuth } from '@/hooks/useOtpAuth';
import { OtpModal } from '@/components/auth/OtpModal';

interface DownloadResourceItemProps {
  resource: TutorialResource;
}

export function DownloadResourceItem({ resource }: DownloadResourceItemProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done'>('idle');
  const { showOtpModal, requireAuth, handleOtpSuccess, handleClose } = useOtpAuth();

  const performDownload = async () => {
    setStatus('downloading');
    try {
      const res = await fetch(`/api/download/${resource.id}?type=tutorial_resource`);
      if (res.ok) {
        const { url } = await res.json();
        const a = document.createElement('a');
        a.href = url || resource.file_url;
        a.download = resource.name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(resource.file_url, '_blank');
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      window.open(resource.file_url, '_blank');
      setStatus('idle');
    }
  };

  const handleDownload = () => {
    requireAuth(() => performDownload());
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-surface-border hover:border-accent/20 transition-all group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
            <FileArchive size={18} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">{resource.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {resource.file_type && (
                <span className="text-xs text-text-muted uppercase">{resource.file_type}</span>
              )}
              {resource.file_size && (
                <span className="text-xs text-text-muted">{formatFileSize(resource.file_size)}</span>
              )}
              <span className="text-xs text-text-muted">
                {resource.download_count.toLocaleString()} downloads
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={status === 'downloading'}
          className={cn(
            'shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
            status === 'done'
              ? 'bg-success/10 text-success border border-success/30'
              : status === 'downloading'
              ? 'bg-surface text-text-muted cursor-wait border border-surface-border'
              : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-background-DEFAULT hover:shadow-glow-accent'
          )}
        >
          {status === 'done' ? (
            <>
              <CheckCircle size={14} />
              Done
            </>
          ) : (
            <>
              <Download size={14} className={status === 'downloading' ? 'animate-bounce' : ''} />
              {status === 'downloading' ? 'Getting...' : 'Download'}
            </>
          )}
        </button>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={handleClose}
        onSuccess={handleOtpSuccess}
        title="Verify to Download"
        description="Enter your email to get a one-time code and start your download."
      />
    </>
  );
}
