import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const Footer: React.FC = () => {
  const settings = useSiteSettings();
  const siteName = settings?.siteName || 'Cetro';
  const phone = settings?.contact?.phone || '(+480) 123 678 900';
  const email = settings?.contact?.email || 'hello@cetro.com';
  const supportEmail = settings?.contact?.supportEmail || 'support@example.com';
  const address = settings?.contact?.address || '5609 E Sprague Ave, Spokane Valley, WA 99212, USA';
  const weekdays = settings?.workingTime?.weekdays || 'Mon - Fri: 9.00am - 5.00pm';
  const saturday = settings?.workingTime?.saturday || 'Saturday: 10.00am - 6.00pm';
  const sunday = settings?.workingTime?.sunday || 'Sunday Closed';

  return (
    <footer id="footer" className="bg-[#243242] text-white">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="inline-block mb-5" aria-label="Cetro Home">
            <svg width="130" height="44" viewBox="0 0 130 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 9C11.6 9 9.4 9.7 7.5 11C8.2 8 10.1 5.4 13 3.9C9.7 4.5 7.1 6.7 5.8 9.6C4.5 6.7 1.9 4.5 -1.4 3.9C1.5 5.4 3.4 8 4.1 11C2.2 9.7 0 9 -2.4 9V10.8C0.8 10.8 3.6 13 4.7 16.1C5.1 17 5.3 17.9 5.3 18.8C5.3 17.9 5.5 17 5.9 16.1C7 13 9.8 10.8 13 10.8C13.3 10.8 13.7 10.8 13.7 10.8V9C13.7 9 13.4 9 14 9Z" fill="#00A859" transform="translate(4, 6)" />
              <text x="22" y="33" fill="white" fontSize="32" fontWeight="800" fontFamily="Jost, sans-serif" letterSpacing="-0.8">{siteName.toLowerCase()}</text>
              <circle cx="94" cy="29" r="3" fill="#00A859" />
            </svg>
          </Link>
          <p className="text-white/70 leading-relaxed max-w-[280px]">
            We work with a passion of taking challenges and creating new ones in advertising sector.
          </p>
        </div>

        <div>
          <h4 className="text-[22px] font-bold mb-4">Links</h4>
          <ul className="space-y-3 text-white/80">
            <li><Link to="/" className="hover:text-[#00A859]">About Us</Link></li>
            <li><Link to="/services" className="hover:text-[#00A859]">Services</Link></li>
            <li><Link to="/page" className="hover:text-[#00A859]">Pricing</Link></li>
            <li><Link to="/blog" className="hover:text-[#00A859]">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-[#00A859]">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[22px] font-bold mb-4">Working Time</h4>
          <ul className="space-y-2 text-white/80">
            <li>{weekdays}</li>
            <li>{saturday}</li>
            <li>{sunday}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <a href={`tel:${phone}`} className="text-[#00A859] text-[18px] md:text-[18px] font-black hover:text-white transition-colors">
            {phone}
          </a>
          <a href={`mailto:${supportEmail}`} className="block text-white text-[18px] md:text-[18px] font-black hover:text-[#00A859] transition-colors">
            {supportEmail}
          </a>
          <p className="text-white/80 inline-flex items-start gap-2">
            <MapPin className="w-5 h-5 text-[#00A859] mt-0.5" />
            {address}
          </p>
          <p className="text-white/80 inline-flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#00A859]" />
            {phone}
          </p>
          <p className="text-white/80 inline-flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#00A859]" />
            {email}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-white/70">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
