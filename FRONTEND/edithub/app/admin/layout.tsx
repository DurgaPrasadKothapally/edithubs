import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page doesn't need auth check — middleware handles it
  return (
    <div className="min-h-screen bg-background-DEFAULT flex">
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
        }}
      />
      {children}
    </div>
  );
}
