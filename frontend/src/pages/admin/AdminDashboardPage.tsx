import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { API_BASE, apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';
import ProjectsAdminPanel from '../../components/admin/ProjectsAdminPanel';
import ServicesAdminPanel from '../../components/admin/ServicesAdminPanel';
import BlogAdminPanel from '../../components/admin/BlogAdminPanel';
import HowItWorksAdminPanel from '../../components/admin/HowItWorksAdminPanel';
import FaqsAdminPanel from '../../components/admin/FaqsAdminPanel';
import ContactsAdminPanel from '../../components/admin/ContactsAdminPanel';
import TestimonialsAdminPanel from '../../components/admin/TestimonialsAdminPanel';

type TabKey =
  | 'overview'
  | 'settings'
  | 'pages'
  | 'services'
  | 'blogs'
  | 'projects'
  | 'howItWorks'
  | 'faqs'
  | 'testimonials'
  | 'blogMessages'
  | 'contacts'
  | 'bookings'
  | 'notifications'
  | 'admins'
  | 'activity';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Theme & Site' },
  { key: 'pages', label: 'Pages' },
  { key: 'services', label: 'Services' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'projects', label: 'Projects' },
  { key: 'howItWorks', label: 'How It Works' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'blogMessages', label: 'Blog Messages' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'admins', label: 'Sub Admins' },
  { key: 'activity', label: 'Activity Logs' },
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
  const [projects, setProjects] = useState<any[]>([]);
  const [howItWorks, setHowItWorks] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogMessages, setBlogMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
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
    const base = await Promise.all([
      apiRequest('/admin/stats'),
      apiRequest('/admin/settings'),
      apiRequest('/admin/pages'),
      apiRequest('/admin/services'),
      apiRequest('/admin/blogs'),
      apiRequest('/admin/projects'),
      apiRequest('/admin/how-it-works'),
      apiRequest('/admin/faqs'),
      apiRequest('/admin/testimonials'),
      apiRequest('/admin/blog-messages'),
      apiRequest('/admin/contacts'),
      apiRequest('/admin/bookings'),
      apiRequest('/admin/notifications'),
    ]);

    const [
      statsData,
      settingsData,
      pagesData,
      servicesData,
      blogsData,
      projectsData,
      howItWorksData,
      faqsData,
      testimonialsData,
      blogMessagesData,
      contactsData,
      bookingsData,
      notificationsData,
    ] = base;

    const [adminsData, logsData] = await Promise.all([
      apiRequest('/admin/admins').catch(() => []),
      apiRequest('/admin/audit-logs').catch(() => []),
    ]);

    setStats(statsData);
    setSettings(settingsData);
    setPages(pagesData);
    setServices(servicesData);
    setBlogs(blogsData);
    setProjects(projectsData);
    setHowItWorks(howItWorksData);
    setFaqs(faqsData);
    setTestimonials(testimonialsData);
    setBlogMessages(blogMessagesData);
    setContacts(contactsData);
    setBookings(bookingsData);
    setNotifications(notificationsData);
    setAdminUsers(adminsData);
    setAuditLogs(logsData);
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
      notifySuccess('Settings saved.');
      setTimeout(() => window.location.reload(), 300);
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
      notifySuccess('Page content saved.');
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

  const onProjectSave = async (project: any) => {
    const hasId = Boolean(project._id);
    const saved = await apiRequest(hasId ? `/admin/projects/${project._id}` : '/admin/projects', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(project),
    });
    setProjects((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  const onFaqSave = async (faq: any) => {
    const hasId = Boolean(faq._id);
    const saved = await apiRequest(hasId ? `/admin/faqs/${faq._id}` : '/admin/faqs', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(faq),
    });
    setFaqs((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
  };

  const onTestimonialSave = async (testimonial: any) => {
    const hasId = Boolean(testimonial._id);
    const saved = await apiRequest(hasId ? `/admin/testimonials/${testimonial._id}` : '/admin/testimonials', {
      method: hasId ? 'PUT' : 'POST',
      body: JSON.stringify(testimonial),
    });
    setTestimonials((prev) => (hasId ? prev.map((row) => (row._id === saved._id ? saved : row)) : [saved, ...prev]));
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
                <input value={settings.contact?.supportEmail || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, supportEmail: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Support email" />
                <input value={settings.contact?.address || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3 md:col-span-2" placeholder="Address" />
                <input value={settings.workingTime?.weekdays || ''} onChange={(e) => setSettings({ ...settings, workingTime: { ...settings.workingTime, weekdays: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Weekdays timing" />
                <input value={settings.workingTime?.saturday || ''} onChange={(e) => setSettings({ ...settings, workingTime: { ...settings.workingTime, saturday: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Saturday timing" />
                <input value={settings.workingTime?.sunday || ''} onChange={(e) => setSettings({ ...settings, workingTime: { ...settings.workingTime, sunday: e.target.value } })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Sunday timing" />
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
            <ServicesAdminPanel
              services={services}
              onSave={onServiceSave}
              onDelete={async (id) => {
                await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
                setServices((prev) => prev.filter((row) => row._id !== id));
              }}
            />
          ) : null}

          {activeTab === 'blogs' ? (
            <BlogAdminPanel
              blogs={blogs}
              onSave={onBlogSave}
              onDelete={async (id) => {
                await apiRequest(`/admin/blogs/${id}`, { method: 'DELETE' });
                setBlogs((prev) => prev.filter((row) => row._id !== id));
              }}
            />
          ) : null}

          {activeTab === 'projects' ? (
            <ProjectsAdminPanel projects={projects} onSave={onProjectSave} />
          ) : null}

          {activeTab === 'howItWorks' ? (
            <HowItWorksAdminPanel
              items={howItWorks}
              onSave={onHowSave}
              onDelete={async (id) => {
                await apiRequest(`/admin/how-it-works/${id}`, { method: 'DELETE' });
                setHowItWorks((prev) => prev.filter((row) => row._id !== id));
              }}
            />
          ) : null}

          {activeTab === 'faqs' ? (
            <FaqsAdminPanel
              faqs={faqs}
              onSave={onFaqSave}
              onDelete={async (id) => {
                await apiRequest(`/admin/faqs/${id}`, { method: 'DELETE' });
                setFaqs((prev) => prev.filter((row) => row._id !== id));
              }}
            />
          ) : null}

          {activeTab === 'testimonials' ? (
            <TestimonialsAdminPanel
              testimonials={testimonials}
              onSave={onTestimonialSave}
              onDelete={async (id) => {
                await apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' });
                setTestimonials((prev) => prev.filter((row) => row._id !== id));
              }}
            />
          ) : null}

          {activeTab === 'blogMessages' ? (
            <BlogMessagesPanel messages={blogMessages} onRefresh={fetchAll} />
          ) : null}

          {activeTab === 'contacts' ? <ContactsAdminPanel contacts={contacts} /> : null}
          {activeTab === 'bookings' ? (
            <BookingsPanel rows={bookings} onOpen={(row) => setSelectedBooking(row)} />
          ) : null}
          {activeTab === 'notifications' ? (
            <NotificationsPanel
              rows={notifications}
              onOpen={(row) => setSelectedNotification(row)}
            />
          ) : null}
          {activeTab === 'admins' ? (
            <AdminUsersPanel
              users={adminUsers}
              onCreate={async (payload) => {
                await apiRequest('/admin/admins', { method: 'POST', body: JSON.stringify(payload) });
                notifySuccess('Sub admin created.');
                fetchAll().catch(() => undefined);
              }}
            />
          ) : null}
          {activeTab === 'activity' ? <AuditLogPanel rows={auditLogs} /> : null}
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
                  <button onClick={() => submitReply(row._id).catch((err) => notifyError(err.message))} className="px-3 py-2 rounded bg-[#00A859] text-white text-[13px]">Reply</button>
                  <button onClick={() => updateStatus(row._id, 'approved').catch((err) => notifyError(err.message))} className="px-3 py-2 rounded bg-[#e7f7ef] text-[#009450] text-[13px]">Approve</button>
                  <button onClick={() => updateStatus(row._id, 'spam').catch((err) => notifyError(err.message))} className="px-3 py-2 rounded bg-[#fff1f1] text-[#c53030] text-[13px]">Spam</button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
};

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

const AdminUsersPanel: React.FC<{
  users: any[];
  onCreate: (payload: any) => Promise<void>;
}> = ({ users, onCreate }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  return (
    <div className="space-y-6">
      <h2 className="text-[22px] font-semibold text-[#1f2c3c]">Sub Admin Management</h2>
      <div className="rounded-xl border border-[#dce1e6] p-4">
        <p className="text-[14px] text-[#5f6f7d] mb-3">Create new sub admin</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Name" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Email" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded border border-[#d8dde3] px-3" placeholder="Password" />
        </div>
        <button
          onClick={() =>
            onCreate(form)
              .then(() => setForm({ name: '', email: '', password: '' }))
              .catch((err) => notifyError(err.message))
          }
          className="mt-3 px-5 py-2 rounded bg-[#00A859] text-white text-[14px]"
        >
          Create Sub Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user) => (
          <article key={user._id} className="rounded-xl border border-[#dce1e6] bg-white p-4">
            <p className="text-[16px] font-semibold text-[#1f2c3c]">{user.name}</p>
            <p className="text-[13px] text-[#667481]">{user.email}</p>
            <p className="text-[12px] uppercase mt-2 text-[#00A859]">{user.role}</p>
            <p className="text-[12px] text-[#8b97a2] mt-1">{new Date(user.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

const AuditLogPanel: React.FC<{ rows: any[] }> = ({ rows }) => (
  <div>
    <h2 className="text-[22px] font-semibold text-[#1f2c3c] mb-4">Admin Activity Logs</h2>
    <div className="space-y-3">
      {rows.map((row) => (
        <article key={row._id} className="rounded-xl border border-[#dce1e6] bg-white p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[14px] font-semibold text-[#1f2c3c]">{row.adminName} ({row.adminRole})</p>
            <p className="text-[12px] text-[#8b97a2]">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</p>
          </div>
          <p className="text-[13px] text-[#00A859] uppercase tracking-wider mb-1">{row.action} {row.entity}</p>
          <p className="text-[13px] text-[#667481] break-all">{row.adminEmail}</p>
          <pre className="mt-2 text-[12px] text-[#445465] whitespace-pre-wrap break-all bg-[#f7fafc] border border-[#e7edf3] rounded p-2">
            {JSON.stringify(row.details || {}, null, 2)}
          </pre>
        </article>
      ))}
    </div>
  </div>
);

export default AdminDashboardPage;
