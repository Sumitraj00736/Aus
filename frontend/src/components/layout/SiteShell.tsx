import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteNavigation from './SiteNavigation';
import { apiRequest } from '../../lib/api';
import JoinUsSection from '../home/JoinUsSection';
import Footer from './Footer';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '').trim();
  const safe = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(safe)) return null;
  const int = parseInt(safe, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp(v, 0, 255).toString(16).padStart(2, '0')).join('')}`;

const darkenHex = (hex: string, amount = 0.12) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - amount;
  return rgbToHex(Math.round(rgb.r * factor), Math.round(rgb.g * factor), Math.round(rgb.b * factor));
};

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
        const primary = settings.theme.primary || '#00A859';
        root.style.setProperty('--theme-primary', primary);
        root.style.setProperty('--theme-primary-dark', darkenHex(primary, 0.12));
        root.style.setProperty('--theme-primary-darker', darkenHex(primary, 0.2));
        root.style.setProperty('--theme-dark', settings.theme.dark || '#1f2c3c');
        root.style.setProperty('--theme-light-bg', settings.theme.lightBg || '#f2f2ee');
        root.style.setProperty('--theme-text', settings.theme.text || '#1a1a1a');
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <SiteNavigation dark={!useOverlayNav} />
      <main>
        <Outlet />
      </main>
      <JoinUsSection />
      <Footer />
    </>
  );
};

export default SiteShell;
