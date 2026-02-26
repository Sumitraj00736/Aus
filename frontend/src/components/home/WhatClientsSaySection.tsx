import React, { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { apiRequest } from "../../lib/api";

const WhatClientsSaySection: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/public/testimonials")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => undefined);
  }, []);

  const testimonials = useMemo(
    () =>
      rows.length
        ? rows
        : [
            {
              _id: "fallback-1",
              name: "Dishes Cleaning",
              role: "Manager",
              image: "https://i.pravatar.cc/150?img=32",
              quote:
                "Working with the team has been a real pleasure. It doesn't feel like an offshore operation – the team work as one. It's been comforting to know that when you have your back to the wall, they are standing there beside you.",
              rating: 5,
            },
          ],
    [rows]
  );

  return (
    <section className="py-24 bg-white font-poppins overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE: Static Image & Rating Card */}
          <div className="relative">
            <div className="relative w-full aspect-[0.85/1]">
              {/* Folder Tab Shape Background */}
               {/* SVG ClipPath Definition */}
  <svg width="0" height="0">
    <defs>
      <clipPath id="appleCutClip" clipPathUnits="objectBoundingBox">
        <path d="
          M0,0 
          H0.7 
          C0.75,0 0.78,0.08 0.85,0.12
          C0.92,0.16 1,0.05 1,0.2
          V1 
          H0 
          Z
        " />
      </clipPath>
    </defs>
  </svg>

  {/* Container with Clip */}
  <div
    className="absolute inset-0 bg-[#00A859] overflow-hidden"
    style={{
      clipPath: "url(#appleCutClip)",
      borderRadius: '50px'
    }}
  >
    <img
      src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200"
      alt="Apple style cut"
      className="absolute inset-0 w-full h-full object-cover"
    />
              </div>

              {/* Floating Ratings Card */}
              <div className="absolute bottom-10 left-6 right-6 md:left-10 md:w-[320px] bg-[#fdfdfb] rounded-[30px] p-6 shadow-2xl z-20 border border-gray-100">
                <h4 className="text-[#1f2c3c] text-[24px] font-bold mb-1">
                  Ratings 4.5
                </h4>
                <p className="text-[#666] text-[14px] mb-4">
                  Clients praise our exceptional work.
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-3 mr-4">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i + 20}`}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        alt=""
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-[#00A859] border-2 border-white flex items-center justify-center text-white text-[12px] font-bold">
                      +
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-[#1f2c3c]">
                    586k Clients <br />
                    <span className="font-normal text-gray-500">globally</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Auto Slider Content */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#00A859] font-bold text-xl">✦</span>
              <p className="text-[#555] text-[13px] font-bold uppercase tracking-[0.2em]">
                What Clients Say
              </p>
            </div>

<h2 className="text-[42px] md:text-[64px] leading-[1.05] font-bold text-[#1f2c3c] mb-8">
  Hear What <span className="text-[#00A859]">Our</span>
  <br />
  <span className="text-[#00A859]">Global Clients</span> Say
</h2>

<Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 5000 }}
  pagination={{
    el: ".custom-pagination",
    clickable: true,
  }}
  className="mt-8"
>
  {testimonials.map((t) => (
    <SwiperSlide key={t._id || t.name}>
      <div className="flex flex-col h-full min-h-[380px] justify-between">
        
        {/* TOP CONTENT */}
        <div>
          <div className="flex gap-1 mb-6">
            {[...Array(Math.max(1, Number(t.rating || 0)))].map((_, i) => (
              <Star
                key={i}
                size={20}
                className="text-[var(--theme-primary)] fill-[var(--theme-primary)]"
              />
            ))}
          </div>

          <p className="text-[#5f5f5f] text-[18px] md:text-[20px] leading-relaxed">
            "{t.quote}"
          </p>
        </div>

        {/* PROFILE SECTION — Always Bottom */}
        <div className="flex items-center gap-4 mt-8">
          <img
            src={t.image || "https://i.pravatar.cc/150?img=32"}
            alt={t.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="text-[#1f2c3c] text-[22px] font-bold leading-none mb-1">
              {t.name}
            </h4>
            <p className="text-[#666] text-[16px]">
              {t.role || "Client"}
            </p>
          </div>
        </div>

      </div>
    </SwiperSlide>
  ))}
</Swiper>

{/* Custom Pagination Container to match design */}
<div className="custom-pagination mt-12 flex gap-3"></div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: var(--theme-primary) !important;
          width: 12px;
        }
      `}</style>
    </section>
  );
};

export default WhatClientsSaySection;
