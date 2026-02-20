import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cetro_cookie_banner_closed';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consentClosed = window.localStorage.getItem(STORAGE_KEY) === 'true';
    if (consentClosed) return;

    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white flex flex-col md:flex-row md:items-center md:h-[114px] p-4 md:px-[80px] xl:px-[145px]"
      style={{ boxShadow: 'rgba(0,0,0,0.3) 0px 30px 70px 0px' }}
    >
      <div className="flex-1 mb-4 md:mb-0 md:pr-10">
        <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-1">Your privacy matters</h2>
        <p className="text-[14px] text-[#707070] leading-relaxed">
          We use cookies to enhance your experience, analyse traffic, and serve personalised content.
          Accept Cookies to consent per our Cookie and Privacy policies.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <button
          onClick={close}
          className="min-w-[180px] h-11 px-5 rounded border border-[#1a1a1a] text-[14px] font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
        >
          Accept Cookies
        </button>
        <button
          onClick={close}
          className="min-w-[180px] h-11 px-5 rounded border border-[#d1d1d1] text-[14px] font-semibold text-[#707070] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200"
        >
          Manage preferences
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
