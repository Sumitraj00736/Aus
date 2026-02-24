import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import JoinUsSection from '../../components/home/JoinUsSection';
import Footer from '../../components/layout/Footer';
import { apiRequest } from '../../lib/api';

type ServiceItem = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  cardImage: string;
};

// --- Animated Card Component ---
const FlipCard: React.FC<{ service: ServiceItem; idx: number }> = ({ service, idx }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // rotation: starts tilted back (60deg) and flattens (0deg)
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, 0]);
  // scale: grows slightly as it comes into focus
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  // opacity: fades in
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center sticky top-0">
      <motion.div
        style={{ 
          rotateX, 
          opacity, 
          scale,
          perspective: "1500px", 
          transformOrigin: "top center" 
        }}
        className="w-full"
      >
        <article 
          className={`flex flex-col md:flex-row bg-white rounded-[50px] overflow-hidden min-h-[500px] group shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
            idx % 2 !== 0 ? 'md:flex-row-reverse' : ''
          }`}
          style={{ 
            // The signature notch for the arrow button
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 93% 100%, 0% 100%)' 
          }}
        >
          {/* Image Section */}
          <div className="w-full md:w-1/2 overflow-hidden">
            <img 
              src={service.cardImage} 
              alt={service.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative bg-white">
            <h3 className="text-[42px] lg:text-[64px] font-bold text-[#1f2c3c] leading-[1.1] mb-6">
              {service.title}
            </h3>
            
            <div className="w-full h-px bg-gray-100 mb-8" />
            
            <p className="text-[#666] text-lg lg:text-xl leading-relaxed mb-10">
              {service.shortDescription}
            </p>

            {/* The Arrow Button nested in the corner notch */}
            <Link
              to={`/services/${service.slug}`}
              className="absolute bottom-0 right-0 w-20 h-20 bg-white flex items-center justify-center text-[#1f2c3c] group-hover:bg-[#00A859] group-hover:text-white border-t border-l border-gray-50 transition-all duration-300 z-10"
              style={{ borderRadius: '40px 0 0 0' }}
            >
              <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </article>
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    apiRequest<ServiceItem[]>('/public/services')
      .then((data) => {
        // Fallback data if API is empty to ensure visibility
        if (!data || data.length === 0) {
          setServices([
            { _id: '1', slug: 'construction', title: 'Construction Cleaning', shortDescription: 'We understand the importance of maintaining a clean and professional environment.', cardImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200' },
            { _id: '2', slug: 'move-in', title: 'Move In Out Cleaning', shortDescription: 'The housekeepers we hired are professionals who take pride in doing excellent work.', cardImage: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1200' }
          ]);
        } else {
          setServices(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#053d38]">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=2200" className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-20 text-center text-white px-6">
          <h1 className="text-[54px] md:text-[80px] font-bold leading-tight mb-4">Our Services</h1>
          <p className="text-[#00A859] font-bold uppercase tracking-widest">Home / Services</p>
        </div>
      </section>

      {/* Stacked Animated Cards */}
      <section className="pb-32 relative">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center py-20 text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#00A859]" />
              <p className="text-[#9de5cd] text-[14px] font-bold uppercase tracking-widest">Premium Care</p>
            </div>
            <h2 className="text-[48px] md:text-[72px] font-bold leading-none">
              Check <span className="text-[#00A859]">Our Best</span> Solutions
            </h2>
          </div>

          <div className="flex flex-col">
            {services.map((service, idx) => (
              <FlipCard key={service._id} service={service} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </div>
  );
};

export default ServicesPage;