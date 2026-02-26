import React, { useMemo, useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

type TestimonialItem = {
  _id?: string;
  name?: string;
  role?: string;
  rating?: number;
  image?: string;
  quote?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

type Props = {
  testimonials: TestimonialItem[];
  onSave: (payload: TestimonialItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyTestimonial: TestimonialItem = {
  name: '',
  role: '',
  rating: 5,
  image: '',
  quote: '',
  isPublished: true,
  sortOrder: 0,
};

const TestimonialsAdminPanel: React.FC<Props> = ({ testimonials, onSave, onDelete }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<TestimonialItem>(emptyTestimonial);

  const cards = useMemo(() => testimonials || [], [testimonials]);

  const handleAddNew = () => {
    setForm(emptyTestimonial);
    setMode('add');
  };

  const handleEdit = (item: TestimonialItem) => {
    setForm({ ...emptyTestimonial, ...item });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyTestimonial);
    setMode('list');
  };

  const uploadImage = async (file: File | null | undefined) => {
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
    const payload: TestimonialItem = {
      ...form,
      name: (form.name || '').trim(),
      role: (form.role || '').trim(),
      quote: (form.quote || '').trim(),
      rating: Number(form.rating || 0),
      sortOrder: Number(form.sortOrder || 0),
    };

    if (!payload.name) {
      notifyError('Client name is required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'Testimonial updated.' : 'Testimonial created.');
      setMode('list');
      setForm(emptyTestimonial);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save testimonial.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Testimonials</h3>
            <p className="text-sm text-slate-500">Manage client reviews shown on the home page.</p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Plus size={16} /> Add New Testimonial
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleEdit(item)}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-slate-100 overflow-hidden">
                  {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">“{item.quote}”</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <span>Rating: {item.rating || 0}</span>
                <span>•</span>
                <span>{item.isPublished ? 'Published' : 'Hidden'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{mode === 'edit' ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
        <p className="text-sm text-slate-500">Keep ratings, profile photo, and client role updated.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Client Name</label>
          <input
            value={form.name || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Dishes Cleaning"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Role</label>
          <input
            value={form.role || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Manager"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating ?? 5}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Sort Order</label>
          <input
            type="number"
            value={form.sortOrder ?? 0}
            onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">Client Quote</label>
        <textarea
          value={form.quote || ''}
          onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
          className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Profile Image URL</label>
          <input
            value={form.image || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Upload Profile Image</label>
          <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-100">
            <Upload size={16} /> Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submitForm}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Check size={16} /> {mode === 'edit' ? 'Save Changes' : 'Save'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <X size={16} /> Cancel
        </button>
        {mode === 'edit' && form._id ? (
          <button
            type="button"
            onClick={() => onDelete(form._id || '')}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            <X size={16} /> Delete
          </button>
        ) : null}
        {mode === 'edit' ? (
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            <Plus size={16} /> Add New Testimonial
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TestimonialsAdminPanel;
