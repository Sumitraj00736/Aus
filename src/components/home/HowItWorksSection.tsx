import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Provide The Details',
    text: 'Fill out a quick form with details about your space, schedule, and preferences.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=700&q=80',
  },
  {
    number: '02',
    title: 'Pick A Suitable Plan',
    text: 'We will send you a personalized estimate, no hidden fees, no upselling.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80',
  },
  {
    number: '03',
    title: 'We House Cleaned',
    text: 'Our team arrives on time, equipped, and ready to clean thoroughly.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=80',
  },
  {
    number: '04',
    title: 'You Enjoy & Relax',
    text: 'Enjoy a spotless home or workspace that looks, feels, and smells truly clean.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80',
  },
];

const HowItWorksSection: React.FC = () => {
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
          {steps.map((step) => (
            <article key={step.number} className="rounded-[28px] border border-[#dfe3e7] bg-white p-4">
              <div className="relative mb-6">
                <img src={step.image} alt={step.title} className="w-full h-[250px] object-cover rounded-[22px]" />
                <span className="absolute -bottom-4 right-6 w-14 h-14 rounded-full bg-[#00A859] text-white text-[22px] font-black grid place-items-center">
                  {step.number}
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
