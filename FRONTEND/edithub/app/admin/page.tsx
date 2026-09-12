import { redirect } from 'next/navigation';

// /admin redirects to /admin/dashboard
export default function AdminPage() {
  redirect('/admin/dashboard');
}
