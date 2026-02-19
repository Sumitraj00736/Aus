import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeHeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#1a1a1a]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2400&q=80"
          alt="Cleaning professionals"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(0,168,89,0.22),transparent_38%)]" />
      </div>

      <div className="relative z-20 max-w-[1240px] mx-auto px-4 xl:px-6 pt-[160px] pb-[100px] w-full">
        <div className="max-w-[900px]">
          <h1 className="text-white text-[48px] sm:text-[60px] md:text-[80px] lg:text-[96px] font-extrabold leading-[1.05] tracking-[-0.02em] mb-6">
            Your Trusted <span className="text-[#00A859]">Home</span>
            <br />
            <span className="text-[#00A859]">Clean</span> Solutions
          </h1>

          <p className="text-[16px] sm:text-[18px] md:text-[20px] text-white/90 max-w-[750px] leading-relaxed mb-8">
            We take pride in our attention to detail and commitment to customer satisfaction. Whether you require regular
            maintenance or deep cleaning, our team ensures your home stays spotless.
          </p>

          <Link
            to="/services"
            className="inline-flex items-center gap-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-[22px] sm:text-[24px] md:text-[26px] px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-colors group shadow-lg"
          >
            Explore Services
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white grid place-items-center">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A859]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
