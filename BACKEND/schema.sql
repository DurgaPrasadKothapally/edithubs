-- ============================================================
-- EditHub — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ─── Enable UUID extension ───────────────────────────────────
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- ─── Tutorials ───────────────────────────────────────────────
create table if not exists public.tutorials (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null default '',
  thumbnail_url text,
  video_url     text,
  video_type    text not null default 'youtube' check (video_type in ('youtube', 'upload', 'vimeo')),
  category      text not null,
  software      text not null default '',
  tags          text[] not null default '{}',
  is_published  boolean not null default false,
  view_count    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Tutorial Resources (downloadable files per tutorial) ────
create table if not exists public.tutorial_resources (
  id             uuid primary key default gen_random_uuid(),
  tutorial_id    uuid not null references public.tutorials(id) on delete cascade,
  name           text not null,
  description    text default '',
  file_url       text not null,
  file_size      bigint default 0,
  file_type      text default '',
  download_count integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── Standalone Resources ─────────────────────────────────────
create table if not exists public.resources (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text default '',
  category           text not null,
  preview_image_url  text,
  file_url           text not null,
  file_name          text not null default '',
  file_size          bigint default 0,
  file_type          text default '',
  download_count     integer not null default 0,
  is_published       boolean not null default false,
  tags               text[] not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- INDEXES (for fast queries)
-- ============================================================

create index if not exists idx_tutorials_slug         on public.tutorials(slug);
create index if not exists idx_tutorials_category     on public.tutorials(category);
create index if not exists idx_tutorials_is_published on public.tutorials(is_published);
create index if not exists idx_tutorials_created_at   on public.tutorials(created_at desc);
create index if not exists idx_tutorials_view_count   on public.tutorials(view_count desc);

create index if not exists idx_tutorial_resources_tutorial_id on public.tutorial_resources(tutorial_id);

create index if not exists idx_resources_category     on public.resources(category);
create index if not exists idx_resources_is_published on public.resources(is_published);
create index if not exists idx_resources_created_at   on public.resources(created_at desc);
create index if not exists idx_resources_downloads    on public.resources(download_count desc);

-- Full-text search index on tutorials
create index if not exists idx_tutorials_fts on public.tutorials
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(software,'') || ' ' || coalesce(category,'')));

-- Full-text search index on resources
create index if not exists idx_resources_fts on public.resources
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(category,'')));

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tutorials_updated_at
  before update on public.tutorials
  for each row execute procedure public.handle_updated_at();

create trigger resources_updated_at
  before update on public.resources
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.tutorials         enable row level security;
alter table public.tutorial_resources enable row level security;
alter table public.resources          enable row level security;

-- ─── Tutorials: public read (published only) ─────────────────
create policy "Public can read published tutorials"
  on public.tutorials for select
  using (is_published = true);

-- ─── Tutorials: admin full access ─────────────────────────────
create policy "Admin can do everything on tutorials"
  on public.tutorials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── Tutorial Resources: public read ─────────────────────────
create policy "Public can read tutorial resources"
  on public.tutorial_resources for select
  using (
    exists (
      select 1 from public.tutorials t
      where t.id = tutorial_id and t.is_published = true
    )
  );

-- ─── Tutorial Resources: admin full access ───────────────────
create policy "Admin can do everything on tutorial_resources"
  on public.tutorial_resources for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── Resources: public read (published only) ─────────────────
create policy "Public can read published resources"
  on public.resources for select
  using (is_published = true);

-- ─── Resources: admin full access ────────────────────────────
create policy "Admin can do everything on resources"
  on public.resources for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these in the Supabase Dashboard → Storage, OR uncomment
-- if using the service role key.

-- insert into storage.buckets (id, name, public)
-- values ('tutorials', 'tutorials', true)
-- on conflict (id) do nothing;

-- insert into storage.buckets (id, name, public)
-- values ('tutorial-resources', 'tutorial-resources', true)
-- on conflict (id) do nothing;

-- insert into storage.buckets (id, name, public)
-- values ('resources', 'resources', true)
-- on conflict (id) do nothing;

-- ─── Storage policies ─────────────────────────────────────────
-- Allow anyone to read from public buckets (set each bucket to "Public" in the dashboard)
-- Allow only authenticated users (admin) to upload / delete

-- create policy "Admin can upload to tutorials bucket"
--   on storage.objects for insert
--   with check (bucket_id = 'tutorials' and auth.role() = 'authenticated');

-- create policy "Admin can delete from tutorials bucket"
--   on storage.objects for delete
--   using (bucket_id = 'tutorials' and auth.role() = 'authenticated');

-- create policy "Admin can upload to tutorial-resources bucket"
--   on storage.objects for insert
--   with check (bucket_id = 'tutorial-resources' and auth.role() = 'authenticated');

-- create policy "Admin can upload to resources bucket"
--   on storage.objects for insert
--   with check (bucket_id = 'resources' and auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA (optional — remove before production)
-- ============================================================

-- Uncomment to seed a sample tutorial:
/*
insert into public.tutorials (slug, title, description, category, software, tags, video_url, video_type, is_published)
values (
  'cinematic-velocity-edit-capcut',
  'How to Create Cinematic Velocity Edit in CapCut',
  'In this tutorial you will learn how to create a smooth cinematic velocity edit inside CapCut. We cover beat sync, speed ramping, color grading with LUTs, and adding cinematic overlays.',
  'CapCut Editing',
  'CapCut',
  ARRAY['velocity edit', 'cinematic', 'capcut', 'speed ramp'],
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  true
);
*/

-- ============================================================
-- DONE
-- ============================================================
-- Your EditHub database is ready.
-- Next steps:
--   1. Create the 3 storage buckets in Supabase Dashboard → Storage:
--      - tutorials  (public)
--      - tutorial-resources  (public)
--      - resources  (public)
--   2. In each bucket, add a storage policy: allow public SELECT, authenticated INSERT/DELETE
--   3. In Supabase Auth → Settings, disable "Confirm email" if you want instant login
--   4. Create your admin account in Supabase Auth → Users → Add User
-- ============================================================
