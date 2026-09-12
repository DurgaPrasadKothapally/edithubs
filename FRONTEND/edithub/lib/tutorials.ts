import { createClient } from '@/lib/supabase/server';
import type { Tutorial, TutorialWithResources, FilterState } from '@/types';

export async function getTutorials(filters?: Partial<FilterState>): Promise<Tutorial[]> {
  const supabase = await createClient();

  let query = supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,software.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
    );
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  if (filters?.sortBy === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else if (filters?.sortBy === 'popular') {
    query = query.order('view_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }

  return data as Tutorial[];
}

export async function getTutorialBySlug(slug: string): Promise<TutorialWithResources | null> {
  const supabase = await createClient();

  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .select(`
      *,
      resources:tutorial_resources(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !tutorial) {
    return null;
  }

  // Increment view count
  await supabase
    .from('tutorials')
    .update({ view_count: (tutorial.view_count || 0) + 1 })
    .eq('id', tutorial.id);

  return tutorial as TutorialWithResources;
}

export async function getFeaturedTutorials(limit = 6): Promise<Tutorial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as Tutorial[];
}

export async function getRelatedTutorials(
  tutorialId: string,
  category: string,
  limit = 4
): Promise<Tutorial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .neq('id', tutorialId)
    .limit(limit);

  if (error) return [];
  return data as Tutorial[];
}

export async function getAllTutorialsAdmin(): Promise<Tutorial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Tutorial[];
}

export async function getTutorialByIdAdmin(id: string): Promise<TutorialWithResources | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tutorials')
    .select(`
      *,
      resources:tutorial_resources(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as TutorialWithResources;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
