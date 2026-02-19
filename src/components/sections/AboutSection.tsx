import React from 'react';
import { ArrowRight } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Two overlapping images */}
          <div className="relative h-[540px]">
            {/* Main large image */}
            <div className="absolute top-0 left-0 w-[72%] h-[80%] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
                alt="Cleaner giving thumbs up"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Overlapping second image rotated */}
            <div
              className="absolute bottom-0 right-0 w-[55%] h-[62%] rounded-2xl overflow-hidden shadow-2xl"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80"
                alt="Eco-friendly cleaning"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div>
            {/* Section label */}
            <div className="inline-flex items-center gap-2 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#00A859]">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#00A859" />
              </svg>
              <span className="text-[#00A859] text-[12px] font-bold uppercase tracking-widest">About Cleaning Agency</span>
            </div>

            <h2 className="text-[42px] md:text-[52px] font-black text-[#1a1a1a] leading-[1.05] mb-6">
              Why Will <span className="text-[#00A859]">You Choose</span>
              <br />
              <span className="text-[#00A859]">Our</span> Services?
            </h2>

            <p className="text-[16px] text-[#666] leading-relaxed mb-8 max-w-[460px]">
              We are committed to delivering exceptional cleaning services that leave your spaces sparkling clean and hygienic. Our professional team uses eco-friendly products to ensure a safe and healthy environment for you.
            </p>

            {/* Checklist */}
            <ul className="space-y-4 mb-10">
              {[
                'Eco-Friendly Cleaning',
                'Spotless Homes, Affordable Prices',
                'Deep Cleaning, Personalized Service',
                'Premium Home Cleaning',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[16px] font-bold text-[#1a1a1a]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00A859] flex items-center justify-center">
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#00A859] text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-300 group"
            >
              Book A Service
              <span className="flex items-center justify-center w-8 h-8 bg-[#00A859] group-hover:bg-white rounded-full transition-colors duration-300">
                <ArrowRight className="w-4 h-4 text-white group-hover:text-[#00A859] transition-colors duration-300" strokeWidth={3} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
