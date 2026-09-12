import { createClient } from '@/lib/supabase/server';

export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Verify the user is the admin (check against the admin email env var)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) return null;

  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [
    { count: tutorialCount },
    { count: resourceCount },
    { data: tutorialDownloads },
    { data: resourceDownloads },
    { data: recentTutorials },
    { data: recentResources },
  ] = await Promise.all([
    supabase.from('tutorials').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('tutorial_resources').select('download_count'),
    supabase.from('resources').select('download_count'),
    supabase
      .from('tutorials')
      .select('id, title, thumbnail_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('resources')
      .select('id, title, preview_image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const totalTutorialDownloads = tutorialDownloads?.reduce(
    (sum, r) => sum + (r.download_count || 0),
    0
  ) ?? 0;
  const totalResourceDownloads = resourceDownloads?.reduce(
    (sum, r) => sum + (r.download_count || 0),
    0
  ) ?? 0;

  const recentUploads = [
    ...(recentTutorials || []).map((t) => ({
      id: t.id,
      title: t.title,
      type: 'tutorial' as const,
      created_at: t.created_at,
      thumbnail_url: t.thumbnail_url,
    })),
    ...(recentResources || []).map((r) => ({
      id: r.id,
      title: r.title,
      type: 'resource' as const,
      created_at: r.created_at,
      thumbnail_url: r.preview_image_url,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return {
    totalTutorials: tutorialCount ?? 0,
    totalResources: resourceCount ?? 0,
    totalDownloads: totalTutorialDownloads + totalResourceDownloads,
    recentUploads,
  };
}
