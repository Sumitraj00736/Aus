import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallUsSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#243242] overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1800&q=80"
        alt="Call us background"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#243242]/80" />

      {/* Content */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 xl:px-6 text-center">
        <h2 className="text-white text-[30px] md:text-[56px] leading-[0.9] font-black mb-10">
          Ready to <span className="text-[#00A859]">Transform Your Space?</span>
          <br />
          Call Us <span className="text-[#00A859]">Today</span>
        </h2>

        {/* Phone Number CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <span className="text-white text-[20px] md:text-[28px] font-semibold">
            Phone: <a href="tel:+61420507576" className="text-[#00A859] hover:underline">+61-420-507-576</a>
          </span>
          <a
            href="tel:+61420507576"
            className="h-14 px-7 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            Call Now
            <span className="w-6 h-6 rounded-full bg-white text-[#00A859] grid place-items-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallUsSection;