import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE, apiRequest } from '../../lib/api';

type TabKey = 'overview' | 'settings' | 'pages' | 'services' | 'blogs' | 'contacts' | 'bookings' | 'notifications';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Theme & Site' },
  { key: 'pages', label: 'Pages' },
  { key: 'services', label: 'Services' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'notifications', label: 'Notifications' },
];

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedPageKey, setSelectedPageKey] = useState('home');
  const [saving, setSaving] = useState(false);

  const selectedPage = useMemo(() => pages.find((page) => page.pageKey === selectedPageKey), [pages, selectedPageKey]);

  const fetchAll = async () => {
    const [
      statsData,
      settingsData,
      pagesData,
      servicesData,
      blogsData,
      contactsData,
      bookingsData,
      notificationsData,
    ] = await Promise.all([
      apiRequest('/admin/stats'),
      apiRequest('/admin/settings'),
      apiRequest('/admin/pages'),
      apiRequest('/admin/services'),
      apiRequest('/admin/blogs'),
      apiRequest('/admin/contacts'),
      apiRequest('/admin/bookings'),
      apiRequest('/admin/notifications'),
    ]);

    setStats(statsData);
    setSettings(settingsData);
    setPages(pagesData);
    setServices(servicesData);
    setBlogs(blogsData);
    setContacts(contactsData);
    setBookings(bookingsData);
    setNotifications(notificationsData);
  };

  useEffect(() => {
    fetchAll().catch(console.error);

    const socket: Socket = io(API_BASE.replace('/api', ''), {
      transports: ['websocket'],
    });

    socket.on('admin:notification', (payload) => {
      setNotifications((prev) => [payload, ...prev]);
      setStats((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          totals: {
            ...prev.totals,
            notifications: (prev.totals.notifications || 0) + 1,
            unreadNotifications: (prev.totals.unreadNotifications || 0) + 1,
          },
        };
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user_name');
    window.location.href = '/admin/login';
  };

  const updateSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      setSettings(updated);
      alert('Settings saved.');
    } finally {
      setSaving(false);
    }
  };

  const updatePageContent = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const updated = await apiRequest(`/admin/pages/${selectedPage.pageKey}`, {
        method: 'PUT',
        body: JSON.stringify(selectedPage),
      });
      setPages((prev) => prev.map((page) => (page.pageKey === updated.pageKey ? updated : page)));
      alert('Page content saved.');
    } finally {
      setSaving(false);
    }
  };

  const onServiceSave = async (service: any) => {
    const hasId = Boolean(service._id);
    const saved = await apiRequest(hasId ? `/admin/services/${service._id}` : '/admin/services', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(service),
    });
    setServices((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  const onBlogSave = async (blog: any) => {
    const hasId = Boolean(blog._id);
    const saved = await apiRequest(hasId ? `/admin/blogs/${blog._id}` : '/admin/blogs', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(blog),
    });
    setBlogs((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8]">
      <header className="bg-[#1f2c3c] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold">Website Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] opacity-85">{localStorage.getItem('admin_user_name') || 'Admin'}</span>
          <button onClick={logout} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-[13px]">Logout</button>
        </div>
      </header>

      <div className="page-container max-w-[1380px] py-8 grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white rounded-xl border border-[#dce1e6] p-3 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] mb-1 ${
                activeTab === tab.key ? 'bg-[#00A859] text-white' : 'hover:bg-[#f2f4f7] text-[#1f2c3c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="bg-white rounded-xl border border-[#dce1e6] p-6 overflow-hidden">
          {activeTab === 'overview' && stats ? (
            <div>
              <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-5">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
                {Object.entries(stats.totals || {}).map(([key, value]) => (
                  <article key={key} className="rounded-lg bg-[#f4f6f8] border border-[#e1e6eb] p-4">
                    <p className="text-[12px] uppercase text-[#617180] mb-1">{key}</p>
                    <p className="text-[24px] font-semibold text-[#1f2c3c]">{String(value)}</p>
                  </article>
                ))}
              </div>
              <p className="text-[13px] text-[#6a7684]">Live notifications update automatically using Socket.IO.</p>
            </div>
          ) : null}

          {activeTab === 'settings' && settings ? (
            <div className="space-y-5">
              <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Theme & Site Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Site name" />
                <input value={settings.contact?.phone || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Phone" />
                <input value={settings.contact?.email || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Email" />
                <input value={settings.theme?.primary || ''} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primary: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Primary color hex" />
              </div>
              <button disabled={saving} onClick={updateSettings} className="px-5 py-2 rounded bg-[#00A859] text-white text-[14px]">{saving ? 'Saving...' : 'Save Settings'}</button>
            </div>
          ) : null}

          {activeTab === 'pages' ? (
            <div className="space-y-4">
              <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Page Content</h2>
              <select value={selectedPageKey} onChange={(e) => setSelectedPageKey(e.target.value)} className="h-11 rounded border border-[#d8dde3] px-3">
                {pages.map((page) => <option key={page.pageKey} value={page.pageKey}>{page.pageKey}</option>)}
              </select>
              {selectedPage ? (
                <div className="space-y-3">
                  <input value={selectedPage.title || ''} onChange={(e) => setPages((prev) => prev.map((page) => page.pageKey === selectedPage.pageKey ? { ...page, title: e.target.value } : page))} className="w-full h-11 rounded border border-[#d8dde3] px-3" placeholder="Title" />
                  <input value={selectedPage.subtitle || ''} onChange={(e) => setPages((prev) => prev.map((page) => page.pageKey === selectedPage.pageKey ? { ...page, subtitle: e.target.value } : page))} className="w-full h-11 rounded border border-[#d8dde3] px-3" placeholder="Subtitle" />
                  <input value={selectedPage.bannerImage || ''} onChange={(e) => setPages((prev) => prev.map((page) => page.pageKey === selectedPage.pageKey ? { ...page, bannerImage: e.target.value } : page))} className="w-full h-11 rounded border border-[#d8dde3] px-3" placeholder="Banner image URL" />
                  <button disabled={saving} onClick={updatePageContent} className="px-5 py-2 rounded bg-[#00A859] text-white text-[14px]">{saving ? 'Saving...' : 'Save Page'}</button>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'services' ? (
            <CrudList
              title="Services"
              items={services}
              newItem={{ title: '', slug: '', shortDescription: '', heroImage: '', cardImage: '', detailImage: '', detailIntro: '', detailBody: '' }}
              fields={['title', 'slug', 'shortDescription', 'heroImage', 'cardImage', 'detailImage', 'detailIntro', 'detailBody']}
              onSave={onServiceSave}
            />
          ) : null}

          {activeTab === 'blogs' ? (
            <CrudList
              title="Blog Posts"
              items={blogs}
              newItem={{ title: '', slug: '', excerpt: '', content: '', coverImage: '', bannerImage: '', tags: [] }}
              fields={['title', 'slug', 'excerpt', 'content', 'coverImage', 'bannerImage']}
              onSave={onBlogSave}
            />
          ) : null}

          {activeTab === 'contacts' ? <DataTable title="Contact Submissions" rows={contacts} /> : null}
          {activeTab === 'bookings' ? <DataTable title="Bookings" rows={bookings} /> : null}
          {activeTab === 'notifications' ? <DataTable title="Notifications" rows={notifications} /> : null}
        </main>
      </div>
    </div>
  );
};

const CrudList: React.FC<{
  title: string;
  items: any[];
  newItem: any;
  fields: string[];
  onSave: (item: any) => Promise<void>;
}> = ({ title, items, newItem, fields, onSave }) => {
  const [draft, setDraft] = useState<any>(newItem);
  const [selectedId, setSelectedId] = useState<string>('new');
  const current = selectedId === 'new' ? draft : items.find((item) => item._id === selectedId) || draft;

  const updateCurrent = (field: string, value: string) => {
    if (selectedId === 'new') {
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      return;
    }
    const target = items.find((item) => item._id === selectedId);
    if (!target) return;
    target[field] = value;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">{title}</h2>
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="h-11 rounded border border-[#d8dde3] px-3">
        <option value="new">Create New</option>
        {items.map((item) => (
          <option key={item._id} value={item._id}>{item.title || item.slug || item._id}</option>
        ))}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((field) => (
          <input
            key={field}
            value={current?.[field] || ''}
            onChange={(e) => updateCurrent(field, e.target.value)}
            className="h-11 rounded border border-[#d8dde3] px-3"
            placeholder={field}
          />
        ))}
      </div>
      <button
        onClick={() => onSave(current).catch((err) => alert(err.message))}
        className="px-5 py-2 rounded bg-[#00A859] text-white text-[14px]"
      >
        Save
      </button>
    </div>
  );
};

const DataTable: React.FC<{ title: string; rows: any[] }> = ({ title, rows }) => (
  <div>
    <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-4">{title}</h2>
    <div className="overflow-auto border border-[#dce1e6] rounded-lg">
      <table className="min-w-full text-left text-[13px]">
        <thead className="bg-[#f3f5f8] text-[#5d6c7a]">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Type/Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t border-[#edf0f3]">
              <td className="px-3 py-2">{row._id?.slice(-6)}</td>
              <td className="px-3 py-2">{row.title || row.name || row.type || row.slug || '-'}</td>
              <td className="px-3 py-2">{row.email || '-'}</td>
              <td className="px-3 py-2">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboardPage;
