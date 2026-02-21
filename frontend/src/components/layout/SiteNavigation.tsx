import React, { useState } from 'react';
import { Phone, ArrowRight, X, Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Project', href: '/project' },
  { name: 'Page', href: '/page' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
];

type SiteNavigationProps = {
  dark?: boolean;
  topOffset?: number;
};

const SiteNavigation: React.FC<SiteNavigationProps> = ({ dark = false, topOffset = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSiteSettings();
  const headerStyle = dark ? undefined : { top: `${topOffset}px` };
  const phone = settings?.contact?.phone || '(+480) 123 678 900';
  const siteName = settings?.siteName || 'cetro';

  return (
    <header
      className={`${dark ? 'relative bg-[#1a1a1a]' : 'absolute left-0 bg-transparent'} w-full z-50 animate-nav-enter`}
      style={headerStyle}
    >
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
        <div className="flex items-center justify-between h-[100px]">
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="Cetro Home">
            <svg width="145" height="48" viewBox="0 0 145 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 10.5C13.6 10.5 11.4 11.2 9.5 12.5C10.2 9.4 12.1 6.8 15 5.3C11.7 5.9 9.1 8.1 7.8 11C6.5 8.1 3.9 5.9 0.6 5.3C3.5 6.8 5.4 9.4 6.1 12.5C4.2 11.2 2 10.5 -0.4 10.5V12.3C2.8 12.3 5.6 14.5 6.7 17.6C7.1 18.5 7.3 19.4 7.3 20.3C7.3 19.4 7.5 18.5 7.9 17.6C9 14.5 11.8 12.3 15 12.3C15.3 12.3 15.7 12.3 15.7 12.3V10.5C15.7 10.5 15.4 10.5 16 10.5Z" fill="#00A859" transform="translate(2, 4)" />
              <text x="24" y="36" fill="white" fontSize="36" fontWeight="800" fontFamily="Jost, sans-serif" letterSpacing="-1">{siteName.toLowerCase()}</text>
              <circle cx="105" cy="32" r="3.5" fill="#00A859" />
            </svg>
          </Link>

          <nav className="hidden xl:flex items-center space-x-[30px]">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `nav-link flex items-center gap-1 text-white hover:text-[#00A859] ${isActive ? 'text-[#00A859]' : ''}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center text-white gap-3">
              <div className="w-[46px] h-[46px] rounded-full border border-white/25 flex items-center justify-center hover:bg-[#00A859] hover:border-[#00A859] transition-colors duration-300">
                <Phone className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-medium opacity-70 leading-none mb-1">Need Help?</p>
                <p className="text-[17px] font-bold leading-none tracking-tight">{phone}</p>
              </div>
            </div>

            <Link
              to="/#request-quote"
              className="hidden sm:inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#008f4c] text-white px-7 py-[14px] rounded-full font-bold text-[15px] transition-all duration-300 group"
            >
              Request Quote
              <span className="bg-white/20 rounded-full p-[5px] group-hover:bg-white/40 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-[#1a1a1a] border-t border-white/10">
          <nav className="max-w-[1240px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-[16px] font-semibold py-3 border-b border-white/10 last:border-0 transition-colors ${
                    isActive ? 'text-[#00A859]' : 'text-white hover:text-[#00A859]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <Link to="/#request-quote" className="mt-4 btn-pill bg-[#00A859] text-white text-center font-bold">
              Request Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteNavigation;
