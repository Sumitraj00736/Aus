import React from 'react';

const HeaderTopBar: React.FC = () => {
  return (
    <div
      className="w-full bg-[#262626] h-[54px] flex items-center justify-center px-4 md:px-5 border-b border-black/10 animate-nav-enter"
      style={{ position: 'relative', zIndex: 1000 }}
    >
      <div className="w-full max-w-[1550px] flex items-center justify-between mx-auto">
        <a
          href="https://themeforest.net/item/cetro-cleaning-service-wordpress-theme/53545041"
          className="inline-block"
          aria-label="Envato Market"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5b7f31f3-d67f-460f-9127-903fa7eb9231-preview-themeforest-net/assets/images/envato_market-dd390ae860330996644c1c109912d2bf6388-2.svg"
            alt="envato market"
            className="h-[18px] w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
          />
        </a>

        <a
          href="https://themeforest.net/checkout/from_item/53545041?license=regular&support=bundle_6month"
          className="bg-[#82b440] hover:bg-[#6f9a37] text-white text-[14px] font-semibold flex items-center justify-center h-[34px] px-[20px] rounded-[4px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)] transition-colors duration-200"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          target="_blank"
          rel="noreferrer"
        >
          Buy now
        </a>
      </div>
    </div>
  );
};

export default HeaderTopBar;
