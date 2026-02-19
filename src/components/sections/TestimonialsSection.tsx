import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Office Manager, TechCorp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    rating: 5,
    text: 'Cetro has been cleaning our office for 2 years and the results are consistently outstanding. Our team loves coming to a spotless workplace every Monday morning. Highly recommend!',
  },
  {
    id: 2,
    name: 'James Patterson',
    role: 'Homeowner, Chicago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    rating: 5,
    text: 'I tried several cleaning companies before finding Cetro. The difference is night and day — they\'re thorough, professional, and use products that are safe for my kids and pets. Absolutely fantastic service.',
  },
  {
    id: 3,
    name: 'Linda Torres',
    role: 'Property Manager, Downtown Lofts',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    rating: 5,
    text: 'Managing 40 units means I need a cleaning service I can trust completely. Cetro delivers every single time — on schedule, thorough, and the tenants constantly compliment how clean the common areas are.',
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Restaurant Owner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    rating: 5,
    text: 'Running a restaurant means hygiene is everything. Cetro\'s team understands food-safe standards and their deep cleaning service keeps us up to health code every inspection. Worth every penny.',
  },
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A859]/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00A859]/5 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 xl:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
            <span className="w-8 h-[2px] bg-[#00A859]" />
            <span className="text-[#00A859] text-[13px] font-bold uppercase tracking-widest">Testimonials</span>
            <span className="w-8 h-[2px] bg-[#00A859]" />
          </div>
          <h2 className="section-title text-white">
            What Our <span className="text-[#00A859]">Clients Say</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-[820px] mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 relative">
            {/* Quote icon */}
            <Quote className="absolute top-10 right-10 w-12 h-12 text-[#00A859]/20" fill="currentColor" />

            {/* Stars */}
            <div className="flex gap-1 mb-7">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#00A859]" fill="#00A859" />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-[18px] md:text-[20px] text-white/85 leading-relaxed mb-10 font-normal">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#00A859]"
              />
              <div>
                <p className="text-white font-bold text-[17px]">{t.name}</p>
                <p className="text-white/50 text-[14px] font-medium">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-3 bg-[#00A859]' : 'w-3 h-3 bg-white/25 hover:bg-white/50'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-[#00A859] hover:bg-[#00A859] text-white flex items-center justify-center transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-[#00A859] hover:bg-[#00A859] text-white flex items-center justify-center transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
