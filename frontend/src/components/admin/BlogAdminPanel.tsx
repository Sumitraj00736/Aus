import React, { useMemo, useRef, useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

type BlogItem = {
  _id?: string;
  slug?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  contentHtml?: string;
  coverImage?: string;
  bannerImage?: string;
  author?: string;
  authorRole?: string;
  readMinutes?: number;
  tags?: string[];
  popularTags?: string[];
  galleryImages?: string[];
  quoteText?: string;
  quoteAuthor?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  isPublished?: boolean;
};

type Props = {
  blogs: BlogItem[];
  onSave: (payload: BlogItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyBlog: BlogItem = {
  slug: '',
  title: '',
  category: 'Power Tools',
  excerpt: '',
  content: '',
  contentHtml: '',
  coverImage: '',
  bannerImage: '',
  author: 'Admin',
  authorRole: 'Admin',
  readMinutes: 5,
  tags: [],
  popularTags: [],
  galleryImages: [],
  quoteText: '',
  quoteAuthor: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
  isPublished: true,
};

const BlogAdminPanel: React.FC<Props> = ({ blogs, onSave, onDelete }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<BlogItem>(emptyBlog);
  const editorRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(() => blogs || [], [blogs]);

  const handleAddNew = () => {
    setForm(emptyBlog);
    setMode('add');
  };

  const handleEdit = (item: BlogItem) => {
    setForm({
      ...emptyBlog,
      ...item,
      tags: item.tags || [],
      popularTags: item.popularTags || [],
      galleryImages: item.galleryImages || [],
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : '',
    });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyBlog);
    setMode('list');
  };

  const exec = (command: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    setForm((prev) => ({ ...prev, contentHtml: editorRef.current?.innerHTML || '' }));
  };

  const uploadImage = async (file: File | null | undefined, field: keyof BlogItem) => {
    if (!file) return;
    try {
      const sign = await apiRequest('/admin/uploads/cloudinary-signature');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sign.apiKey);
      formData.append('timestamp', String(sign.timestamp));
      formData.append('signature', sign.signature);
      formData.append('folder', sign.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Cloudinary upload failed.');
      const payload = await response.json();

      setForm((prev) => ({ ...prev, [field]: payload.secure_url }));
      notifySuccess('Image uploaded.');
    } catch (error: any) {
      notifyError(error?.message || 'Image upload failed.');
    }
  };

  const updateArray = (key: 'tags' | 'popularTags' | 'galleryImages', index: number, value: string) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  };

  const addArray = (key: 'tags' | 'popularTags' | 'galleryImages') => {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), ''] }));
  };

  const removeArray = (key: 'tags' | 'popularTags' | 'galleryImages', index: number) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next.splice(index, 1);
      return { ...prev, [key]: next };
    });
  };

  const submitForm = async () => {
    const payload: BlogItem = {
      ...form,
      title: (form.title || '').trim(),
      slug: (form.slug || '').trim(),
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      tags: (form.tags || []).filter((item) => item.trim()),
      popularTags: (form.popularTags || []).filter((item) => item.trim()),
      galleryImages: (form.galleryImages || []).filter((item) => item.trim()),
    };

    if (!payload.title) {
      notifyError('Blog title is required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'Blog updated.' : 'Blog created.');
      setMode('list');
      setForm(emptyBlog);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save blog.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Blogs</h2>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 h-10 rounded-md bg-[#00A859] text-white px-4 text-[14px] font-semibold">
            <Plus className="w-4 h-4" />
            Add New Blog
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((item) => (
            <button key={item._id} onClick={() => handleEdit(item)} className="text-left rounded-xl border border-[#dce1e6] bg-white overflow-hidden hover:shadow-md transition-shadow">
              <img src={item.coverImage || item.bannerImage || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=700&q=80'} alt={item.title} className="w-full h-[160px] object-cover" />
              <div className="p-4">
                <p className="text-[12px] uppercase text-[#00A859] font-semibold mb-2">{item.category || 'Blog'}</p>
                <p className="text-[18px] text-[#1f2c3c] font-semibold mb-1 line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[#637180] line-clamp-2">{item.excerpt || 'No excerpt.'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{mode === 'add' ? 'Add New Blog' : 'Edit Blog'}</h2>
      <div className="grid grid-cols-1 gap-4" dir="ltr">
        <TextInput label="Blog Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
        <TextInput label="Blog Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
        <TextInput label="Category" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
        <Textarea label="Excerpt" value={form.excerpt} onChange={(value) => setForm((prev) => ({ ...prev, excerpt: value }))} />
        <Textarea label="Content" value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} />

        <SectionLabel>Content (Rich Text)</SectionLabel>
        <div className="rounded border border-[#d8dde3] overflow-hidden">
          <div className="flex items-center gap-2 p-2 border-b border-[#e4e9ef] bg-[#f8fafc]">
            <button type="button" onClick={() => exec('bold')} className="px-3 py-1 rounded border text-[13px]">B</button>
            <button type="button" onClick={() => exec('italic')} className="px-3 py-1 rounded border text-[13px] italic">I</button>
            <button type="button" onClick={() => exec('insertUnorderedList')} className="px-3 py-1 rounded border text-[13px]">• List</button>
            <button type="button" onClick={() => exec('insertOrderedList')} className="px-3 py-1 rounded border text-[13px]">1. List</button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setForm((prev) => ({ ...prev, contentHtml: (e.target as HTMLDivElement).innerHTML }))}
            dangerouslySetInnerHTML={{ __html: form.contentHtml || '' }}
            className="min-h-[180px] p-3 text-[14px] outline-none text-left"
            dir="ltr"
            style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
          />
        </div>

        <SectionLabel>Cover Image</SectionLabel>
        <ImageField value={form.coverImage} placeholder="Cover image URL" onChange={(value) => setForm((prev) => ({ ...prev, coverImage: value }))} onUpload={(file) => uploadImage(file, 'coverImage')} />
        <SectionLabel>Banner Image</SectionLabel>
        <ImageField value={form.bannerImage} placeholder="Banner image URL" onChange={(value) => setForm((prev) => ({ ...prev, bannerImage: value }))} onUpload={(file) => uploadImage(file, 'bannerImage')} />

        <TextInput label="Author" value={form.author} onChange={(value) => setForm((prev) => ({ ...prev, author: value }))} />
        <TextInput label="Author Role" value={form.authorRole} onChange={(value) => setForm((prev) => ({ ...prev, authorRole: value }))} />
        <NumberInput label="Read Minutes" value={form.readMinutes} onChange={(value) => setForm((prev) => ({ ...prev, readMinutes: value }))} />
        <TextInput label="Published At" value={form.publishedAt} onChange={(value) => setForm((prev) => ({ ...prev, publishedAt: value }))} type="datetime-local" />

        <SectionLabel>Tags</SectionLabel>
        <ArrayInput items={form.tags || []} onChange={(idx, value) => updateArray('tags', idx, value)} onAdd={() => addArray('tags')} onRemove={(idx) => removeArray('tags', idx)} placeholder="Tag" />
        <SectionLabel>Popular Tags</SectionLabel>
        <ArrayInput items={form.popularTags || []} onChange={(idx, value) => updateArray('popularTags', idx, value)} onAdd={() => addArray('popularTags')} onRemove={(idx) => removeArray('popularTags', idx)} placeholder="Popular tag" />
        <SectionLabel>Gallery Images</SectionLabel>
        <ArrayInput items={form.galleryImages || []} onChange={(idx, value) => updateArray('galleryImages', idx, value)} onAdd={() => addArray('galleryImages')} onRemove={(idx) => removeArray('galleryImages', idx)} placeholder="Gallery image URL" />

        <Textarea label="Quote Text" value={form.quoteText} onChange={(value) => setForm((prev) => ({ ...prev, quoteText: value }))} />
        <TextInput label="Quote Author" value={form.quoteAuthor} onChange={(value) => setForm((prev) => ({ ...prev, quoteAuthor: value }))} />
        <TextInput label="SEO Title" value={form.seoTitle} onChange={(value) => setForm((prev) => ({ ...prev, seoTitle: value }))} />
        <Textarea label="SEO Description" value={form.seoDescription} onChange={(value) => setForm((prev) => ({ ...prev, seoDescription: value }))} />

        <Toggle label="Published" checked={Boolean(form.isPublished)} onChange={(value) => setForm((prev) => ({ ...prev, isPublished: value }))} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={submitForm} className="h-10 rounded bg-[#00A859] text-white px-4 text-[14px] font-semibold">
          {mode === 'edit' ? 'Save Changes' : 'Save'}
        </button>
        <button onClick={handleCancel} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Cancel</button>
        {mode === 'edit' ? (
          <button onClick={handleAddNew} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Add New Blog</button>
        ) : null}
        {mode === 'edit' && form._id ? (
          <button
            onClick={() => onDelete(form._id as string).then(handleCancel).catch((err) => notifyError(err.message))}
            className="h-10 rounded bg-[#d64545] text-white px-4 text-[14px]"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] font-semibold text-[#1f2c3c] mt-2">{children}</p>
);

const TextInput: React.FC<{ label: string; value?: string; onChange: (value: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} type={type} className="h-11 rounded border border-[#d8dde3] px-3 w-full text-left" placeholder={label} dir="ltr" />
  </label>
);

const Textarea: React.FC<{ label: string; value?: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="min-h-[110px] rounded border border-[#d8dde3] px-3 py-2 w-full text-left" placeholder={label} dir="ltr" />
  </label>
);

const NumberInput: React.FC<{ label: string; value?: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className="h-11 rounded border border-[#d8dde3] px-3 w-full text-left" dir="ltr" />
  </label>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (value: boolean) => void }> = ({ label, checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f2c3c]">
    <span className={`w-8 h-5 rounded-full border flex items-center px-0.5 ${checked ? 'bg-[#00A859] border-[#00A859]' : 'bg-white border-[#cfd6de]'}`}>
      <span className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-3' : 'translate-x-0'}`} />
    </span>
    {label}
    {checked ? <Check className="w-4 h-4 text-[#00A859]" /> : null}
  </button>
);

const ImageField: React.FC<{
  value?: string;
  placeholder: string;
  onChange: (value: string) => void;
  onUpload: (file?: File | null) => void;
}> = ({ value, placeholder, onChange, onUpload }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="h-11 rounded border border-[#d8dde3] px-3 text-left" placeholder={placeholder} dir="ltr" />
    <label className="inline-flex items-center justify-center gap-2 h-11 rounded border border-[#d8dde3] px-4 text-[14px] cursor-pointer">
      <Upload className="w-4 h-4" />
      Upload
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
    </label>
  </div>
);

const ArrayInput: React.FC<{
  items: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}> = ({ items, placeholder, onChange, onAdd, onRemove }) => (
  <div className="space-y-2">
    {items.map((item, index) => (
      <div key={`${placeholder}-${index}`} className="grid grid-cols-[1fr_auto] gap-2 items-center">
        <input value={item} onChange={(e) => onChange(index, e.target.value)} className="h-11 rounded border border-[#d8dde3] px-3 text-left" placeholder={placeholder} dir="ltr" />
        <button type="button" onClick={() => onRemove(index)} className="w-10 h-10 rounded border border-[#d8dde3] grid place-items-center"><X className="w-4 h-4" /></button>
      </div>
    ))}
    <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 h-10 rounded border border-[#d8dde3] px-4 text-[13px]">
      <Plus className="w-4 h-4" />
      Add Field
    </button>
  </div>
);

export default BlogAdminPanel;
