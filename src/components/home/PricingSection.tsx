import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic Plan',
    price: '$66.0',
    features: [
      'All Cleaning Tasks',
      'Deep Cleaning & Sanitization',
      'Green Cleaning Products Provided',
      'Advanced Cleaning Technology',
      'Scheduled Maintenance Plans',
      '24/7 Customer Support',
    ],
  },
  {
    name: 'Premium Plan',
    price: '$120',
    features: [
      'All Cleaning Tasks',
      'Deep Cleaning & Sanitization',
      'Green Cleaning Products Provided',
      'Advanced Cleaning Technology',
      'Scheduled Maintenance Plans',
      '24/7 Customer Support',
    ],
  },
];

const PricingSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f3f3f3]">
      <div className="max-w-[1400px] mx-auto px-4 xl:px-6">
        <div className="text-center mb-12">
          <p className="text-[#555] text-[14px] font-bold uppercase tracking-widest mb-4">Pricing Plan</p>
          <h2 className="text-[30px] md:text-[58px] leading-[0.9] font-black text-[#1f2c3c]">
            Pricing <span className="text-[#00A859]">That Suits</span>
            <br />
            <span className="text-[#00A859]">Your</span> Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_0.9fr] gap-6 items-stretch">
          {plans.map((plan) => (
            <article key={plan.name} className="bg-white rounded-[26px] p-8 md:p-10 border border-[#ececec]">
              <h3 className="text-[28px] md:text-[28px] font-black text-[#1f2c3c] mb-4">{plan.name}</h3>
              <p className="text-[#666] text-[18px] md:text-[18px] leading-tight mb-6">
                Our foundation plan offers essential features at affordable price breaking the bank.
              </p>
              <div className="flex items-end gap-2 mb-8">
                <p className="text-[#00A859] text-[56px] leading-none font-black">{plan.price}</p>
                <p className="text-[#555] text-[20px] md:text-[20px] mb-2">/ Per Month</p>
              </div>

              <ul className="space-y-4 mb-10 border-t border-[#ececec] pt-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#243242] text-[18px] md:text-[18px] font-semibold">
                    <CheckCircle2 className="w-6 h-6 text-[#00A859] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#1f2c3c] hover:bg-[#00A859] text-white font-bold text-[26px] px-8 py-4 rounded-full transition-colors group"
              >
                Purchase Now
                <span className="w-8 h-8 rounded-full bg-[#00A859] group-hover:bg-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:text-[#00A859]" />
                </span>
              </Link>
            </article>
          ))}

          <aside className="rounded-[26px] overflow-hidden bg-gradient-to-b from-[#112a1f] via-[#0d5f32] to-[#00A859] text-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-[38px] md:text-[50px] leading-[0.9] font-black mb-5">
                Your Home, <span className="text-[#00d16f]">Your Haven.</span>
                <br />
                Let Us Keep It That Way
              </h3>
            </div>
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80"
              alt="Happy cleaner"
              className="w-full h-[400px] object-cover rounded-[18px]"
            />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
