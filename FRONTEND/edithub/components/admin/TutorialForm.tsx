'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, Link as LinkIcon, Youtube, Save, Eye, EyeOff,
  Plus, Trash2, FileArchive, Image as ImageIcon, X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateSlug, TUTORIAL_CATEGORIES, getYoutubeThumbnail } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { TutorialWithResources } from '@/types';

interface TutorialFormProps {
  tutorial?: TutorialWithResources;
  mode: 'create' | 'edit';
}

interface ResourceEntry {
  id?: string;
  name: string;
  description: string;
  file?: File;
  file_url?: string;
  file_type?: string;
}

export function TutorialForm({ tutorial, mode }: TutorialFormProps) {
  const router = useRouter();
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(tutorial?.title || '');
  const [description, setDescription] = useState(tutorial?.description || '');
  const [category, setCategory] = useState(tutorial?.category || TUTORIAL_CATEGORIES[0]);
  const [software, setSoftware] = useState(tutorial?.software || '');
  const [tags, setTags] = useState(tutorial?.tags?.join(', ') || '');
  const [videoType, setVideoType] = useState<'youtube' | 'upload'>(tutorial?.video_type === 'upload' ? 'upload' : 'youtube');
  const [videoUrl, setVideoUrl] = useState(tutorial?.video_url || '');
  const [isPublished, setIsPublished] = useState(tutorial?.is_published ?? false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(tutorial?.thumbnail_url || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [resources, setResources] = useState<ResourceEntry[]>(
    tutorial?.resources?.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      file_url: r.file_url,
    })) || []
  );

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const autoThumbnailFromYoutube = () => {
    if (videoType === 'youtube' && videoUrl) {
      const thumb = getYoutubeThumbnail(videoUrl);
      if (thumb) setThumbnailPreview(thumb);
    }
  };

  const addResource = () => {
    setResources((r) => [...r, { name: '', description: '' }]);
  };

  const removeResource = (idx: number) => {
    setResources((r) => r.filter((_, i) => i !== idx));
  };

  const updateResource = (idx: number, field: keyof ResourceEntry, value: string | File) => {
    setResources((r) =>
      r.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const uploadFile = async (
    supabase: ReturnType<typeof createClient>,
    file: File,
    bucket: string,
    path: string
  ): Promise<string | null> => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!category) { toast.error('Category is required'); return; }
    if (!software.trim()) { toast.error('Software is required'); return; }

    setLoading(true);
    const supabase = createClient();
    const slug = tutorial?.slug || generateSlug(title);

    try {
      // 1. Upload thumbnail
      let thumbnailUrl = tutorial?.thumbnail_url || '';
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop();
        const path = `thumbnails/${slug}-${Date.now()}.${ext}`;
        const url = await uploadFile(supabase, thumbnailFile, 'tutorials', path);
        if (url) thumbnailUrl = url;
      } else if (videoType === 'youtube' && videoUrl && !thumbnailUrl) {
        thumbnailUrl = getYoutubeThumbnail(videoUrl) || '';
      }

      // 2. Upload video if file
      let finalVideoUrl = videoUrl;
      if (videoType === 'upload' && videoFile) {
        const ext = videoFile.name.split('.').pop();
        const path = `videos/${slug}-${Date.now()}.${ext}`;
        const url = await uploadFile(supabase, videoFile, 'tutorials', path);
        if (url) finalVideoUrl = url;
      }

      // 3. Upsert tutorial
      const tutorialData = {
        title: title.trim(),
        slug,
        description: description.trim(),
        category,
        software: software.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        video_url: finalVideoUrl || null,
        video_type: videoType,
        thumbnail_url: thumbnailUrl || null,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      let tutorialId = tutorial?.id;
      if (mode === 'create') {
        const { data, error } = await supabase
          .from('tutorials')
          .insert({ ...tutorialData, view_count: 0, created_at: new Date().toISOString() })
          .select('id')
          .single();
        if (error) throw error;
        tutorialId = data.id;
      } else {
        const { error } = await supabase
          .from('tutorials')
          .update(tutorialData)
          .eq('id', tutorial!.id);
        if (error) throw error;
      }

      // 4. Upload resources
      for (const resource of resources) {
        if (resource.id) continue; // existing resource — skip for now
        if (!resource.name.trim()) continue;

        let fileUrl = resource.file_url || '';
        let fileType = '';
        let fileSize = 0;

        if (resource.file) {
          const ext = resource.file.name.split('.').pop() || '';
          const path = `resources/${slug}-${resource.name.replace(/\s+/g, '-')}-${Date.now()}.${ext}`;
          const url = await uploadFile(supabase, resource.file, 'tutorial-resources', path);
          if (url) fileUrl = url;
          fileType = ext;
          fileSize = resource.file.size;
        }

        if (!fileUrl) continue;

        await supabase.from('tutorial_resources').insert({
          tutorial_id: tutorialId,
          name: resource.name.trim(),
          description: resource.description.trim(),
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
          download_count: 0,
          created_at: new Date().toISOString(),
        });
      }

      toast.success(mode === 'create' ? 'Tutorial created!' : 'Tutorial updated!');
      router.push('/admin/tutorials');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-text-primary">Basic Information</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="How to Create Cinematic Velocity Edit in CapCut"
            required
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this tutorial covers..."
            rows={5}
            required
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors resize-none"
          />
        </div>

        {/* Category + Software row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors appearance-none cursor-pointer"
            >
              {TUTORIAL_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background-secondary">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Software *</label>
            <input
              type="text"
              value={software}
              onChange={(e) => setSoftware(e.target.value)}
              placeholder="CapCut, After Effects, etc."
              required
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="velocity edit, cinematic, transitions"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-text-primary">Thumbnail</h2>
        <div className="flex items-start gap-5">
          {/* Preview */}
          <div className="w-40 h-24 rounded-xl overflow-hidden bg-surface border border-surface-border shrink-0 flex items-center justify-center">
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={28} className="text-text-muted" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <button
              type="button"
              onClick={() => thumbnailRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm hover:text-text-primary hover:border-accent/30 transition-all"
            >
              <Upload size={14} />
              Upload Image
            </button>
            {videoType === 'youtube' && videoUrl && (
              <button
                type="button"
                onClick={autoThumbnailFromYoutube}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm hover:text-text-primary hover:border-accent/30 transition-all ml-2"
              >
                <Youtube size={14} />
                Use YouTube Thumbnail
              </button>
            )}
            <p className="text-xs text-text-muted">JPG, PNG, WebP. Recommended: 1280×720</p>
            <input
              ref={thumbnailRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-text-primary">Video</h2>

        {/* Toggle */}
        <div className="flex gap-2 p-1 bg-surface rounded-xl w-fit">
          {(['youtube', 'upload'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVideoType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                videoType === type
                  ? 'bg-accent text-background-DEFAULT shadow-glow-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {type === 'youtube' ? <Youtube size={14} /> : <Upload size={14} />}
              {type === 'youtube' ? 'YouTube / URL' : 'Upload Video'}
            </button>
          ))}
        </div>

        {videoType === 'youtube' ? (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">YouTube / Video URL</label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onBlur={autoThumbnailFromYoutube}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Video File</label>
            <button
              type="button"
              onClick={() => videoRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-surface-border hover:border-accent/40 text-text-muted hover:text-text-secondary transition-all"
            >
              <Upload size={22} />
              <span className="text-sm">{videoFile ? videoFile.name : 'Click to upload video (MP4, MOV, WebM)'}</span>
            </button>
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
          </div>
        )}
      </div>

      {/* Downloadable Resources */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-text-primary">Downloadable Resources</h2>
          <button
            type="button"
            onClick={addResource}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
          >
            <Plus size={13} />
            Add File
          </button>
        </div>

        {resources.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">No resources added yet. Click &quot;Add File&quot; to attach downloadable files.</p>
        ) : (
          <div className="space-y-3">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-surface rounded-xl border border-surface-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileArchive size={15} className="text-text-muted" />
                    <span className="text-sm text-text-secondary font-medium">File {idx + 1}</span>
                    {resource.id && <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">Saved</span>}
                  </div>
                  {!resource.id && (
                    <button type="button" onClick={() => removeResource(idx)} className="text-text-muted hover:text-error transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => updateResource(idx, 'name', e.target.value)}
                    placeholder="Resource name (e.g. Project File)"
                    disabled={!!resource.id}
                    className="bg-background-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                  />
                  <input
                    type="text"
                    value={resource.description}
                    onChange={(e) => updateResource(idx, 'description', e.target.value)}
                    placeholder="Short description (optional)"
                    disabled={!!resource.id}
                    className="bg-background-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                  />
                </div>
                {!resource.id && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-DEFAULT border border-surface-border text-xs text-text-secondary hover:border-accent/30 transition-all">
                      <Upload size={13} />
                      {resource.file ? resource.file.name : 'Choose file...'}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) updateResource(idx, 'file', f);
                      }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish + Submit */}
      <div className="flex items-center justify-between bg-background-card border border-surface-border rounded-2xl p-5">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsPublished(!isPublished)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isPublished ? 'bg-accent' : 'bg-surface-border'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm font-medium text-text-primary flex items-center gap-1.5">
            {isPublished ? <Eye size={14} className="text-success" /> : <EyeOff size={14} className="text-text-muted" />}
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background-DEFAULT font-bold text-sm shadow-glow-accent hover:bg-accent-light active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              {mode === 'create' ? 'Create Tutorial' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
