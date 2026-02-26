import React, { useMemo, useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

type HowItem = {
  _id?: string;
  step?: string;
  title?: string;
  text?: string;
  image?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

type Props = {
  items: HowItem[];
  onSave: (payload: HowItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyItem: HowItem = {
  step: '',
  title: '',
  text: '',
  image: '',
  sortOrder: 0,
  isPublished: true,
};

const HowItWorksAdminPanel: React.FC<Props> = ({ items, onSave, onDelete }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<HowItem>(emptyItem);

  const cards = useMemo(() => items || [], [items]);

  const handleAddNew = () => {
    setForm(emptyItem);
    setMode('add');
  };

  const handleEdit = (item: HowItem) => {
    setForm({ ...emptyItem, ...item });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyItem);
    setMode('list');
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
      setForm((prev) => ({ ...prev, image: payload.secure_url }));
      notifySuccess('Image uploaded.');
    } catch (error: any) {
      notifyError(error?.message || 'Image upload failed.');
    }
  };

  const submitForm = async () => {
    const payload: HowItem = {
      ...form,
      title: (form.title || '').trim(),
    };

    if (!payload.title) {
      notifyError('Title is required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'Card updated.' : 'Card created.');
      setMode('list');
      setForm(emptyItem);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save card.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">How It Works</h2>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 h-10 rounded-md bg-[#00A859] text-white px-4 text-[14px] font-semibold">
            <Plus className="w-4 h-4" />
            Add New Step
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((item) => (
            <button key={item._id} onClick={() => handleEdit(item)} className="text-left rounded-xl border border-[#dce1e6] bg-white overflow-hidden hover:shadow-md transition-shadow">
              <img src={item.image || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=700&q=80'} alt={item.title} className="w-full h-[160px] object-cover" />
              <div className="p-4">
                <p className="text-[12px] text-[#00A859] font-semibold mb-2">Step {item.step}</p>
                <p className="text-[18px] text-[#1f2c3c] font-semibold mb-1 line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[#637180] line-clamp-2">{item.text || 'No description.'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{mode === 'add' ? 'Add New Step' : 'Edit Step'}</h2>
      <div className="grid grid-cols-1 gap-4" dir="ltr">
        <TextInput label="Step" value={form.step} onChange={(value) => setForm((prev) => ({ ...prev, step: value }))} />
        <TextInput label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
        <Textarea label="Text" value={form.text} onChange={(value) => setForm((prev) => ({ ...prev, text: value }))} />

        <SectionLabel>Image</SectionLabel>
        <ImageField value={form.image} placeholder="Image URL" onChange={(value) => setForm((prev) => ({ ...prev, image: value }))} onUpload={(file) => uploadImage(file)} />

        <NumberInput label="Sort Order" value={form.sortOrder} onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: value }))} />
        <Toggle label="Published" checked={Boolean(form.isPublished)} onChange={(value) => setForm((prev) => ({ ...prev, isPublished: value }))} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={submitForm} className="h-10 rounded bg-[#00A859] text-white px-4 text-[14px] font-semibold">
          {mode === 'edit' ? 'Save Changes' : 'Save'}
        </button>
        <button onClick={handleCancel} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Cancel</button>
        {mode === 'edit' ? (
          <button onClick={handleAddNew} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Add New Step</button>
        ) : null}
        {mode === 'edit' && form._id ? (
          <button onClick={() => onDelete(form._id as string).then(handleCancel).catch((err) => notifyError(err.message))} className="h-10 rounded bg-[#d64545] text-white px-4 text-[14px]">Delete</button>
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
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="h-11 rounded border border-[#d8dde3] px-3 w-full text-left" placeholder={label} dir="ltr" />
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

export default HowItWorksAdminPanel;
