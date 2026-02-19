import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteNavigation from './SiteNavigation';
import { apiRequest } from '../../lib/api';

const SiteShell: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isServicesArea = location.pathname.startsWith('/services');
  const useOverlayNav = isHome || isServicesArea;

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('section, footer, .animate-block'));

    targets.forEach((el, idx) => {
      (el as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(idx * 45, 250)}ms`);
      el.setAttribute('data-animate', 'true');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    apiRequest('/public/settings')
      .then((settings) => {
        if (!settings?.theme) return;
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', settings.theme.primary || '#00A859');
        root.style.setProperty('--theme-dark', settings.theme.dark || '#1f2c3c');
        root.style.setProperty('--theme-light-bg', settings.theme.lightBg || '#f2f2ee');
        root.style.setProperty('--theme-text', settings.theme.text || '#1a1a1a');
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <SiteNavigation dark={!useOverlayNav} />
      <Outlet />
    </>
  );
};

export default SiteShell;
