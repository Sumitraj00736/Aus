import React from 'react';
import { Star } from 'lucide-react';

const WhatClientsSaySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f7f7f7]">
      <div className="max-w-[1500px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[580px] lg:min-h-[760px]">
          <img
            src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&q=80"
            alt="Cleaning team"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#00A859]/30" />
        </div>

        <div className="bg-[#f7f7f7] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <p className="text-[#555] text-[14px] font-bold uppercase tracking-widest mb-4">What Clients Say</p>
          <h2 className="text-[32px] md:text-[56px] leading-[0.9] font-black text-[#1f2c3c] mb-8">
            Hear What <span className="text-[#00A859]">Our</span>
            <br />
            <span className="text-[#00A859]">Global Clients</span> Say
          </h2>

          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-[#00A859]" fill="#00A859" />
            ))}
          </div>

          <p className="text-[#3f4b57] text-[29px] md:text-[18px] leading-tight mb-8">
            Working with us has been a real pleasure and a real experience. The team work as one. It has been comforting
            to know that when you have your back to the wall, we are standing there beside you.
          </p>

          <div className="flex items-center gap-4 pb-8 border-b border-[#e2e2e2] mb-8">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80"
              alt="Client avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[#1f2c3c] text-[24px] md:text-[24px] font-black leading-none">Dishes Cleaning</p>
              <p className="text-[#666] text-[18px] md:text-[18px]">Fresh Design</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <p className="text-[#00A859] text-[56px] font-black leading-none">462+</p>
            <div>
              <p className="text-[#1f2c3c] text-[24px] md:text-[24px] font-black leading-none">Happy Clients</p>
              <p className="text-[#666] text-[29px] md:text-[18px] mt-2 leading-tight">We put our customers at the heart of everything we do.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatClientsSaySection;
