import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    { label: 'Office Cleaning', href: '#services' },
    { label: 'Home Cleaning', href: '#services' },
    { label: 'Window Cleaning', href: '#services' },
    { label: 'Carpet Cleaning', href: '#services' },
    { label: 'Post-Construction', href: '#services' },
  ],
};

const socials = [
  { icon: <Facebook className="w-4 h-4" />, href: '#', label: 'Facebook' },
  { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
  { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
  { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
];

const FooterSection: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#111] text-white">
      {/* CTA Banner */}
      <div className="bg-[#00A859] py-14">
        <div className="max-w-[1240px] mx-auto px-4 xl:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[32px] md:text-[38px] font-black text-white leading-tight">
              Ready for a Cleaner Space?
            </h3>
            <p className="text-white/80 text-[16px] mt-1">Get your free, no-obligation quote today.</p>
          </div>
          <a
            href="tel:+4801236789"
            className="flex-shrink-0 btn-pill bg-white hover:bg-[#f0f0f0] text-[#00A859] font-bold text-[16px] flex items-center gap-3 group"
          >
            Call Us Now
            <span className="flex items-center justify-center w-[28px] h-[28px] bg-[#00A859] rounded-full group-hover:bg-[#008f4c] transition-colors">
              <ArrowRight className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 border-b border-white/10">
        <div className="max-w-[1240px] mx-auto px-4 xl:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            {/* Logo */}
            <a href="#home" className="inline-block mb-6">
              <svg width="130" height="44" viewBox="0 0 130 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9C11.6 9 9.4 9.7 7.5 11C8.2 8 10.1 5.4 13 3.9C9.7 4.5 7.1 6.7 5.8 9.6C4.5 6.7 1.9 4.5 -1.4 3.9C1.5 5.4 3.4 8 4.1 11C2.2 9.7 0 9 -2.4 9V10.8C0.8 10.8 3.6 13 4.7 16.1C5.1 17 5.3 17.9 5.3 18.8C5.3 17.9 5.5 17 5.9 16.1C7 13 9.8 10.8 13 10.8C13.3 10.8 13.7 10.8 13.7 10.8V9C13.7 9 13.4 9 14 9Z" fill="#00A859" transform="translate(4, 6)" />
                <text x="22" y="33" fill="white" fontSize="32" fontWeight="800" fontFamily="Jost, sans-serif" letterSpacing="-0.8">cetro</text>
                <circle cx="94" cy="29" r="3" fill="#00A859" />
              </svg>
            </a>
            <p className="text-white/55 text-[15px] leading-relaxed mb-8">
              Professional cleaning services trusted by thousands of homes and businesses since 2009.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-[#00A859] hover:bg-[#00A859] flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/55 hover:text-[#00A859] text-[15px] font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-[1px] bg-white/20 group-hover:bg-[#00A859] group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/55 hover:text-[#00A859] text-[15px] font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-[1px] bg-white/20 group-hover:bg-[#00A859] group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A859] flex-shrink-0 mt-0.5" />
                <span className="text-white/55 text-[15px] leading-relaxed">
                  1234 Clean Street, Suite 200<br />Chicago, IL 60601
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00A859] flex-shrink-0" />
                <a href="tel:+4801236789" className="text-white/55 hover:text-[#00A859] text-[15px] font-medium transition-colors">
                  (+480) 123 678 900
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00A859] flex-shrink-0" />
                <a href="mailto:hello@cetro.com" className="text-white/55 hover:text-[#00A859] text-[15px] font-medium transition-colors">
                  hello@cetro.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6">
        <div className="max-w-[1240px] mx-auto px-4 xl:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[14px] text-white/35">
          <p>© {new Date().getFullYear()} Cetro Cleaning Service. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
