import React, { useMemo, useState } from 'react';
import { Mail, Phone, User, X } from 'lucide-react';

type ContactItem = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

type Props = {
  contacts: ContactItem[];
};

type ViewMode = 'list' | 'detail';

const ContactsAdminPanel: React.FC<Props> = ({ contacts }) => {
  const [mode, setMode] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<ContactItem | null>(null);

  const cards = useMemo(() => contacts || [], [contacts]);

  const openDetail = (item: ContactItem) => {
    setSelected(item);
    setMode('detail');
  };

  const closeDetail = () => {
    setSelected(null);
    setMode('list');
  };

  if (mode === 'detail' && selected) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Contact Detail</h2>
          <button onClick={closeDetail} className="w-9 h-9 rounded-full border border-[#d9e2ec] grid place-items-center text-[#1f2c3c]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-[#dce1e6] bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Name" value={selected.name} icon={<User className="w-4 h-4" />} />
            <Detail label="Email" value={selected.email} icon={<Mail className="w-4 h-4" />} />
            <Detail label="Phone" value={selected.phone} icon={<Phone className="w-4 h-4" />} />
            <Detail label="Service" value={selected.service} />
            <Detail label="Status" value={selected.status} />
            <Detail label="Created" value={selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''} />
            <Detail label="Message" value={selected.message} full />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Contact Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((item) => (
          <button
            key={item._id}
            onClick={() => openDetail(item)}
            className="text-left rounded-xl border border-[#dce1e6] bg-white p-4 hover:shadow-md transition-shadow"
          >
            <p className="text-[16px] font-semibold text-[#1f2c3c] mb-1">{item.name || 'Contact'}</p>
            <p className="text-[13px] text-[#637180] mb-2">{item.email}</p>
            <p className="text-[12px] text-[#00A859] uppercase tracking-wide">{item.service || 'General'}</p>
            <p className="text-[12px] text-[#8a96a3] mt-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; value?: string; icon?: React.ReactNode; full?: boolean }> = ({ label, value, icon, full }) => (
  <div className={`${full ? 'md:col-span-2' : ''} rounded-lg border border-[#e7edf3] bg-[#f8fafc] p-3`}>
    <p className="text-[12px] text-[#607080] mb-1 inline-flex items-center gap-2">{icon}{label}</p>
    <p className="text-[14px] text-[#1f2c3c] break-words">{value || '-'}</p>
  </div>
);

export default ContactsAdminPanel;
