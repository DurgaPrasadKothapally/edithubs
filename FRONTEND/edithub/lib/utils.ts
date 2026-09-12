import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

export function formatRelativeDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
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

export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
}

export function getYoutubeThumbnail(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const TUTORIAL_CATEGORIES = [
  'CapCut Editing',
  'Adobe Premiere Pro',
  'After Effects',
  'VN Video Editor',
  'Mobile Editing',
  'Cinematic Editing',
  'Color Grading',
  'Transitions',
  'Effects',
  'Reels Editing',
  'YouTube Editing',
  'DaVinci Resolve',
  'Final Cut Pro',
  'Other',
] as const;

export const RESOURCE_CATEGORIES = [
  'Presets',
  'Templates',
  'LUTs',
  'Overlays',
  'Sound Effects',
  'Fonts',
  'Project Files',
  'PNG Packs',
  'Other',
] as const;

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Popular', value: 'popular' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  'CapCut Editing': 'bg-pink-500/20 text-pink-400',
  'Adobe Premiere Pro': 'bg-purple-500/20 text-purple-400',
  'After Effects': 'bg-blue-500/20 text-blue-400',
  'VN Video Editor': 'bg-green-500/20 text-green-400',
  'Mobile Editing': 'bg-yellow-500/20 text-yellow-400',
  'Cinematic Editing': 'bg-cyan-500/20 text-cyan-400',
  'Color Grading': 'bg-orange-500/20 text-orange-400',
  'Transitions': 'bg-indigo-500/20 text-indigo-400',
  'Effects': 'bg-red-500/20 text-red-400',
  'Reels Editing': 'bg-rose-500/20 text-rose-400',
  'YouTube Editing': 'bg-red-600/20 text-red-400',
  'DaVinci Resolve': 'bg-teal-500/20 text-teal-400',
  'Final Cut Pro': 'bg-gray-500/20 text-gray-400',
  'Presets': 'bg-violet-500/20 text-violet-400',
  'Templates': 'bg-blue-500/20 text-blue-400',
  'LUTs': 'bg-amber-500/20 text-amber-400',
  'Overlays': 'bg-emerald-500/20 text-emerald-400',
  'Sound Effects': 'bg-sky-500/20 text-sky-400',
  'Fonts': 'bg-pink-500/20 text-pink-400',
  'Project Files': 'bg-orange-500/20 text-orange-400',
  'PNG Packs': 'bg-lime-500/20 text-lime-400',
  'Other': 'bg-gray-500/20 text-gray-400',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'bg-gray-500/20 text-gray-400';
}
