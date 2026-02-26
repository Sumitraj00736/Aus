import React, { useMemo, useRef, useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

type ProjectItem = {
  _id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  overviewText?: string;
  coverImage?: string;
  bannerImage?: string;
  completionDate?: string;
  clients?: string;
  location?: string;
  projectCategory?: string;
  overviewTitle?: string;
  galleryImages?: string[];
  benefitsTitle?: string;
  benefitsText?: string;
  benefitPoints?: string[];
  reviewTitle?: string;
  reviewQuote?: string;
  reviewAuthor?: string;
  previousProjectText?: string;
  sortOrder?: number;
  isPublished?: boolean;
  category?: string;
};

type Props = {
  projects: ProjectItem[];
  onSave: (payload: ProjectItem) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyProject: ProjectItem = {
  slug: '',
  title: '',
  excerpt: '',
  overviewText: '',
  coverImage: '',
  bannerImage: '',
  completionDate: '',
  clients: '',
  location: '',
  projectCategory: '',
  overviewTitle: '',
  galleryImages: [],
  benefitsTitle: '',
  benefitsText: '',
  benefitPoints: [],
  reviewTitle: '',
  reviewQuote: '',
  reviewAuthor: '',
  previousProjectText: '',
  sortOrder: 0,
  isPublished: true,
  category: 'Residential',
};

const ProjectsAdminPanel: React.FC<Props> = ({ projects, onSave }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<ProjectItem>(emptyProject);
  const editorRef = useRef<HTMLDivElement>(null);

  const projectCards = useMemo(() => projects || [], [projects]);

  const setEditorHtml = (html: string) => {
    setForm((prev) => ({ ...prev, overviewText: html }));
  };

  const handleAddNew = () => {
    setForm(emptyProject);
    setMode('add');
  };

  const handleEdit = (item: ProjectItem) => {
    setForm({
      ...emptyProject,
      ...item,
      overviewText: item.overviewText || item.excerpt || '',
      galleryImages: item.galleryImages || [],
      benefitPoints: item.benefitPoints || [],
    });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyProject);
    setMode('list');
  };

  const exec = (command: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    setEditorHtml(editorRef.current.innerHTML);
  };

  const uploadImage = async (file?: File | null) => {
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
      setForm((prev) => ({ ...prev, coverImage: payload.secure_url }));
      notifySuccess('Image uploaded.');
    } catch (error: any) {
      notifyError(error?.message || 'Image upload failed.');
    }
  };

  const uploadBanner = async (file?: File | null) => {
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
      setForm((prev) => ({ ...prev, bannerImage: payload.secure_url }));
      notifySuccess('Banner uploaded.');
    } catch (error: any) {
      notifyError(error?.message || 'Banner upload failed.');
    }
  };

  const updateArrayItem = (key: 'galleryImages' | 'benefitPoints', index: number, value: string) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  };

  const addArrayItem = (key: 'galleryImages' | 'benefitPoints') => {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), ''] }));
  };

  const removeArrayItem = (key: 'galleryImages' | 'benefitPoints', index: number) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next.splice(index, 1);
      return { ...prev, [key]: next };
    });
  };

  const submitForm = async () => {
    const descriptionHtml = form.overviewText || '';

    const payload: ProjectItem = {
      ...form,
      title: (form.title || '').trim(),
      excerpt: (form.excerpt || '').trim(),
      overviewText: descriptionHtml,
      galleryImages: (form.galleryImages || []).filter((item) => item.trim()),
      benefitPoints: (form.benefitPoints || []).filter((item) => item.trim()),
    };

    if (!payload.title) {
      notifyError('Project title is required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'Project updated.' : 'Project created.');
      setMode('list');
      setForm(emptyProject);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save project.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Projects</h2>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 h-10 rounded-md bg-[#00A859] text-white px-4 text-[14px] font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectCards.map((item) => (
            <button
              key={item._id}
              onClick={() => handleEdit(item)}
              className="text-left rounded-xl border border-[#dce1e6] bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={item.coverImage || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=700&q=80'}
                alt={item.title || 'Project'}
                className="w-full h-[160px] object-cover"
              />
              <div className="p-4">
                <p className="text-[18px] text-[#1f2c3c] font-semibold mb-1 line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[#637180] line-clamp-2">{item.excerpt || 'No short description.'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{mode === 'add' ? 'Add New Project' : 'Edit Project'}</h2>

      <div className="grid grid-cols-1 gap-4" dir="ltr">
        <TextInput label="Project Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
        <TextInput label="Project Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
        <TextInput label="Project Category" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
        <TextInput label="Project Short Description" value={form.excerpt} onChange={(value) => setForm((prev) => ({ ...prev, excerpt: value }))} />
        <TextInput label="Completion Date" value={form.completionDate} onChange={(value) => setForm((prev) => ({ ...prev, completionDate: value }))} />
        <TextInput label="Clients" value={form.clients} onChange={(value) => setForm((prev) => ({ ...prev, clients: value }))} />
        <TextInput label="Location" value={form.location} onChange={(value) => setForm((prev) => ({ ...prev, location: value }))} />
        <TextInput label="Project Category Label" value={form.projectCategory} onChange={(value) => setForm((prev) => ({ ...prev, projectCategory: value }))} />
        <TextInput label="Overview Title" value={form.overviewTitle} onChange={(value) => setForm((prev) => ({ ...prev, overviewTitle: value }))} />

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
            onInput={(e) => setEditorHtml((e.target as HTMLDivElement).innerHTML)}
            dangerouslySetInnerHTML={{ __html: form.overviewText || '' }}
            className="min-h-[180px] p-3 text-[14px] outline-none text-left"
            dir="ltr"
            style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
          />
        </div>

        <Textarea label="Benefits Description" value={form.benefitsText} onChange={(value) => setForm((prev) => ({ ...prev, benefitsText: value }))} />
        <TextInput label="Benefits Title" value={form.benefitsTitle} onChange={(value) => setForm((prev) => ({ ...prev, benefitsTitle: value }))} />
        <TextInput label="Review Title" value={form.reviewTitle} onChange={(value) => setForm((prev) => ({ ...prev, reviewTitle: value }))} />
        <Textarea label="Review Quote" value={form.reviewQuote} onChange={(value) => setForm((prev) => ({ ...prev, reviewQuote: value }))} />
        <TextInput label="Review Author" value={form.reviewAuthor} onChange={(value) => setForm((prev) => ({ ...prev, reviewAuthor: value }))} />
        <TextInput label="Previous Project Text" value={form.previousProjectText} onChange={(value) => setForm((prev) => ({ ...prev, previousProjectText: value }))} />
        <NumberInput label="Sort Order" value={form.sortOrder} onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: value }))} />

        <Toggle
          label="Published"
          checked={Boolean(form.isPublished)}
          onChange={(value) => setForm((prev) => ({ ...prev, isPublished: value }))}
        />

        <SectionLabel>Project Image / Thumbnail</SectionLabel>
        <ImageField
          value={form.coverImage}
          placeholder="Project image URL"
          onChange={(value) => setForm((prev) => ({ ...prev, coverImage: value }))}
          onUpload={(file) => uploadImage(file)}
        />

        <SectionLabel>Banner Image</SectionLabel>
        <ImageField
          value={form.bannerImage}
          placeholder="Banner image URL"
          onChange={(value) => setForm((prev) => ({ ...prev, bannerImage: value }))}
          onUpload={(file) => uploadBanner(file)}
        />

        <SectionLabel>Gallery Images</SectionLabel>
        <ArrayInput
          items={form.galleryImages || []}
          onChange={(idx, value) => updateArrayItem('galleryImages', idx, value)}
          onAdd={() => addArrayItem('galleryImages')}
          onRemove={(idx) => removeArrayItem('galleryImages', idx)}
          placeholder="Gallery image URL"
        />

        <SectionLabel>Benefit Points</SectionLabel>
        <ArrayInput
          items={form.benefitPoints || []}
          onChange={(idx, value) => updateArrayItem('benefitPoints', idx, value)}
          onAdd={() => addArrayItem('benefitPoints')}
          onRemove={(idx) => removeArrayItem('benefitPoints', idx)}
          placeholder="Benefit point"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={submitForm}
          className="h-10 rounded bg-[#00A859] text-white px-4 text-[14px] font-semibold"
        >
        {mode === 'edit' ? 'Save Changes' : 'Save'}
      </button>
        <button
          onClick={handleCancel}
          className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]"
        >
          Cancel
        </button>
        {mode === 'edit' ? (
          <button
            onClick={handleAddNew}
            className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]"
          >
            Add New Project
          </button>
        ) : null}
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] font-semibold text-[#1f2c3c] mt-2">{children}</p>
);

const TextInput: React.FC<{ label: string; value?: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded border border-[#d8dde3] px-3 w-full text-left"
      placeholder={label}
      dir="ltr"
    />
  </label>
);

const NumberInput: React.FC<{ label: string; value?: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <input
      type="number"
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 rounded border border-[#d8dde3] px-3 w-full text-left"
      dir="ltr"
    />
  </label>
);

const Textarea: React.FC<{ label: string; value?: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1">
    <span className="text-[13px] font-semibold text-[#1f2c3c]">{label}</span>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[110px] rounded border border-[#d8dde3] px-3 py-2 w-full text-left"
      placeholder={label}
      dir="ltr"
    />
  </label>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (value: boolean) => void }> = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f2c3c]"
  >
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
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded border border-[#d8dde3] px-3 text-left"
      placeholder={placeholder}
      dir="ltr"
    />
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
        <input
          value={item}
          onChange={(e) => onChange(index, e.target.value)}
          className="h-11 rounded border border-[#d8dde3] px-3 text-left"
          placeholder={placeholder}
          dir="ltr"
        />
        <button type="button" onClick={() => onRemove(index)} className="w-10 h-10 rounded border border-[#d8dde3] grid place-items-center">
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 h-10 rounded border border-[#d8dde3] px-4 text-[13px]">
      <Plus className="w-4 h-4" />
      Add Field
    </button>
  </div>
);

export default ProjectsAdminPanel;
