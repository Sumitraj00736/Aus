import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CookieConsent from '../components/layout/CookieConsent';
import ScrollToTop from '../components/layout/ScrollToTop';
import SiteShell from '../components/layout/SiteShell';
import HomePage from '../pages/home/HomePage';
import ServicesPage from '../pages/services/ServicesPage';
import ServiceDetailPage from '../pages/services/ServiceDetailPage';
import BookServicePage from '../pages/services/BookServicePage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import PagesPage from '../pages/page/PagesPage';
import BlogPage from '../pages/blog/BlogPage';
import BlogDetailPage from '../pages/blog/BlogDetailPage';
import ContactPage from '../pages/contact/ContactPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminGuard from '../components/admin/AdminGuard';
import { useEffect } from 'react';

const RouteScrollReset: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 30);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <div className="relative">
      <RouteScrollReset />
      <Routes>
        <Route path="/" element={<SiteShell />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="book-service" element={<BookServicePage />} />
          <Route path="project" element={<ProjectsPage />} />
          <Route path="page" element={<PagesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboardPage />
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
      <ScrollToTop />
      <ToastContainer theme="light" newestOnTop closeOnClick pauseOnHover />
    </div>
  );
};

export default App;
