# EditHub — Video Editing Tutorial Platform

A modern, professional, full-stack platform for sharing video editing tutorials, resources, presets, templates, and project files.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript |
| Styling    | Tailwind CSS (dark cinematic theme) |
| Backend    | Supabase (Postgres + Auth + Storage)|
| Animation  | CSS animations + Canvas API         |

---

## Project Structure

```
editi/
├── FRONTEND/
│   └── edithub/               ← Next.js app
│       ├── app/               ← Pages (App Router)
│       │   ├── page.tsx       ← Home
│       │   ├── tutorials/     ← Tutorials list + [slug] detail
│       │   ├── resources/     ← Resources page
│       │   ├── about/         ← About page
│       │   ├── admin/         ← Admin panel (protected)
│       │   │   ├── login/
│       │   │   ├── dashboard/
│       │   │   ├── tutorials/ ← List, new, [id] edit
│       │   │   └── resources/ ← List, new, [id] edit
│       │   └── api/
│       │       └── download/[id]/  ← Download + count tracking
│       ├── components/
│       │   ├── layout/        ← Navbar, Footer
│       │   ├── home/          ← HeroSection, FeaturedSection
│       │   ├── tutorials/     ← TutorialCard, Filter, VideoPlayer, DownloadItem
│       │   ├── resources/     ← ResourceCard, ResourcesFilter
│       │   ├── admin/         ← Sidebar, Forms, Action menus
│       │   └── ui/            ← Button, Input, Badge, Card, etc.
│       ├── lib/               ← Supabase clients, data fetchers, utils
│       ├── types/             ← TypeScript interfaces
│       ├── hooks/             ← useAdmin, useSearch
│       └── styles/            ← globals.css
└── BACKEND/
    └── schema.sql             ← Complete Supabase schema + RLS policies
```

---

## Setup Instructions

### 1 — Prerequisites

Install these before starting:

- **Node.js** v18 or later → https://nodejs.org
- **npm** (comes with Node.js)

---

### 2 — Create a Supabase Project

1. Go to https://supabase.com and sign up / log in.
2. Click **New Project**, give it a name (e.g. `edithub`), choose a region, set a strong database password.
3. Wait for the project to provision (~1 minute).

---

### 3 — Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Open the file `BACKEND/schema.sql` from this repo and paste the entire contents.
4. Click **Run**.

This creates:
- `tutorials` table
- `tutorial_resources` table (files attached to tutorials)
- `resources` table (standalone downloads)
- Row Level Security policies (public read, admin write)
- Performance indexes
- Auto `updated_at` triggers

---

### 4 — Create Storage Buckets

In your Supabase project, go to **Storage** (left sidebar) and create **3 buckets**:

| Bucket Name          | Public? |
|----------------------|---------|
| `tutorials`          | ✅ Yes  |
| `tutorial-resources` | ✅ Yes  |
| `resources`          | ✅ Yes  |

For each bucket, add storage policies:
- **SELECT**: allow for all (`true`)
- **INSERT**: allow for authenticated users only (`auth.role() = 'authenticated'`)
- **DELETE**: allow for authenticated users only (`auth.role() = 'authenticated'`)

---

### 5 — Create Your Admin Account

1. In Supabase, go to **Authentication → Users**.
2. Click **Add User → Create New User**.
3. Enter your admin email and a strong password.
4. Click **Create User**.

> This is the **only** account that can log in to the admin panel.

---

### 6 — Configure Environment Variables

1. Navigate to `FRONTEND/edithub/`.
2. Copy the example env file:
   ```
   copy .env.local.example .env.local
   ```
   (On Mac/Linux: `cp .env.local.example .env.local`)

3. Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_EMAIL=your_admin_email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find these values:**
- In Supabase → **Project Settings** → **API**
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 7 — Install Dependencies & Run

```bash
cd FRONTEND/edithub
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

### 8 — Access the Admin Panel

Go to: http://localhost:3000/admin/login

Log in with the email and password you created in Step 5.

---

## Pages Overview

| URL                        | Description                          |
|----------------------------|--------------------------------------|
| `/`                        | Home — Hero + featured content       |
| `/tutorials`               | All tutorials with search + filters  |
| `/tutorials/[slug]`        | Tutorial detail with video + downloads|
| `/resources`               | All downloadable resources           |
| `/about`                   | About page                           |
| `/admin/login`             | Admin login (restricted)             |
| `/admin/dashboard`         | Admin dashboard with stats           |
| `/admin/tutorials`         | Manage all tutorials                 |
| `/admin/tutorials/new`     | Create new tutorial                  |
| `/admin/tutorials/[id]`    | Edit existing tutorial               |
| `/admin/resources`         | Manage all resources                 |
| `/admin/resources/new`     | Upload new resource                  |
| `/admin/resources/[id]`    | Edit existing resource               |

---

## Admin Features

### Tutorial Management
- Add title, description, category, software, tags
- Upload thumbnail image or auto-fetch from YouTube
- Paste YouTube/Vimeo URL **or** upload a video file directly
- Attach multiple downloadable files per tutorial
- Publish / unpublish (draft mode)
- Edit and delete

### Resource Management
- Upload any file type (ZIP, RAR, MP3, PDF, etc.)
- Or link to an external URL (Google Drive, Dropbox)
- Add preview image, category, tags
- Track download count automatically
- Publish / unpublish

### Dashboard
- Total tutorials count
- Total resources count
- Total downloads across all content
- Recent uploads feed

---

## Download System

Every download goes through `/api/download/[id]` which:
1. Fetches the file URL from the database
2. Increments the `download_count` field atomically
3. Returns the URL to the client for immediate download

This works for both tutorial resource files and standalone resources.

---

## Deployment (Vercel)

1. Push the `FRONTEND/edithub` folder to a GitHub repo.
2. Go to https://vercel.com → **New Project** → import the repo.
3. Set the **Root Directory** to `FRONTEND/edithub`.
4. Add all environment variables from `.env.local` in the Vercel dashboard.
5. Deploy.

Update `NEXT_PUBLIC_SITE_URL` to your production domain after deployment.

---

## Security Notes

- Admin routes are protected by Supabase Auth session cookies via middleware.
- Row Level Security (RLS) is enabled on all tables — unauthenticated users can only `SELECT` published content.
- Visitors can never upload, insert, update, or delete any data.
- The `ADMIN_EMAIL` env var adds a secondary server-side guard.

---

## Customization

| What to change          | Where                                   |
|-------------------------|-----------------------------------------|
| Site name / branding    | `components/layout/Navbar.tsx`, `Footer.tsx`, `app/layout.tsx` |
| Color palette           | `tailwind.config.ts` → `colors`         |
| Tutorial categories     | `lib/utils.ts` → `TUTORIAL_CATEGORIES`  |
| Resource categories     | `lib/utils.ts` → `RESOURCE_CATEGORIES`  |
| Social media links      | `components/layout/Footer.tsx`          |
| About page content      | `app/about/page.tsx`                    |
| SEO metadata            | `app/layout.tsx` + each page's metadata |

---

## License

Built for personal use. All tutorial content and resources belong to the site owner.
