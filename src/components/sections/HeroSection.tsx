import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#1a1a1a]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5b7f31f3-d67f-460f-9127-903fa7eb9231-preview-themeforest-net/assets/images/1-1.gif"
          alt="Cleaning professionals"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-[1240px] mx-auto px-4 xl:px-6 pt-[120px] pb-[100px] w-full">
        <div className="max-w-[750px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="w-8 h-[2px] bg-[#00A859]" />
            <span className="text-[#00A859] text-[15px] font-semibold uppercase tracking-widest">
              Professional Cleaning
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title text-white mb-8 leading-[0.93]">
            Clean{' '}
            <span className="text-[#00A859]">Space</span>
            <br />
            <span className="text-[#00A859]">Starts</span> Here
          </h1>

          {/* Description */}
          <p className="text-[18px] md:text-[20px] text-white/85 font-normal max-w-[480px] mb-12 leading-relaxed">
            Professional cleaning services for offices, homes, and commercial spaces — done right, every time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#services"
              className="btn-pill bg-[#00A859] hover:bg-[#008f4c] text-white font-bold text-[16px] flex items-center gap-3 group"
            >
              Our Services
              <span className="flex items-center justify-center w-[28px] h-[28px] bg-white rounded-full transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 text-[#00A859]" strokeWidth={3} />
              </span>
            </a>
            <a
              href="#about"
              className="btn-pill border-2 border-white/40 hover:border-white text-white font-bold text-[16px] hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/15">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '200+', label: 'Happy Clients' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <p className="text-[42px] font-black leading-none text-[#00A859]">{stat.value}</p>
                <p className="text-[14px] font-medium text-white/70 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[11px] font-semibold uppercase tracking-widest">Scroll Down</span>
        <div className="w-[1px] h-10 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
