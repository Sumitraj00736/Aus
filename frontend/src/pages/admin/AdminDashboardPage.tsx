import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { API_BASE, apiRequest } from '../../lib/api';

type TabKey = 'overview' | 'settings' | 'pages' | 'services' | 'blogs' | 'howItWorks' | 'faqs' | 'blogMessages' | 'contacts' | 'bookings' | 'notifications';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Theme & Site' },
  { key: 'pages', label: 'Pages' },
  { key: 'services', label: 'Services' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'howItWorks', label: 'How It Works' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'blogMessages', label: 'Blog Messages' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'notifications', label: 'Notifications' },
];

type ToastItem = {
  id: string;
  title: string;
  message: string;
};

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [howItWorks, setHowItWorks] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [blogMessages, setBlogMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedPageKey, setSelectedPageKey] = useState('home');
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const selectedPage = useMemo(() => pages.find((page) => page.pageKey === selectedPageKey), [pages, selectedPageKey]);
  const unreadCount = stats?.totals?.unreadNotifications || 0;

  const pushToast = (title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [{ id, title, message }, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3800);
  };

  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
      osc.onended = () => {
        ctx.close().catch(() => undefined);
      };
    } catch {
      // ignore browser autoplay/audio restrictions
    }
  };

  const fetchAll = async () => {
    const [
      statsData,
      settingsData,
      pagesData,
      servicesData,
      blogsData,
      howItWorksData,
      faqsData,
      blogMessagesData,
      contactsData,
      bookingsData,
      notificationsData,
    ] = await Promise.all([
      apiRequest('/admin/stats'),
      apiRequest('/admin/settings'),
      apiRequest('/admin/pages'),
      apiRequest('/admin/services'),
      apiRequest('/admin/blogs'),
      apiRequest('/admin/how-it-works'),
      apiRequest('/admin/faqs'),
      apiRequest('/admin/blog-messages'),
      apiRequest('/admin/contacts'),
      apiRequest('/admin/bookings'),
      apiRequest('/admin/notifications'),
    ]);

    setStats(statsData);
    setSettings(settingsData);
    setPages(pagesData);
    setServices(servicesData);
    setBlogs(blogsData);
    setHowItWorks(howItWorksData);
    setFaqs(faqsData);
    setBlogMessages(blogMessagesData);
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
      pushToast(payload?.title || 'New Notification', payload?.message || 'New update received');
      playNotificationSound();
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

    socket.on('admin:blog-message', (payload) => {
      if (!payload) return;
      const row = payload.message || payload;
      if (!row?._id) return;
      pushToast('New Blog Message', `${row.name || 'A user'} posted a message`);
      playNotificationSound();
      setBlogMessages((prev) => {
        const without = prev.filter((item) => item._id !== row._id);
        return [row, ...without];
      });
      setStats((prev: any) => {
        if (!prev?.totals) return prev;
        return {
          ...prev,
          totals: {
            ...prev.totals,
            blogMessages: payload.type === 'blog-message-updated' ? prev.totals.blogMessages : (prev.totals.blogMessages || 0) + 1,
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

  const onHowSave = async (card: any) => {
    const hasId = Boolean(card._id);
    const saved = await apiRequest(hasId ? `/admin/how-it-works/${card._id}` : '/admin/how-it-works', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(card),
    });
    setHowItWorks((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  const onFaqSave = async (faq: any) => {
    const hasId = Boolean(faq._id);
    const saved = await apiRequest(hasId ? `/admin/faqs/${faq._id}` : '/admin/faqs', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(faq),
    });
    setFaqs((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  const markNotificationRead = async (id: string) => {
    const updated = await apiRequest(`/admin/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((item) => (item._id === id ? updated : item)));
    setStats((prev: any) => {
      if (!prev?.totals) return prev;
      return {
        ...prev,
        totals: {
          ...prev.totals,
          unreadNotifications: Math.max((prev.totals.unreadNotifications || 1) - 1, 0),
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <header className="sticky top-0 z-40 border-b border-[#d7dee7] bg-white">
        <div className="h-[70px] px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="xl:hidden w-9 h-9 rounded-md border border-[#d6dde6] grid place-items-center text-[#1f2c3c]"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden xl:flex items-center gap-2 text-[#1f2c3c]">
              <LayoutDashboard className="w-5 h-5" />
              <h1 className="text-[18px] font-semibold">Admin Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setNotifPanelOpen((prev) => !prev)}
              className="relative w-10 h-10 rounded-full border border-[#d6dde6] grid place-items-center text-[#1f2c3c] hover:bg-[#f5f8fc]"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#00A859] text-white text-[11px] leading-[18px] px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>
            <span className="text-[13px] text-[#4f5f70]">{localStorage.getItem('admin_user_name') || 'Admin'}</span>
            <button onClick={logout} className="bg-[#1f2c3c] hover:bg-[#00A859] px-3 py-2 rounded-md text-[13px] text-white">
              Logout
            </button>

            {notifPanelOpen ? (
              <div className="absolute right-0 top-[50px] w-[320px] rounded-xl border border-[#d7dee7] bg-white shadow-xl p-3">
                <p className="text-[13px] font-semibold text-[#1f2c3c] mb-2">Notifications</p>
                <div className="max-h-[280px] overflow-auto space-y-2">
                  {notifications.slice(0, 8).map((item) => (
                    <article key={item._id || item.id} className="rounded-lg border border-[#e4e9ef] p-2">
                      <p className="text-[12px] font-semibold text-[#1f2c3c]">{item.title || item.type || 'Notification'}</p>
                      <p className="text-[12px] text-[#5b6a78]">{item.message || '-'}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[11px] ${item.isRead ? 'text-[#7f8b97]' : 'text-[#00A859] font-semibold'}`}>
                          {item.isRead ? 'Read' : 'Unread'}
                        </span>
                        {!item.isRead ? (
                          <button
                            onClick={() => markNotificationRead(item._id).catch(() => undefined)}
                            className="text-[11px] px-2 py-1 rounded bg-[#e8f8ef] text-[#009650]"
                          >
                            Mark as read
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen ? (
          <button
            onClick={() => setSidebarOpen(false)}
            className="xl:hidden fixed inset-0 bg-black/40 z-30"
            aria-label="Close sidebar backdrop"
          />
        ) : null}

        <aside
          className={`fixed xl:sticky top-[70px] left-0 z-40 xl:z-20 h-[calc(100vh-70px)] bg-white border-r border-[#dce1e6] transition-all duration-300 ${
            sidebarCollapsed ? 'w-[84px]' : 'w-[250px]'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}
        >
          <div className="p-3 border-b border-[#edf1f5] hidden xl:flex justify-end">
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="w-8 h-8 rounded border border-[#d6dde6] grid place-items-center text-[#1f2c3c]"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] mb-1 transition-colors ${
                activeTab === tab.key ? 'bg-[#00A859] text-white' : 'hover:bg-[#f2f4f7] text-[#1f2c3c]'
              }`}
            >
              {sidebarCollapsed ? tab.label.slice(0, 2) : tab.label}
            </button>
          ))}
          </div>
        </aside>

        <main className="w-full p-4 md:p-6 xl:p-8">
          <div className="bg-white rounded-xl border border-[#dce1e6] p-6 overflow-hidden min-h-[calc(100vh-130px)]">
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
                  <textarea
                    value={JSON.stringify(selectedPage.sections || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const sections = JSON.parse(e.target.value || '{}');
                        setPages((prev) =>
                          prev.map((page) => (page.pageKey === selectedPage.pageKey ? { ...page, sections } : page))
                        );
                      } catch {
                        // ignore invalid JSON while typing
                      }
                    }}
                    className="w-full min-h-[180px] rounded border border-[#d8dde3] px-3 py-2 font-mono text-[12px]"
                    placeholder="sections JSON (whyChooseUs etc.)"
                  />
                  <button disabled={saving} onClick={updatePageContent} className="px-5 py-2 rounded bg-[#00A859] text-white text-[14px]">{saving ? 'Saving...' : 'Save Page'}</button>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'services' ? (
            <div className="space-y-8">
              <CrudList
                title="Services"
                items={services}
                newItem={{
                  title: '',
                  slug: '',
                  shortDescription: '',
                  heroImage: '',
                  cardImage: '',
                  detailImage: '',
                  aboutImages: [],
                  detailIntro: '',
                  detailBody: '',
                  aboutSectionTitle: '',
                  aboutSectionDescription: '',
                  aboutBullets: [],
                  helpCard: { title: '', phone: '', email: '', image: '' },
                }}
                fields={['title', 'slug', 'shortDescription', 'heroImage', 'cardImage', 'detailImage', 'aboutImages', 'detailIntro', 'detailBody', 'aboutSectionTitle', 'aboutSectionDescription', 'aboutBullets', 'helpCard']}
                onSave={onServiceSave}
                onDelete={async (id) => {
                  await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
                  setServices((prev) => prev.filter((row) => row._id !== id));
                }}
              />
              <CardPreviewGrid
                title="Service Cards Preview"
                items={services}
                render={(item) => (
                  <article className="rounded-xl overflow-hidden border border-[#dce1e6] bg-white">
                    <img src={item.cardImage || item.detailImage || item.heroImage} alt={item.title} className="w-full h-[150px] object-cover" />
                    <div className="p-4">
                      <p className="text-[16px] font-semibold text-[#1f2c3c] mb-1">{item.title}</p>
                      <p className="text-[13px] text-[#64717f] line-clamp-3">{item.shortDescription}</p>
                    </div>
                  </article>
                )}
              />
            </div>
          ) : null}

          {activeTab === 'blogs' ? (
            <div className="space-y-8">
              <CrudList
                title="Blog Posts"
                items={blogs}
                newItem={{
                  title: '',
                  slug: '',
                  category: '',
                  author: '',
                  authorRole: '',
                  excerpt: '',
                  content: '',
                  contentHtml: '',
                  coverImage: '',
                  bannerImage: '',
                  quoteText: '',
                  quoteAuthor: '',
                  seoTitle: '',
                  seoDescription: '',
                  readMinutes: 5,
                  tags: [],
                  popularTags: [],
                  galleryImages: [],
                }}
                fields={['title', 'slug', 'category', 'author', 'authorRole', 'excerpt', 'content', 'contentHtml', 'coverImage', 'bannerImage', 'quoteText', 'quoteAuthor', 'seoTitle', 'seoDescription', 'readMinutes', 'tags', 'popularTags', 'galleryImages']}
                onSave={onBlogSave}
                onDelete={async (id) => {
                  await apiRequest(`/admin/blogs/${id}`, { method: 'DELETE' });
                  setBlogs((prev) => prev.filter((row) => row._id !== id));
                }}
              />
              <CardPreviewGrid
                title="Blog Cards Preview"
                items={blogs}
                render={(item) => (
                  <article className="rounded-xl overflow-hidden border border-[#dce1e6] bg-white">
                    <img src={item.coverImage || item.bannerImage} alt={item.title} className="w-full h-[150px] object-cover" />
                    <div className="p-4">
                      <p className="text-[12px] text-[#00A859] font-semibold mb-2">{item.category || 'Blog'}</p>
                      <p className="text-[16px] font-semibold text-[#1f2c3c] mb-1">{item.title}</p>
                      <p className="text-[13px] text-[#64717f] line-clamp-2">{item.excerpt}</p>
                    </div>
                  </article>
                )}
              />
            </div>
          ) : null}

          {activeTab === 'howItWorks' ? (
            <div className="space-y-8">
              <CrudList
                title="How It Works Cards"
                items={howItWorks}
                newItem={{ step: '', title: '', text: '', image: '', sortOrder: 0, isPublished: true }}
                fields={['step', 'title', 'text', 'image', 'sortOrder', 'isPublished']}
                onSave={onHowSave}
                onDelete={async (id) => {
                  await apiRequest(`/admin/how-it-works/${id}`, { method: 'DELETE' });
                  setHowItWorks((prev) => prev.filter((row) => row._id !== id));
                }}
              />
              <CardPreviewGrid
                title="How It Works Preview"
                items={howItWorks}
                render={(item) => (
                  <article className="rounded-xl overflow-hidden border border-[#dce1e6] bg-white p-3">
                    <img src={item.image} alt={item.title} className="w-full h-[130px] object-cover rounded-lg mb-3" />
                    <p className="w-9 h-9 rounded-full bg-[#00A859] text-white grid place-items-center text-[13px] mb-2">{item.step}</p>
                    <p className="text-[15px] font-semibold text-[#1f2c3c] mb-1">{item.title}</p>
                    <p className="text-[12px] text-[#667481] line-clamp-2">{item.text}</p>
                  </article>
                )}
              />
            </div>
          ) : null}

          {activeTab === 'faqs' ? (
            <div className="space-y-8">
              <CrudList
                title="FAQs"
                items={faqs}
                newItem={{ pageKey: 'home', question: '', answer: '', sortOrder: 0, isPublished: true }}
                fields={['pageKey', 'question', 'answer', 'sortOrder', 'isPublished']}
                onSave={onFaqSave}
                onDelete={async (id) => {
                  await apiRequest(`/admin/faqs/${id}`, { method: 'DELETE' });
                  setFaqs((prev) => prev.filter((row) => row._id !== id));
                }}
              />
              <CardPreviewGrid
                title="FAQ Preview"
                items={faqs}
                render={(item) => (
                  <article className="rounded-xl border border-[#dce1e6] bg-white p-4">
                    <p className="text-[12px] text-[#00A859] font-semibold uppercase mb-2">{item.pageKey}</p>
                    <p className="text-[16px] text-[#1f2c3c] font-semibold mb-2">{item.question}</p>
                    <p className="text-[13px] text-[#667481] line-clamp-3">{item.answer}</p>
                  </article>
                )}
              />
            </div>
          ) : null}

          {activeTab === 'blogMessages' ? (
            <BlogMessagesPanel messages={blogMessages} onRefresh={fetchAll} />
          ) : null}

          {activeTab === 'contacts' ? <DataTable title="Contact Submissions" rows={contacts} /> : null}
          {activeTab === 'bookings' ? (
            <BookingsPanel rows={bookings} onOpen={(row) => setSelectedBooking(row)} />
          ) : null}
          {activeTab === 'notifications' ? (
            <NotificationsPanel
              rows={notifications}
              onOpen={(row) => setSelectedNotification(row)}
            />
          ) : null}
          </div>
        </main>
      </div>

      <div className="fixed top-[86px] right-4 z-[90] flex flex-col gap-2 w-[320px]">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-xl border border-[#d6e8dd] bg-white shadow-lg px-4 py-3">
            <p className="text-[13px] font-semibold text-[#1f2c3c]">{toast.title}</p>
            <p className="text-[12px] text-[#5f6f7d]">{toast.message}</p>
          </div>
        ))}
      </div>

      {selectedNotification ? (
        <NotificationModal
          row={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      ) : null}

      {selectedBooking ? (
        <BookingModal
          row={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      ) : null}
    </div>
  );
};

const CrudList: React.FC<{
  title: string;
  items: any[];
  newItem: any;
  fields: string[];
  onSave: (item: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}> = ({ title, items, newItem, fields, onSave, onDelete }) => {
  const [draft, setDraft] = useState<any>(newItem);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [existingDraft, setExistingDraft] = useState<any>(null);

  useEffect(() => {
    if (selectedId === 'new') {
      setExistingDraft(null);
      return;
    }
    const target = items.find((item) => item._id === selectedId);
    setExistingDraft(target ? { ...target } : null);
  }, [selectedId, items]);

  const current = selectedId === 'new' ? draft : existingDraft || newItem;

  const updateCurrent = (field: string, value: string) => {
    if (selectedId === 'new') {
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      return;
    }
    setExistingDraft((prev: any) => ({ ...(prev || {}), [field]: value }));
  };

  const uploadImage = async (field: string, file?: File | null) => {
    if (!file) return;
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
    updateCurrent(field, payload.secure_url);
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
      {items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className={`text-left rounded-lg border px-3 py-2 ${
                selectedId === item._id ? 'border-[#00A859] bg-[#effaf4]' : 'border-[#d8dde3] bg-white'
              }`}
            >
              <p className="text-[13px] font-semibold text-[#1f2c3c] truncate">{item.title || item.question || item.slug || item._id}</p>
              <p className="text-[12px] text-[#6f7c88] truncate">{item.pageKey || item.category || item.step || ''}</p>
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((field) => {
          const raw = current?.[field];
          const value =
            Array.isArray(raw)
              ? raw.join(', ')
              : raw && typeof raw === 'object'
              ? JSON.stringify(raw, null, 2)
              : raw || '';
          const longField =
            field.includes('content') ||
            field.includes('Description') ||
            field.includes('quote') ||
            field === 'text' ||
            field === 'answer' ||
            field === 'aboutBullets' ||
            field === 'helpCard';
          const imageField = field.toLowerCase().includes('image');

          return (
            <div key={field} className="space-y-2">
              {longField ? (
                <textarea
                  value={value}
                  onChange={(e) => updateCurrent(field, e.target.value)}
                  className="h-28 rounded border border-[#d8dde3] px-3 py-2 w-full"
                  placeholder={field}
                />
              ) : (
                <input
                  value={value}
                  onChange={(e) => updateCurrent(field, e.target.value)}
                  className="h-11 rounded border border-[#d8dde3] px-3 w-full"
                  placeholder={field}
                />
              )}
              {imageField ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImage(field, e.target.files?.[0]).catch((err) => alert(err.message))}
                  className="text-[12px]"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            onSave({
              ...current,
              tags: typeof current?.tags === 'string' ? current.tags.split(',').map((item: string) => item.trim()).filter(Boolean) : current?.tags,
              popularTags: typeof current?.popularTags === 'string' ? current.popularTags.split(',').map((item: string) => item.trim()).filter(Boolean) : current?.popularTags,
              galleryImages: typeof current?.galleryImages === 'string' ? current.galleryImages.split(',').map((item: string) => item.trim()).filter(Boolean) : current?.galleryImages,
              aboutImages: typeof current?.aboutImages === 'string' ? current.aboutImages.split(',').map((item: string) => item.trim()).filter(Boolean) : current?.aboutImages,
              aboutBullets:
                typeof current?.aboutBullets === 'string'
                  ? (() => {
                      try {
                        return JSON.parse(current.aboutBullets);
                      } catch {
                        return [];
                      }
                    })()
                  : current?.aboutBullets,
              helpCard:
                typeof current?.helpCard === 'string'
                  ? (() => {
                      try {
                        return JSON.parse(current.helpCard);
                      } catch {
                        return {};
                      }
                    })()
                  : current?.helpCard,
              sortOrder:
                typeof current?.sortOrder === 'string' && current.sortOrder !== ''
                  ? Number(current.sortOrder)
                  : current?.sortOrder,
              readMinutes:
                typeof current?.readMinutes === 'string' && current.readMinutes !== ''
                  ? Number(current.readMinutes)
                  : current?.readMinutes,
            }).catch((err) => alert(err.message))
          }
          className="px-5 py-2 rounded bg-[#00A859] text-white text-[14px]"
        >
          Save
        </button>
        {onDelete && selectedId !== 'new' ? (
          <button
            onClick={() => onDelete(selectedId).catch((err) => alert(err.message))}
            className="px-5 py-2 rounded bg-[#d64343] text-white text-[14px]"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
};

const CardPreviewGrid: React.FC<{ title: string; items: any[]; render: (item: any) => React.ReactNode }> = ({ title, items, render }) => (
  <div>
    <h3 className="text-[18px] font-semibold text-[#1f2c3c] mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item._id}>{render(item)}</div>
      ))}
    </div>
  </div>
);

const BlogMessagesPanel: React.FC<{ messages: any[]; onRefresh: () => Promise<void> }> = ({ messages, onRefresh }) => {
  const [replyById, setReplyById] = useState<Record<string, string>>({});

  const updateStatus = async (id: string, status: 'approved' | 'pending' | 'spam') => {
    await apiRequest(`/admin/blog-messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await onRefresh();
  };

  const submitReply = async (id: string) => {
    const text = (replyById[id] || '').trim();
    if (!text) return;
    await apiRequest(`/admin/blog-messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });
    setReplyById((prev) => ({ ...prev, [id]: '' }));
    await onRefresh();
  };

  return (
    <div>
      <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-4">Blog Messages & Replies</h2>
      <div className="space-y-4">
        {messages.map((row) => (
          <article key={row._id} className="rounded-lg border border-[#dce1e6] p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-[16px] font-semibold text-[#1f2c3c]">
                {row.name} <span className="text-[#667481] font-normal">on {row.blogPostId?.title || row.blogTitle || '-'}</span>
              </p>
              <span className="text-[12px] rounded-full bg-[#f1f4f7] px-3 py-1">{row.status}</span>
            </div>
            <p className="text-[13px] text-[#667481] mb-2">{row.email}</p>
            <p className="text-[14px] text-[#1f2c3c] mb-3">{row.message}</p>

            {!row.isAdminReply ? (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <input
                  value={replyById[row._id] || ''}
                  onChange={(e) => setReplyById((prev) => ({ ...prev, [row._id]: e.target.value }))}
                  className="h-10 rounded border border-[#d8dde3] px-3"
                  placeholder="Write admin reply"
                />
                <div className="flex gap-2">
                  <button onClick={() => submitReply(row._id).catch((err) => alert(err.message))} className="px-3 py-2 rounded bg-[#00A859] text-white text-[13px]">Reply</button>
                  <button onClick={() => updateStatus(row._id, 'approved').catch((err) => alert(err.message))} className="px-3 py-2 rounded bg-[#e7f7ef] text-[#009450] text-[13px]">Approve</button>
                  <button onClick={() => updateStatus(row._id, 'spam').catch((err) => alert(err.message))} className="px-3 py-2 rounded bg-[#fff1f1] text-[#c53030] text-[13px]">Spam</button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
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

const BookingsPanel: React.FC<{ rows: any[]; onOpen: (row: any) => void }> = ({ rows, onOpen }) => (
  <div>
    <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-4">Bookings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rows.map((row) => (
        <button
          key={row._id}
          onClick={() => onOpen(row)}
          className="text-left rounded-xl border border-[#dce1e6] bg-white p-4 hover:shadow-md transition-shadow"
        >
          <p className="text-[16px] font-semibold text-[#1f2c3c] mb-1">{row.name || 'Booking'}</p>
          <p className="text-[13px] text-[#667481] mb-1">{row.email}</p>
          <p className="text-[13px] text-[#667481] mb-1">{row.phone}</p>
          <p className="text-[12px] text-[#00A859] uppercase tracking-wider mb-2">{row.serviceSlug}</p>
          <p className="text-[12px] text-[#8a96a3]">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</p>
        </button>
      ))}
    </div>
  </div>
);

const NotificationsPanel: React.FC<{ rows: any[]; onOpen: (row: any) => void }> = ({ rows, onOpen }) => (
  <div>
    <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-4">Notifications</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rows.map((row) => (
        <button
          key={row._id}
          onClick={() => onOpen(row)}
          className="text-left rounded-xl border border-[#dce1e6] bg-white p-4 hover:shadow-md transition-shadow"
        >
          <p className="text-[12px] uppercase tracking-wider text-[#00A859] mb-1">{row.type || 'notification'}</p>
          <p className="text-[16px] font-semibold text-[#1f2c3c] mb-1">{row.title || 'Notification'}</p>
          <p className="text-[13px] text-[#667481] line-clamp-2 mb-2">{row.message || '-'}</p>
          <p className="text-[12px] text-[#8a96a3]">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</p>
        </button>
      ))}
    </div>
  </div>
);

const NotificationModal: React.FC<{ row: any; onClose: () => void }> = ({ row, onClose }) => (
  <div className="fixed inset-0 z-[120] bg-black/45 flex items-center justify-center p-4">
    <div className="w-full max-w-[620px] rounded-2xl bg-white border border-[#d9e2ec] shadow-2xl">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#00A859]">{row.type || 'notification'}</p>
          <p className="text-[20px] font-semibold text-[#1f2c3c]">{row.title || 'Notification Detail'}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full border border-[#d9e2ec] grid place-items-center text-[#1f2c3c]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-[15px] text-[#1f2c3c] leading-relaxed">{row.message || '-'}</p>
        <div className="rounded-lg border border-[#e7edf3] bg-[#f8fafc] p-3">
          <p className="text-[12px] text-[#607080] mb-1">Created At</p>
          <p className="text-[14px] text-[#1f2c3c]">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</p>
        </div>
        <div className="rounded-lg border border-[#e7edf3] bg-[#f8fafc] p-3">
          <p className="text-[12px] text-[#607080] mb-1">Payload</p>
          <pre className="text-[12px] text-[#1f2c3c] whitespace-pre-wrap break-all">
            {JSON.stringify(row.payload || {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

const BookingModal: React.FC<{ row: any; onClose: () => void }> = ({ row, onClose }) => (
  <div className="fixed inset-0 z-[120] bg-black/45 flex items-center justify-center p-4">
    <div className="w-full max-w-[680px] rounded-2xl bg-white border border-[#d9e2ec] shadow-2xl">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#00A859]">Booking Detail</p>
          <p className="text-[20px] font-semibold text-[#1f2c3c]">{row.name || 'Booking'}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full border border-[#d9e2ec] grid place-items-center text-[#1f2c3c]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Detail label="Email" value={row.email} />
        <Detail label="Phone" value={row.phone} />
        <Detail label="Service" value={row.serviceSlug} />
        <Detail label="Scheduled Date" value={row.scheduledDate ? new Date(row.scheduledDate).toLocaleString() : '-'} />
        <Detail label="Address" value={row.address} full />
        <Detail label="Notes" value={row.notes || '-'} full />
        <Detail label="Status" value={row.status || '-'} />
        <Detail label="Created At" value={row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'} />
      </div>
    </div>
  </div>
);

const Detail: React.FC<{ label: string; value: string; full?: boolean }> = ({ label, value, full = false }) => (
  <div className={`${full ? 'md:col-span-2' : ''} rounded-lg border border-[#e7edf3] bg-[#f8fafc] p-3`}>
    <p className="text-[12px] text-[#607080] mb-1">{label}</p>
    <p className="text-[14px] text-[#1f2c3c] break-words">{value}</p>
  </div>
);

export default AdminDashboardPage;
