import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

const HowItWorksSection: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([
    // { title: 'Provide The Details', text: 'Fill out a quick form with details about your space, schedule, and preferences.' },
    // { title: 'Pick A Suitable Plan', text: "We'll send you a personalized estimate, no hidden fees, no upselling." },
    // { title: 'We House Cleaned', text: 'Our team arrives on time, equipped, and ready to clean thoroughly.' },
    // { title: 'You Enjoy & Relax', text: 'Enjoy a spotless home or workspace that looks, feels, and smells truly clean.' },
  ]);

  // Controls the entrance animation after component mounts
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    apiRequest<any[]>('/public/how-it-works')
      .then((rows) => {
        if (rows && rows.length > 0) setSteps(rows);
      })
      .catch((err) => console.error("HowItWorks API Error:", err));
  }, []);

  return (
    <section className="relative min-h-[750px] flex items-center py-24 font-poppins overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE & DARK OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1600&q=80" 
          alt="Cleaning Service Background" 
          className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out scale-110"
          style={{ transform: isVisible ? 'scale(1)' : 'scale(1.15)' }}
        />
        {/* Deep Dark Overlay to match design screenshot */}
        <div className="absolute inset-0 bg-[#0a0a0acc]/85 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 w-full">
        
        {/* 2. ANIMATED HEADER SECTION */}
        <div className={`flex flex-col items-center text-center mb-24 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#00A859] text-xl">✦</span>
            <p className="text-white text-[13px] font-bold uppercase tracking-[0.2em]">How It Works</p>
          </div>

          <h2 className="text-white text-[42px] md:text-[68px] leading-[1.05] font-bold">
            Get Cleaner <span className="text-[#00A859]">Space In</span><br />
            <span className="text-[#00A859]">Four</span> Steps
          </h2>
        </div>

        {/* 3. ANIMATED STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {steps.slice(0, 4).map((step, idx) => (
            <article 
              key={idx} 
              className={`relative group transition-all duration-1000 ease-out`}
              style={{ 
                transitionDelay: `${idx * 200}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              {/* Green Line Indicator - Fills on Hover */}
              <div className="absolute -top-6 left-0 w-full h-[1px] bg-white/10">
                <div className={`h-full bg-[#00A859] transition-all duration-700 ${
                  idx === 0 ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </div>

              <div className="flex flex-col">
                <h3 className="text-[#00A859] text-[19px] font-bold mb-4 flex items-center gap-2">
                  <span className="opacity-70">0{idx + 1}.</span> {step.title}
                </h3>
                <p className="text-white/60 text-[15px] leading-relaxed font-light">
                  {step.text || step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;