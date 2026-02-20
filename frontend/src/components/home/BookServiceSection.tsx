import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookServiceSection: React.FC = () => {
  const points = [
    'Eco-Friendly Cleaning',
    'Spotless Homes, Affordable Prices',
    'Deep Cleaning, Personalized Service',
    'Premium Home Cleaning',
  ];

  return (
    <section id="book-service" className="py-24 bg-[#f2f2ee] overflow-hidden">
      <div className="page-container grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div className="relative min-h-[540px]">
          <img
            src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80"
            alt="Cleaning team"
            className="w-[88%] h-[520px] object-cover rounded-[30px] border border-[#dce1e6]"
          />
          <img
            src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=900&q=80"
            alt="Cleaning spray"
            className="absolute -bottom-10 right-0 w-[58%] h-[290px] object-cover rounded-[24px] border-[6px] border-[#f2f2ee] shadow-xl"
          />
        </div>

        <div className="relative">
          <p className="text-[#5a6773] text-[14px] font-semibold uppercase tracking-widest mb-4">About Cleaning Agency</p>
          <h2 className="text-[#1f2c3c] text-[52px] md:text-[82px] font-bold leading-[0.95] mb-6">
            Why Will <span className="text-[#00A859]">You Choose</span>
            <br />
            <span className="text-[#00A859]">Our</span> Services?
          </h2>
          <p className="text-[#5e6975] text-[16px] leading-relaxed mb-6 max-w-[620px]">
            We are committed to delivering exceptional cleaning services that leave your spaces sparkling clean and hygienic.
            Our professional team uses eco-friendly products to ensure a safe and healthy environment for you.
          </p>
          <div className="space-y-3 mb-9">
            {points.map((item) => (
              <p key={item} className="inline-flex items-center gap-3 text-[#1f2c3c] text-[18px] font-semibold w-full">
                <CheckCircle2 className="w-5 h-5 text-[#00A859]" />
                {item}
              </p>
            ))}
          </div>
          <Link
            to="/book-service"
            className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white h-[64px] rounded-full px-8 text-[16px] font-semibold transition-colors"
          >
            Book A Service
            <span className="w-9 h-9 rounded-full bg-[#00A859] grid place-items-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookServiceSection;
