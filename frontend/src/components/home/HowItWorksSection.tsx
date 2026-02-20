import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

const HowItWorksSection: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    apiRequest<any[]>('/public/how-it-works')
      .then((rows) => setSteps(rows))
      .catch(() => undefined);
  }, []);

  return (
    <section className="py-24 bg-[#f3f3f3]">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-6">
        <p className="text-[#555] text-[14px] font-bold uppercase tracking-widest mb-5">How It Works</p>
        <h2 className="text-[40px] md:text-[58px] leading-[0.9] font-black text-[#1f2c3c] mb-14">
          Get Cleaner <span className="text-[#00A859]">Space</span>
          <br />
          <span className="text-[#00A859]">In Four</span> Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <article key={step._id || step.step || idx} className="rounded-[28px] border border-[#dfe3e7] bg-white p-4">
              <div className="relative mb-6">
                <img src={step.image} alt={step.title} className="w-full h-[250px] object-cover rounded-[22px]" />
                <span className="absolute -bottom-4 right-6 w-14 h-14 rounded-full bg-[#00A859] text-white text-[22px] font-black grid place-items-center">
                  {step.step || `0${idx + 1}`}
                </span>
              </div>
              <h3 className="text-[28px] md:text-[28px] font-black text-[#1f2c3c] leading-none mb-3">{step.title}</h3>
              <p className="text-[#666] text-[29px] md:text-[18px] leading-tight">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
