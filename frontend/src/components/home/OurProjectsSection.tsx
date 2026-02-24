import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const projects = [
  { id: 1, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' },
  { id: 2, image: 'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=800&q=80' },
  { id: 3, image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=800&q=80' },
  { id: 4, image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&q=80' },
  { id: 5, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80' },
  { id: 6, image: 'https://images.unsplash.com/photo-1556911220-e1502235072b?w=800&q=80' },
];

const OurProjectsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f2f2ee] font-poppins overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#00A859]" />
            <p className="text-[#555] text-[13px] font-bold uppercase tracking-[0.2em]">Our Projects</p>
          </div>
          <h2 className="text-[42px] md:text-[64px] leading-[1.05] font-bold text-[#1f2c3c]">
            You Can Check <span className="text-[#00A859]">Portfolio</span><br />
            <span className="text-[#00A859]">To Check</span> Quality.
          </h2>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1.5}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3.5 },
          }}
          className="project-swiper !overflow-visible"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              {({ isActive }) => (
                <div
                  className={`relative transition-all duration-700 ease-in-out ${
                    isActive 
                      ? 'scale-100 opacity-100' 
                      : 'scale-90 opacity-40 mt-10'
                  }`}
                >
                  <div 
                    className="w-full h-[400px] md:h-[550px] overflow-hidden transition-all duration-700"
                    style={{ 
                      // Apply the folder-tab clip-path only when the slide is active (centered)
                      clipPath: isActive 
                        ? 'polygon(0% 0%, 75% 0%, 82% 7%, 100% 7%, 100% 100%, 0% 100%)' 
                        : 'none',
                      borderRadius: '40px'
                    }}
                  >
                    <img
                      src={project.image}
                      alt="Project"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

      
      </div>

      <style>{`
        .project-swiper .swiper-slide {
          transition: transform 0.5s ease;
        }
      `}</style>
    </section>
  );
};

export default OurProjectsSection;