import React from 'react';

type PageHeroProps = {
  title: string;
  subtitle: string;
};

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="relative w-full pt-[140px] pb-[90px] bg-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,168,89,0.28),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(0,168,89,0.16),transparent_40%)]" />
      </div>
      <div className="relative z-10 page-container">
        <h1 className="text-[34px] md:text-[52px] font-bold leading-[1.04] text-white mb-3">{title}</h1>
        <p className="text-white/75 text-[15px] md:text-[17px] max-w-[620px]">{subtitle}</p>
      </div>
    </section>
  );
};

export default PageHero;
