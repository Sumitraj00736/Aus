import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookServiceSection: React.FC = () => {
  return (
    <section id="book-service" className="py-24 bg-[#f2f2ee] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover mix-blend-soft-light"
        />
      </div>

      <div className="page-container relative z-10 max-w-[1240px] grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div className="relative min-h-[520px]">
          <img
            src="/images/image.png"
            alt="Cleaning agency"
            className="w-[86%] h-[500px] object-cover rounded-[24px] border border-[#dde3e9]"
          />
          <img
            src="/images/image2.png"
            alt="Cleaning detail"
            className="absolute -bottom-8 right-0 w-[58%] h-[260px] object-cover rounded-[18px] border-[5px] border-[#f2f2ee] shadow-lg"
          />
        </div>

        <div>
          <p className="inline-flex items-center gap-2 text-[14px] uppercase tracking-wide text-[#5f666f] font-semibold mb-3">
            <span className="text-[#00A859]">✦</span> About Cleaning Agency
          </p>

          <h2 className="text-[52px] md:text-[72px] leading-[0.93] font-semibold text-[#1f2c3c] mb-5">
            We Offer A <span className="text-[#00A859]">Wide Range</span>
            <br />
            <span className="text-[#00A859]">Of Specialist</span> Cleaning
            <br />
            Services.
          </h2>

          <p className="text-[#596573] text-[17px] leading-[1.65] max-w-[700px] pb-8 border-b border-[#d8dee5] mb-8">
            We are committed to delivering exceptional cleaning services that leave your spaces sparkling clean and hygienic. Our
            professional team uses eco-friendly products to ensure a safe and healthy environment for you.
          </p>

          <Link
            to="/book-service"
            className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white h-[60px] rounded-full px-8 text-[17px] font-semibold transition-colors"
          >
            Book A Service
            <span className="w-9 h-9 rounded-full bg-white text-[#00A859] grid place-items-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookServiceSection;
