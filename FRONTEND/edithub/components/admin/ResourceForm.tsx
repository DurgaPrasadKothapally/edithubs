'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Save, Eye, EyeOff, Image as ImageIcon, FileArchive } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { RESOURCE_CATEGORIES } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Resource } from '@/types';

interface ResourceFormProps {
  resource?: Resource;
  mode: 'create' | 'edit';
}

export function ResourceForm({ resource, mode }: ResourceFormProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(resource?.title || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [category, setCategory] = useState(resource?.category || RESOURCE_CATEGORIES[0]);
  const [tags, setTags] = useState(resource?.tags?.join(', ') || '');
  const [isPublished, setIsPublished] = useState(resource?.is_published ?? false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState(resource?.preview_image_url || '');
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState(resource?.file_url || '');

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewSrc(URL.createObjectURL(file));
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
    if (error) return null;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!category) { toast.error('Category is required'); return; }
    if (mode === 'create' && !resourceFile && !downloadUrl) {
      toast.error('Please upload a file or provide a download URL');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const safeName = title.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      // Upload preview image
      let previewUrl = resource?.preview_image_url || '';
      if (previewFile) {
        const ext = previewFile.name.split('.').pop();
        const path = `previews/${safeName}-${Date.now()}.${ext}`;
        const url = await uploadFile(supabase, previewFile, 'resources', path);
        if (url) previewUrl = url;
      }

      // Upload resource file
      let fileUrl = downloadUrl || resource?.file_url || '';
      let fileName = resource?.file_name || '';
      let fileType = resource?.file_type || '';
      let fileSize = resource?.file_size || 0;

      if (resourceFile) {
        const ext = resourceFile.name.split('.').pop() || '';
        const path = `files/${safeName}-${Date.now()}.${ext}`;
        const url = await uploadFile(supabase, resourceFile, 'resources', path);
        if (url) fileUrl = url;
        fileName = resourceFile.name;
        fileType = ext;
        fileSize = resourceFile.size;
      }

      const resourceData = {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        preview_image_url: previewUrl || null,
        file_url: fileUrl,
        file_name: fileName || title.trim(),
        file_type: fileType,
        file_size: fileSize,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { error } = await supabase.from('resources').insert({
          ...resourceData,
          download_count: 0,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', resource!.id);
        if (error) throw error;
      }

      toast.success(mode === 'create' ? 'Resource created!' : 'Resource updated!');
      router.push('/admin/resources');
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
        <h2 className="font-display font-semibold text-text-primary">Resource Details</h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cinematic LUT Pack Vol.1"
            required
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's included in this resource..."
            rows={4}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors appearance-none cursor-pointer"
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background-secondary">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="cinematic, LUT, color grade"
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Preview Image */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-text-primary">Preview Image</h2>
        <div className="flex items-start gap-5">
          <div className="w-40 h-28 rounded-xl overflow-hidden bg-surface border border-surface-border shrink-0 flex items-center justify-center">
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={28} className="text-text-muted" />
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => previewRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface-border text-text-secondary text-sm hover:text-text-primary hover:border-accent/30 transition-all"
            >
              <Upload size={14} />
              Upload Preview Image
            </button>
            <p className="text-xs text-text-muted mt-2">Recommended: 1280×720, JPG or PNG</p>
            <input ref={previewRef} type="file" accept="image/*" className="hidden" onChange={handlePreviewChange} />
          </div>
        </div>
      </div>

      {/* Resource File */}
      <div className="bg-background-card border border-surface-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-text-primary">Resource File</h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Upload File</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-surface-border hover:border-orange-DEFAULT/40 text-text-muted hover:text-text-secondary transition-all"
          >
            <FileArchive size={24} />
            <span className="text-sm">{resourceFile ? resourceFile.name : 'Click to upload file (ZIP, RAR, MP3, etc.)'}</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-border" />
          <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-surface-border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">External Download URL</label>
          <input
            type="url"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
          />
          <p className="text-xs text-text-muted mt-1.5">Google Drive, Dropbox, or any direct download link.</p>
        </div>
      </div>

      {/* Publish + Submit */}
      <div className="flex items-center justify-between bg-background-card border border-surface-border rounded-2xl p-5">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsPublished(!isPublished)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isPublished ? 'bg-orange-DEFAULT' : 'bg-surface-border'}`}
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-DEFAULT text-white font-bold text-sm hover:bg-orange-light active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-glow-orange"
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
              {mode === 'create' ? 'Create Resource' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
