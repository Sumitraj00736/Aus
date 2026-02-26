import React, { useMemo, useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { notifyError, notifySuccess } from '../../lib/toast';

type FaqItem = {
  _id?: string;
  pageKey?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

type Props = {
  faqs: FaqItem[];
  onSave: (payload: FaqItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type ViewMode = 'list' | 'add' | 'edit';

const emptyFaq: FaqItem = {
  pageKey: 'home',
  question: '',
  answer: '',
  sortOrder: 0,
  isPublished: true,
};

const FaqsAdminPanel: React.FC<Props> = ({ faqs, onSave, onDelete }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<FaqItem>(emptyFaq);

  const cards = useMemo(() => faqs || [], [faqs]);

  const handleAddNew = () => {
    setForm(emptyFaq);
    setMode('add');
  };

  const handleEdit = (item: FaqItem) => {
    setForm({ ...emptyFaq, ...item });
    setMode('edit');
  };

  const handleCancel = () => {
    setForm(emptyFaq);
    setMode('list');
  };

  const submitForm = async () => {
    const payload: FaqItem = {
      ...form,
      question: (form.question || '').trim(),
      answer: (form.answer || '').trim(),
      pageKey: (form.pageKey || 'home').trim(),
    };

    if (!payload.question || !payload.answer) {
      notifyError('Question and answer are required.');
      return;
    }

    try {
      await onSave(payload);
      notifySuccess(mode === 'edit' ? 'FAQ updated.' : 'FAQ created.');
      setMode('list');
      setForm(emptyFaq);
    } catch (error: any) {
      notifyError(error?.message || 'Unable to save FAQ.');
    }
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">FAQs</h2>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 h-10 rounded-md bg-[#00A859] text-white px-4 text-[14px] font-semibold">
            <Plus className="w-4 h-4" />
            Add New FAQ
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((item) => (
            <button key={item._id} onClick={() => handleEdit(item)} className="text-left rounded-xl border border-[#dce1e6] bg-white p-4 hover:shadow-md transition-shadow">
              <p className="text-[12px] text-[#00A859] font-semibold uppercase mb-2">{item.pageKey}</p>
              <p className="text-[16px] text-[#1f2c3c] font-semibold mb-2 line-clamp-2">{item.question}</p>
              <p className="text-[13px] text-[#637180] line-clamp-2">{item.answer}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{mode === 'add' ? 'Add New FAQ' : 'Edit FAQ'}</h2>
      <div className="grid grid-cols-1 gap-4" dir="ltr">
        <TextInput label="Page Key" value={form.pageKey} onChange={(value) => setForm((prev) => ({ ...prev, pageKey: value }))} />
        <TextInput label="Question" value={form.question} onChange={(value) => setForm((prev) => ({ ...prev, question: value }))} />
        <Textarea label="Answer" value={form.answer} onChange={(value) => setForm((prev) => ({ ...prev, answer: value }))} />
        <NumberInput label="Sort Order" value={form.sortOrder} onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: value }))} />
        <Toggle label="Published" checked={Boolean(form.isPublished)} onChange={(value) => setForm((prev) => ({ ...prev, isPublished: value }))} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={submitForm} className="h-10 rounded bg-[#00A859] text-white px-4 text-[14px] font-semibold">
          {mode === 'edit' ? 'Save Changes' : 'Save'}
        </button>
        <button onClick={handleCancel} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Cancel</button>
        {mode === 'edit' ? (
          <button onClick={handleAddNew} className="h-10 rounded border border-[#d8dde3] px-4 text-[14px] text-[#1f2c3c]">Add New FAQ</button>
        ) : null}
        {mode === 'edit' && form._id ? (
          <button onClick={() => onDelete(form._id as string).then(handleCancel).catch((err) => notifyError(err.message))} className="h-10 rounded bg-[#d64545] text-white px-4 text-[14px]">Delete</button>
        ) : null}
      </div>
    </div>
  );
};

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

export default FaqsAdminPanel;
