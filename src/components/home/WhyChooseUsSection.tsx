import React from 'react';
import { ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Sparkles,
    title: '100% Satisfaction',
    text: 'Cleaning services encompass a wide range of tasks related to the installation, repair, and maintenance.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Cleaning Products',
    text: 'Safe methods and green solutions that protect your family while delivering spotless results every visit.',
  },
];

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f5f5f5]">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=80"
            alt="Professional cleaner at work"
            className="w-full h-[620px] object-cover rounded-[34px]"
          />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[#00A859]">✦</span>
            <span className="text-[#555] text-[13px] font-bold uppercase tracking-wider">Why Choosing Us</span>
          </div>

          <h2 className="text-[32px] md:text-[56px] leading-[0.95] font-black text-[#1f2c3c] mb-8">
            We Make <span className="text-[#00A859]">Your Home</span>
            <br />
            <span className="text-[#00A859]">Sparkle</span> And Shine
          </h2>

          <p className="text-[#666] text-[18px] leading-relaxed mb-10 max-w-[620px]">
            The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.
          </p>

          <div className="space-y-8 mb-10">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-full bg-[#86ef72] flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-9 h-9 text-[#16302d]" />
                </div>
                <div>
                  <h3 className="text-[30px] md:text-[30px] font-black text-[#1f2c3c] leading-none mb-2">{feature.title}</h3>
                  <p className="text-[#666] text-[20px] md:text-[18px] leading-tight max-w-[580px]">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white font-bold text-[18px] px-10 py-5 rounded-full transition-all duration-300 group"
          >
            Take Counsel
            <span className="w-10 h-10 rounded-full bg-[#00A859] group-hover:bg-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-white group-hover:text-[#00A859]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
