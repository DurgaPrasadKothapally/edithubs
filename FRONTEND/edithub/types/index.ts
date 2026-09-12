// ─── Tutorial Types ───────────────────────────────────────────────────────────

export type TutorialCategory =
  | 'CapCut Editing'
  | 'Adobe Premiere Pro'
  | 'After Effects'
  | 'VN Video Editor'
  | 'Mobile Editing'
  | 'Cinematic Editing'
  | 'Color Grading'
  | 'Transitions'
  | 'Effects'
  | 'Reels Editing'
  | 'YouTube Editing'
  | 'DaVinci Resolve'
  | 'Final Cut Pro'
  | 'Other';

export type ResourceCategory =
  | 'Presets'
  | 'Templates'
  | 'LUTs'
  | 'Overlays'
  | 'Sound Effects'
  | 'Fonts'
  | 'Project Files'
  | 'PNG Packs'
  | 'Other';

export interface TutorialResource {
  id: string;
  tutorial_id: string;
  name: string;
  description?: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  download_count: number;
  created_at: string;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url?: string;
  video_type: 'youtube' | 'upload' | 'vimeo';
  category: TutorialCategory;
  software: string;
  tags: string[];
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  resources?: TutorialResource[];
}

export interface TutorialWithResources extends Tutorial {
  resources: TutorialResource[];
}

// ─── Resource Types ────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: ResourceCategory;
  preview_image_url?: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  download_count: number;
  is_published: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ─── Admin / Auth Types ───────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface AdminStats {
  totalTutorials: number;
  totalResources: number;
  totalDownloads: number;
  recentUploads: RecentUpload[];
}

export interface RecentUpload {
  id: string;
  title: string;
  type: 'tutorial' | 'resource';
  created_at: string;
  thumbnail_url?: string;
}

// ─── UI / Utility Types ───────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  category: string;
  sortBy: 'newest' | 'oldest' | 'popular';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export type SortOption = {
  label: string;
  value: 'newest' | 'oldest' | 'popular';
};

// ─── Form Types ────────────────────────────────────────────────────────────────

export interface TutorialFormData {
  title: string;
  description: string;
  category: TutorialCategory;
  software: string;
  tags: string;
  video_url: string;
  video_type: 'youtube' | 'upload' | 'vimeo';
  is_published: boolean;
}

export interface ResourceFormData {
  title: string;
  description: string;
  category: ResourceCategory;
  tags: string;
  is_published: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}
