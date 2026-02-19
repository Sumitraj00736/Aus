import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What types of spaces do you clean?',
    answer: 'We offer cleaning for homes, offices, retail spaces, and even post-renovation sites. Custom packages available based on your needs.',
  },
  {
    question: 'Are your cleaning products eco-friendly?',
    answer: 'Yes. We use eco-conscious, non-toxic products that are effective and safe for families, pets, and workplaces.',
  },
  {
    question: 'How do I book a cleaning session?',
    answer: 'You can call us, submit a form through the website, or request a quote directly from any page.',
  },
  {
    question: 'Do I need to be home during the service?',
    answer: 'Not necessarily. Many clients provide secure access instructions and we update them after completion.',
  },
  {
    question: 'What if I am not satisfied with the service?',
    answer: 'We provide a satisfaction guarantee and a quick re-clean policy when needed.',
  },
];

const FaqSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-[#f3f3f7]">
      <div className="max-w-[1500px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#555] text-[14px] font-bold uppercase tracking-widest mb-4">Frequently Asked Question</p>
          <h2 className="text-[32px] md:text-[58px] leading-[0.9] font-black text-[#1f2c3c] mb-10">
            You Have <span className="text-[#00A859]">Questions,</span>
            <br />
            <span className="text-[#00A859]">We Have</span> Answers
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const open = idx === active;
              return (
                <article key={faq.question} className="bg-white rounded-[18px] border border-[#ececf0] overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between text-left px-6 py-5"
                    onClick={() => setActive(open ? -1 : idx)}
                    aria-expanded={open}
                  >
                    <span className="text-[#212932] text-[24px] md:text-[24px] font-black leading-none">{faq.question}</span>
                    {open ? <Minus className="w-6 h-6 text-[#222]" /> : <Plus className="w-6 h-6 text-[#222]" />}
                  </button>
                  {open && <p className="px-6 pb-6 text-[#666] text-[29px] md:text-[18px] leading-tight">{faq.answer}</p>}
                </article>
              );
            })}
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80"
            alt="Cleaner with supplies"
            className="w-full h-[620px] object-cover rounded-[30px]"
          />
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
