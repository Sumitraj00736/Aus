import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const WhyChooseUsSection: React.FC = () => {
  const [section, setSection] = useState<any>(null);

  useEffect(() => {
    apiRequest('/public/pages/home')
      .then((page) => setSection(page?.sections?.whyChooseUs || null))
      .catch(() => undefined);
  }, []);

  const bullets = section?.bullets?.length
    ? section.bullets
    : [
        { title: '100% Satisfaction', description: 'Guaranteed high-quality cleaning outcomes with strict quality checks.' },
        { title: 'Eco-Friendly Cleaning Products', description: 'Safe and non-toxic products for family, pets, and environment.' },
        { title: 'Trusted Professionals', description: 'Experienced cleaners trained for residential and commercial spaces.' },
        { title: 'Flexible Scheduling', description: 'Daily, weekly, and custom plans based on your routine and needs.' },
        { title: 'Transparent Pricing', description: 'No hidden costs, clear estimates, and predictable billing.' },
        { title: 'Fast Support', description: 'Quick response team for bookings, updates, and issue resolution.' },
      ];

  return (
    <section className="py-24 bg-[#f5f5f5]">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={section?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=80'}
            alt="Professional cleaner at work"
            className="w-full h-[620px] object-cover rounded-[34px]"
          />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[#00A859]">✦</span>
            <span className="text-[#555] text-[13px] font-bold uppercase tracking-wider">{section?.eyebrow || 'Why Choosing Us'}</span>
          </div>

          <h2 className="text-[32px] md:text-[56px] leading-[0.95] font-black text-[#1f2c3c] mb-5">
            {section?.title || 'We Make Your Home Sparkle And Shine'}
          </h2>

          <p className="text-[#666] text-[16px] leading-relaxed mb-8 max-w-[620px]">
            {section?.description ||
              'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {bullets.slice(0, 6).map((feature: any, idx: number) => (
              <div key={`${feature.title}-${idx}`} className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#86ef72] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {feature.iconImage ? (
                    <img src={feature.iconImage} alt={feature.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-[#16302d] text-xl">✦</span>
                  )}
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#1f2c3c] leading-tight mb-1">{feature.title}</h3>
                  <p className="text-[#666] text-[14px] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white font-bold text-[16px] px-8 py-4 rounded-full transition-all duration-300 group"
          >
            Take Counsel
            <span className="w-9 h-9 rounded-full bg-[#00A859] group-hover:bg-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-white group-hover:text-[#00A859]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
