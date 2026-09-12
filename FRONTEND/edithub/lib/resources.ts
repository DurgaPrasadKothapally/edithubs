import { createClient } from '@/lib/supabase/server';
import type { Resource, FilterState } from '@/types';

export async function getResources(filters?: Partial<FilterState>): Promise<Resource[]> {
  const supabase = await createClient();

  let query = supabase
    .from('resources')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
    );
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  if (filters?.sortBy === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else if (filters?.sortBy === 'popular') {
    query = query.order('download_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Resource[];
}

export async function getFeaturedResources(limit = 6): Promise<Resource[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('is_published', true)
    .order('download_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as Resource[];
}

export async function getAllResourcesAdmin(): Promise<Resource[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Resource[];
}

export async function getResourceByIdAdmin(id: string): Promise<Resource | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Resource;
}
