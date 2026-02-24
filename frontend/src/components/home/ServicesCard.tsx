import React, { useEffect, useState } from 'react';
import { ArrowRight, Brush, Home, Building, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const iconMap: { [key: string]: React.ElementType } = {
  painting: Brush,
  residential: Home,
  commercial: Building,
  restoration: Layers,
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<any[]>('/public/services')
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2ee] font-poppins text-2xl">
        Loading Services...
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2ee] font-poppins text-xl text-gray-500">
        No services found.
      </div>
    );
  }

  return (
    <div className="font-poppins bg-[#f2f2ee] py-20 overflow-hidden">
      <section className="max-w-[1400px] mx-auto px-6">
        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x">
          {services.map((service) => {
            const Icon = iconMap[service.slug] || Brush;

            return (
              <article
                key={service._id}
                className="group relative min-w-[320px] md:min-w-[380px] bg-white rounded-[40px] p-10 pt-12 pb-16 transition-all duration-500  hover:-translate-y-2 snap-start"
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-[#1f2c3c] text-[32px] font-bold leading-[1.1] tracking-tight">
                    {service.title || 'Untitled Service'}
                  </h3>
                  <div className="w-16 h-16 rounded-full bg-[#a2ff86] flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                    <Icon size={28} className="text-[#1f2c3c]" />
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100 mb-8" />

                <p className="text-[#5f5f5f] text-[16px] leading-relaxed mb-10 opacity-90">
                  {service.shortDescription ||
                    'Specialized services including residential, commercial, and restoration painting.'}
                </p>

                {/* Enhanced Cut-Out Corner */}
                <div className="absolute bottom-0 right-0 w-28 h-28">
                  {/* Larger smooth corner cut */}
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[#f2f2ee] rounded-tl-[64px] " />
                  <Link
                    to={`/services/${service.slug}`}
                    className="absolute bottom-5 right-5 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:bg-[#00A859] group-hover:text-white transition-all duration-300 z-10 border border-gray-100 group-hover:border-transparent"
                  >
                    <ArrowRight size={28} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Marquee Section */}
      <section className="mt-12 overflow-hidden pointer-events-none select-none">
        <div className="flex gap-16 whitespace-nowrap animate-infinite-scroll items-center">
          {[1, 2].map((set) => (
            <div key={set} className="flex gap-16 items-center">
              {['SWEEPING', 'VACUUM', 'CLEANING', 'WASHING'].map((text, idx) => (
                <div key={idx} className="flex items-center gap-16">
                  <span className="text-[140px] font-bold text-transparent stroke-text opacity-10 tracking-tighter">
                    {text}
                  </span>
                  <div className="w-14 h-14 bg-[#00A859] rounded-full flex items-center justify-center text-white">
                    <ArrowRight className="-rotate-45" size={32} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .stroke-text { -webkit-text-stroke: 2px #1f2c3c; }
        @keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-infinite-scroll { animation: infinite-scroll 40s linear infinite; display: flex; width: max-content; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ServicesPage;