import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CookieConsent from '../components/layout/CookieConsent';
import ScrollToTop from '../components/layout/ScrollToTop';
import SiteShell from '../components/layout/SiteShell';
import HomePage from '../pages/home/HomePage';
import ServicesPage from '../pages/services/ServicesPage';
import ServiceDetailPage from '../pages/services/ServiceDetailPage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import PagesPage from '../pages/page/PagesPage';
import BlogPage from '../pages/blog/BlogPage';
import ContactPage from '../pages/contact/ContactPage';
import { useEffect } from 'react';

const RouteScrollReset: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

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
          <Route path="project" element={<ProjectsPage />} />
          <Route path="page" element={<PagesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
      <ScrollToTop />
    </div>
  );
};

export default App;
