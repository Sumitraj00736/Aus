import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { apiRequest } from '../../lib/api';

import 'swiper/css';
import 'swiper/css/pagination';

const OurProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    apiRequest<any[]>('/public/projects')
      .then((rows) => {
        if (rows?.length) {
          setProjects(rows);
          return;
        }
        setProjects([
          {
            _id: 'fallback-project',
            slug: 'sparkle-residential-project',
            coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
            title: 'Sparkle Residential Project',
            excerpt: 'Premium residential deep cleaning and maintenance for a modern family home.',
          },
        ]);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="py-24 bg-[#f2f2ee] font-poppins">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#00A859]" />
            <p className="text-[#555] text-[13px] font-bold uppercase tracking-[0.2em]">
              Our Projects
            </p>
          </div>

          <h2 className="text-[42px] md:text-[64px] leading-[1.05] font-bold text-[#1f2c3c]">
            You Can Check <span className="text-[#00A859]">Portfolio</span><br />
            To Check Quality.
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          speed={900}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {projects.map((project) => (
            <SwiperSlide key={project._id}>
              <div className="group relative">
                <Link to={`/project/${project.slug}`} className="block w-full h-[350px] rounded-[25px] overflow-hidden 
                                shadow-md transition-all duration-500 
                                group-hover:shadow-[0_10px_30px_rgba(0,168,89,0.35)] 
                                border border-transparent 
                                group-hover:border-[#00A859] relative">

                  {/* Image */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover 
                               transition-transform duration-700 
                               ease-[cubic-bezier(.4,0,.2,1)] 
                               group-hover:scale-110"
                  />

                  {/* Green Gradient Overlay */}
                  <div className="absolute inset-0 
                                  bg-gradient-to-t 
                                  from-[#00A859]/70 
                                  via-black/40 
                                  to-transparent 
                                  opacity-0 
                                  group-hover:opacity-100 
                                  transition-opacity duration-500"></div>

                  {/* Sliding Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 
                                  translate-y-full 
                                  group-hover:translate-y-0 
                                  transition-transform duration-700 
                                  ease-[cubic-bezier(.4,0,.2,1)]">

                    <h3 className="text-white text-lg font-semibold mb-2 relative inline-block">
                      {project.title}
                      {/* Green underline animation */}
                      <span className="block h-[2px] bg-white mt-1 w-0 
                                       group-hover:w-full 
                                       transition-all duration-500"></span>
                    </h3>

                    <p className="text-white/90 text-sm">
                      {project.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Pagination Styling */}
      <style>{`
        .swiper-pagination {
          margin-top: 40px;
          position: relative;
        }

        .swiper-pagination-bullet {
          background: #ccc;
          opacity: 1;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #00A859;
          width: 25px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default OurProjectsSection;
