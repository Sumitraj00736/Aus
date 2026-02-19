import React, { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const services = [
  {
    title: 'Industrial Cleaning',
    description: 'Specialized deep cleaning for industrial facilities, maintaining safety and compliance standards.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  },
  {
    title: 'Move In Out Cleaning',
    description: 'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
  },
  {
    title: 'Regular Home Cleaning',
    description: 'Our house cleaning services are designed to keep your home tidy, and healthy. We take care of all the essential cleaning tasks, from dusting.',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
  },
  {
    title: 'Skilled Cleaning',
    description: 'For those times when your home needs more than just a surface clean, our deep cleaning service offers a thorough, detailed approach.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
  },
  {
    title: 'Specialized Cleaning',
    description: 'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=600&q=80',
  },
  {
    title: 'Window Cleaning',
    description: 'Crystal clear windows inside and out, using streak-free methods for multi-story buildings and homes.',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80',
  },
];

const ServicesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(1);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 420;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' });
    setActiveIdx((prev) =>
      dir === 'right' ? Math.min(prev + 1, services.length - 1) : Math.max(prev - 1, 0)
    );
  };

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#00A859">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
            </svg>
            <span className="text-[#00A859] text-[12px] font-bold uppercase tracking-widest border border-[#00A859] px-3 py-1 rounded-full">
              Featured Service
            </span>
          </div>
          <h2 className="text-[44px] md:text-[58px] font-black text-[#1a1a1a] leading-[1.05]">
            Our Company <span className="text-[#00A859]">Provide The</span>
            <br />
            <span className="text-[#00A859]">Best</span> Cleaning Service
          </h2>
        </div>
      </div>

      {/* Scrollable card strip — full width */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-[max(1rem,calc((100vw-1240px)/2+1rem))] pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className="flex-shrink-0 w-[380px] md:w-[420px] rounded-2xl overflow-hidden relative group cursor-pointer"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image */}
              <img
                src={svc.image}
                alt={svc.title}
                className="w-full h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h3 className="text-[22px] font-black text-white mb-2">{svc.title}</h3>
                <p className="text-[14px] text-white/75 leading-relaxed mb-5">{svc.description}</p>
                <button className="w-10 h-10 rounded-full bg-[#00A859] hover:bg-[#008f4c] flex items-center justify-center transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-white" strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border-2 border-[#ddd] hover:border-[#00A859] hover:bg-[#00A859] text-[#1a1a1a] hover:text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border-2 border-[#ddd] hover:border-[#00A859] hover:bg-[#00A859] text-[#1a1a1a] hover:text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
