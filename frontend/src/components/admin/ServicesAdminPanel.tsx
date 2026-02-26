import React, { useMemo, useRef, useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

type ServiceItem = {
  _id?: string;
  slug?: string;
  title?: string;
  shortDescription?: string;
  heroImage?: string;
  cardImage?: string;
  detailImage?: string;
  aboutImages?: string[];
  detailIntro?: string;
  detailBody?: string;
  aboutSectionTitle?: string;
  aboutSectionDescription?: string;
  aboutBullets?: { title?: string; description?: string; iconImage?: string }[];
  helpCard?: { title?: string; phone?: string; email?: string; image?: string };
  features?: string[];
  checklist?: string[];
  faqs?: { question?: string; answer?: string }[];
  isPublished?: boolean;
  sortOrder?: number;
};

type Props = {
  services: ServiceItem[];
  onSave: (payload: ServiceItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyService: ServiceItem = {
  slug: '',
  title: '',
  shortDescription: '',
  heroImage: '',
  cardImage: '',
  detailImage: '',
  aboutImages: [],
  detailIntro: '',
  detailBody: '',
  aboutSectionTitle: 'About The Service',
  aboutSectionDescription: '',
  aboutBullets: [],
  helpCard: { title: 'Do You Need Help?', phone: '+(084) 456-0789', email: 'support@example.com', image: '' },
  features: [],
  checklist: [],
  faqs: [],
  isPublished: true,
  sortOrder: 0,
};

const ServicesAdminPanel: React.FC<Props> = ({ services, onSave, onDelete }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<ServiceItem>(emptyService);
  const editorRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(() => services || [], [services]);

  const handleAddNew = () => {
    setForm(emptyService);
    setMode('add');
  };

  const handleEdit = (item: ServiceItem) => {
    setForm({
      ...emptyService,
      ...item,
      aboutImages: item.aboutImages || [],
      features: item.features || [],
      checklist: item.checklist || [],
      aboutBullets: item.aboutBullets || [],
      faqs: item.faqs || [],
      helpCard: item.helpCard || emptyService.helpCard,
    });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyService);
    setMode('list');
  };

  const exec = (command: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    setForm((prev) => ({ ...prev, detailBody: editorRef.current?.innerHTML || '' }));
  };

  const uploadImage = async (file: File | null | undefined, field: keyof ServiceItem | 'helpCard.image') => {
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

      if (field === 'helpCard.image') {
        setForm((prev) => ({ ...prev, helpCard: { ...(prev.helpCard || {}), image: payload.secure_url } }));
      } else {
        setForm((prev) => ({ ...prev, [field]: payload.secure_url }));
      }

      notifySuccess('Image uploaded.');
    } catch (error: any) {
      notifyError(error?.message || 'Image upload failed.');
    }
  };

  const updateArray = (key: 'aboutImages' | 'features' | 'checklist', index: number, value: string) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  };

  const addArray = (key: 'aboutImages' | 'features' | 'checklist') => {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), ''] }));
  };

  const removeArray = (key: 'aboutImages' | 'features' | 'checklist', index: number) => {
    setForm((prev) => {
      const next = [...(prev[key] || [])];
      next.splice(index, 1);
      return { ...prev, [key]: next };
    });
  };

  const updateBullet = (index: number, field: 'title' | 'description' | 'iconImage', value: string) => {
    setForm((prev) => {
      const next = [...(prev.aboutBullets || [])];
      next[index] = { ...(next[index] || {}), [field]: value };
      return { ...prev, aboutBullets: next };
    });
  };

  const addBullet = () => setForm((prev) => ({ ...prev, aboutBullets: [...(prev.aboutBullets || []), {}] }));
  const removeBullet = (index: number) =>
    setForm((prev) => {
      const next = [...(prev.aboutBullets || [])];
      next.splice(index, 1);
      return { ...prev, aboutBullets: next };
    });

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setForm((prev) => {
      const next = [...(prev.faqs || [])];
      next[index] = { ...(next[index] || {}), [field]: value };
      return { ...prev, faqs: next };
    });
  };

  const addFaq = () => setForm((prev) => ({ ...prev, faqs: [...(prev.faqs || []), {}] }));
  const removeFaq = (index: number) =>
    setForm((prev) => {
      const next = [...(prev.faqs || [])];
      next.splice(index, 1);
      return { ...prev, faqs: next };
    });

  const submitForm = async () => {
    const payload: ServiceItem = {
      ...form,
      title: (form.title || '').trim(),
      slug: (form.slug || '').trim(),
    };

    if (!payload.title) {
      notifyError('Service title is required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'Service updated.' : 'Service created.');
      setMode('list');
      setForm(emptyService);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save service.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Services</h2>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 h-10 rounded-md bg-[#00A859] text-white px-4 text-[14px] font-semibold">
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((item) => (
            <button key={item._id} onClick={() => handleEdit(item)} className="text-left rounded-xl border border-[#dce1e6] bg-white overflow-hidden hover:shadow-md transition-shadow">
              <img src={item.cardImage || item.heroImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80'} alt={item.title} className="w-full h-[160px] object-cover" />
              <div className="p-4">
                <p className="text-[18px] text-[#1f2c3c] font-semibold mb-1 line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[#637180] line-clamp-2">{item.shortDescription || 'No short description.'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{mode === 'add' ? 'Add New Service' : 'Edit Service'}</h2>
      <div className="grid grid-cols-1 gap-4" dir="ltr">
        <TextInput label="Service Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
        <TextInput label="Service Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
        <Textarea label="Short Description" value={form.shortDescription} onChange={(value) => setForm((prev) => ({ ...prev, shortDescription: value }))} />

        <SectionLabel>Hero Image</SectionLabel>
        <ImageField value={form.heroImage} placeholder="Hero image URL" onChange={(value) => setForm((prev) => ({ ...prev, heroImage: value }))} onUpload={(file) => uploadImage(file, 'heroImage')} />
        <SectionLabel>Card Image</SectionLabel>
        <ImageField value={form.cardImage} placeholder="Card image URL" onChange={(value) => setForm((prev) => ({ ...prev, cardImage: value }))} onUpload={(file) => uploadImage(file, 'cardImage')} />
        <SectionLabel>Detail Image</SectionLabel>
        <ImageField value={form.detailImage} placeholder="Detail image URL" onChange={(value) => setForm((prev) => ({ ...prev, detailImage: value }))} onUpload={(file) => uploadImage(file, 'detailImage')} />

        <SectionLabel>About Images</SectionLabel>
        <ArrayInput items={form.aboutImages || []} onChange={(idx, value) => updateArray('aboutImages', idx, value)} onAdd={() => addArray('aboutImages')} onRemove={(idx) => removeArray('aboutImages', idx)} placeholder="About image URL" />

        <TextInput label="About Section Title" value={form.aboutSectionTitle} onChange={(value) => setForm((prev) => ({ ...prev, aboutSectionTitle: value }))} />
        <Textarea label="About Section Description" value={form.aboutSectionDescription} onChange={(value) => setForm((prev) => ({ ...prev, aboutSectionDescription: value }))} />
        <Textarea label="Detail Intro" value={form.detailIntro} onChange={(value) => setForm((prev) => ({ ...prev, detailIntro: value }))} />

        <SectionLabel>Detail Body (Rich Text)</SectionLabel>
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
            onInput={(e) => setForm((prev) => ({ ...prev, detailBody: (e.target as HTMLDivElement).innerHTML }))}
            dangerouslySetInnerHTML={{ __html: form.detailBody || '' }}
            className="min-h-[180px] p-3 text-[14px] outline-none text-left"
            dir="ltr"
            style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
          />
        </div>

        <SectionLabel>Why Choose Us Bullets</SectionLabel>
        <div className="space-y-3">
          {(form.aboutBullets || []).map((bullet, idx) => (
            <div key={`bullet-${idx}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <input className="h-10 rounded border border-[#d8dde3] px-3" placeholder="Title" value={bullet.title || ''} onChange={(e) => updateBullet(idx, 'title', e.target.value)} />
              <input className="h-10 rounded border border-[#d8dde3] px-3" placeholder="Description" value={bullet.description || ''} onChange={(e) => updateBullet(idx, 'description', e.target.value)} />
              <input className="h-10 rounded border border-[#d8dde3] px-3" placeholder="Icon Image URL" value={bullet.iconImage || ''} onChange={(e) => updateBullet(idx, 'iconImage', e.target.value)} />
              <button type="button" onClick={() => removeBullet(idx)} className="w-10 h-10 rounded border border-[#d8dde3] grid place-items-center"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={addBullet} className="inline-flex items-center gap-2 h-10 rounded border border-[#d8dde3] px-4 text-[13px]">
            <Plus className="w-4 h-4" />
            Add Bullet
          </button>
        </div>

        <SectionLabel>Help Card</SectionLabel>
        <TextInput label="Help Title" value={form.helpCard?.title} onChange={(value) => setForm((prev) => ({ ...prev, helpCard: { ...(prev.helpCard || {}), title: value } }))} />
        <TextInput label="Help Phone" value={form.helpCard?.phone} onChange={(value) => setForm((prev) => ({ ...prev, helpCard: { ...(prev.helpCard || {}), phone: value } }))} />
        <TextInput label="Help Email" value={form.helpCard?.email} onChange={(value) => setForm((prev) => ({ ...prev, helpCard: { ...(prev.helpCard || {}), email: value } }))} />
        <ImageField value={form.helpCard?.image} placeholder="Help image URL" onChange={(value) => setForm((prev) => ({ ...prev, helpCard: { ...(prev.helpCard || {}), image: value } }))} onUpload={(file) => uploadImage(file, 'helpCard.image')} />

        <SectionLabel>Features</SectionLabel>
        <ArrayInput items={form.features || []} onChange={(idx, value) => updateArray('features', idx, value)} onAdd={() => addArray('features')} onRemove={(idx) => removeArray('features', idx)} placeholder="Feature" />

        <SectionLabel>Checklist</SectionLabel>
        <ArrayInput items={form.checklist || []} onChange={(idx, value) => updateArray('checklist', idx, value)} onAdd={() => addArray('checklist')} onRemove={(idx) => removeArray('checklist', idx)} placeholder="Checklist item" />

        <SectionLabel>Service FAQs</SectionLabel>
        <div className="space-y-3">
          {(form.faqs || []).map((faq, idx) => (
            <div key={`faq-${idx}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input className="h-10 rounded border border-[#d8dde3] px-3" placeholder="Question" value={faq.question || ''} onChange={(e) => updateFaq(idx, 'question', e.target.value)} />
              <input className="h-10 rounded border border-[#d8dde3] px-3" placeholder="Answer" value={faq.answer || ''} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} />
              <button type="button" onClick={() => removeFaq(idx)} className="w-10 h-10 rounded border border-[#d8dde3] grid place-items-center"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={addFaq} className="inline-flex items-center gap-2 h-10 rounded border border-[#d8dde3] px-4 text-[13px]">
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        <NumberInput label="Sort Order" value={form.sortOrder} onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: value }))} />
        <Toggle label="Published" checked={Boolean(form.isPublished)} onChange={(value) => setForm((prev) => ({ ...prev, isPublished: value }))} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={submitForm} className="h-10 rounded bg-[#00A859] text-white px-4 text-[14px] font-semibold">
          {mode === 'edit' ? 'Save Changes' : 'Save'}
        </button>
        <button onClick={handleCancel} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Cancel</button>
        {mode === 'edit' ? (
          <button onClick={handleAddNew} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Add New Service</button>
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

export default ServicesAdminPanel;
