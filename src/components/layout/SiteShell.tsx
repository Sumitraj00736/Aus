import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteNavigation from './SiteNavigation';
import SmoothScroll from './SmoothScroll';

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

  return (
    <>
      {/* <SmoothScroll scrollSpeed={2}/> */}
      <SiteNavigation dark={!useOverlayNav} />
      <Outlet />
    </>
  );
};

export default SiteShell;
