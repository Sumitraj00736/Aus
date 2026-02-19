import React, { useState } from 'react';
import { Search, ChevronDown, Phone, ArrowRight, X, Menu } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home', hasDropdown: true, active: true },
  { name: 'Services', href: '#services', hasDropdown: true },
  { name: 'Project', href: '#project', hasDropdown: true },
  { name: 'Page', href: '#page', hasDropdown: true },
  { name: 'Blog', href: '#blog', hasDropdown: true },
  { name: 'Contact Us', href: '#contact', hasDropdown: false },
];

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
        <div className="flex items-center justify-between h-[100px]">
          {/* Logo */}
          <a href="#home" className="flex items-center flex-shrink-0">
            <svg width="145" height="48" viewBox="0 0 145 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cetro leaf/star icon */}
              <path d="M16 10.5C13.6 10.5 11.4 11.2 9.5 12.5C10.2 9.4 12.1 6.8 15 5.3C11.7 5.9 9.1 8.1 7.8 11C6.5 8.1 3.9 5.9 0.6 5.3C3.5 6.8 5.4 9.4 6.1 12.5C4.2 11.2 2 10.5 -0.4 10.5V12.3C2.8 12.3 5.6 14.5 6.7 17.6C7.1 18.5 7.3 19.4 7.3 20.3C7.3 19.4 7.5 18.5 7.9 17.6C9 14.5 11.8 12.3 15 12.3C15.3 12.3 15.7 12.3 15.7 12.3V10.5C15.7 10.5 15.4 10.5 16 10.5Z" fill="#00A859" transform="translate(2, 4)" />
              <text x="24" y="36" fill="white" fontSize="36" fontWeight="800" fontFamily="Jost, sans-serif" letterSpacing="-1">cetro</text>
              <circle cx="105" cy="32" r="3.5" fill="#00A859" />
            </svg>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-[30px]">
            {navItems.map((item) => (
              <div key={item.name} className="group relative">
                <a
                  href={item.href}
                  className={`nav-link flex items-center gap-1 text-white hover:text-[#00A859] ${item.active ? 'text-[#00A859]' : ''}`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </a>
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-44 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-3 rounded-lg shadow-2xl py-2 z-50">
                    <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#00A859] transition-colors">Option One</a>
                    <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#00A859] transition-colors">Option Two</a>
                    <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#00A859] transition-colors">Option Three</a>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Phone + Search + CTA */}
          <div className="flex items-center gap-5">
            {/* Phone */}
            <div className="hidden lg:flex items-center text-white gap-3">
              <div className="w-[46px] h-[46px] rounded-full border border-white/25 flex items-center justify-center hover:bg-[#00A859] hover:border-[#00A859] transition-colors duration-300 cursor-pointer">
                <Phone className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-medium opacity-70 leading-none mb-1">Need Help?</p>
                <p className="text-[17px] font-bold leading-none tracking-tight">(+480) 123 678 900</p>
              </div>
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-[50px] h-[50px] rounded-full bg-white/10 hover:bg-[#00A859] flex items-center justify-center transition-colors duration-300"
            >
              {searchOpen ? <X className="text-white w-5 h-5" /> : <Search className="text-white w-5 h-5" />}
            </button>

            {/* Get A Quote */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#008f4c] text-white px-7 py-[14px] rounded-full font-bold text-[15px] transition-all duration-300 group"
            >
              Get A Quote!
              <span className="bg-white/20 rounded-full p-[5px] group-hover:bg-white/40 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Mobile Hamburger */}
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

      {/* Search Bar overlay */}
      {searchOpen && (
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-transparent text-white placeholder-white/60 text-lg outline-none border-b border-white/40 pb-2"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#1a1a1a] border-t border-white/10">
          <nav className="max-w-[1240px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[16px] font-semibold py-3 border-b border-white/10 last:border-0 transition-colors ${item.active ? 'text-[#00A859]' : 'text-white hover:text-[#00A859]'}`}
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" className="mt-4 btn-pill bg-[#00A859] text-white text-center font-bold">
              Get A Quote!
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
