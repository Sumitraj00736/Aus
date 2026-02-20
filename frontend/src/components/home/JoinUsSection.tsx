import React from 'react';
import { ArrowRight } from 'lucide-react';

const JoinUsSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#243242] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1800&q=80"
        alt="Join newsletter background"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[#243242]/80" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 xl:px-6 text-center">
        <h2 className="text-white text-[30px] md:text-[56px] leading-[0.9] font-black mb-10">
          Join Our <span className="text-[#00A859]">Newsletter</span>
          <br />
          <span className="text-[#00A859]">Stay Up To</span> Date
        </h2>

        <form className="max-w-[760px] mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email address..."
            className="h-14 flex-1 rounded-full px-6 text-[#1f2c3c] outline-none"
            aria-label="Email address"
          />
          <button
            type="button"
            className="h-14 px-7 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            Subscribe Now
            <span className="w-6 h-6 rounded-full bg-white text-[#00A859] grid place-items-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default JoinUsSection;
