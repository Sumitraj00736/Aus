import React, { useState } from "react";
import { Phone, ArrowRight, X, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSiteSettings } from "../../hooks/useSiteSettings";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Our Services", href: "/our-services" },
  { name: "Our Work", href: "/our-work" },
  { name: "About Us", href: "/about-us" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

type SiteNavigationProps = {
  dark?: boolean;
  topOffset?: number;
};

const SiteNavigation: React.FC<SiteNavigationProps> = ({
  dark = false,
  topOffset = 0,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSiteSettings();
  const phone = settings?.contact?.phone;

  const headerStyle = dark ? undefined : { top: `${topOffset}px` };

  return (
    <>
      <header
        className={`${
          dark ? "relative bg-[#1a1a1a]" : "absolute left-0 bg-transparent"
        } w-full z-50`}
        style={headerStyle}
      >
        <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between h-[80px]">

            {/* LEFT SIDE (Logo + Nav Together) */}
            <div className="flex items-center gap-12">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="Rainbow Painting Icon"
                  className="h-14 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-white text-3xl font-bold leading-none">
                    RAINBOW
                  </span>
                  <span className="text-white text-[11px] tracking-[0.15em] mt-1 opacity-90">
                    PAINTING & SERVICES
                  </span>
                </div>
              </Link>

              {/* Desktop Nav (Now Left Aligned) */}
              <nav className="hidden xl:flex items-center gap-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end
                    className={({ isActive }) =>
                      `text-white text-[16px] font-medium tracking-wide transition-colors duration-300
                       hover:text-[#00A859] ${
                         isActive ? "text-[#00A859]" : ""
                       }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>

            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${phone}`}
                className="hidden sm:inline-flex items-center gap-2 
                           bg-[#00A859] hover:bg-[#008f4c] 
                           text-white px-6 py-2.5 
                           rounded-full text-[14px] font-semibold 
                           transition-all duration-300"
              >
                Call Us Today
                <Phone className="w-[16px] h-[16px]" />
              </a>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="xl:hidden text-white p-2"
              >
                <Menu size={28} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-50
                    transform transition-transform duration-400 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <span className="text-white text-lg font-semibold">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <X className="text-white" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-white text-lg transition-colors duration-300
                 hover:text-[#00A859] ${
                   isActive ? "text-[#00A859]" : ""
                 }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SiteNavigation;