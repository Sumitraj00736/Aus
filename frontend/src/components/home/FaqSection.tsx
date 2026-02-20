import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    apiRequest<any[]>('/public/faqs?pageKey=home')
      .then((rows) => setFaqs(rows))
      .catch(() => undefined);
  }, []);

  return (
    <section className="py-24 bg-[#f1f3f6]">
      <div className="page-container grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <div>
          <p className="text-[#555] text-[13px] font-bold uppercase tracking-widest mb-4">Frequently Asked Question</p>
          <h2 className="text-[38px] md:text-[64px] leading-[0.95] font-bold text-[#1f2c3c] mb-8">
            You Have <span className="text-[#00A859]">Questions,</span>
            <br />
            <span className="text-[#00A859]">We Have</span> Answers
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const open = idx === active;
              return (
                <article key={faq._id || idx} className="rounded-[18px] border border-[#d9dee4] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActive(open ? -1 : idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-[#1f2c3c] text-[24px] font-semibold">{faq.question}</span>
                    {open ? <Minus className="w-5 h-5 text-[#00A859]" /> : <Plus className="w-5 h-5 text-[#1f2c3c]" />}
                  </button>
                  {open ? <p className="px-6 pb-6 text-[#61717f] text-[16px] leading-relaxed">{faq.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1100&q=80"
          alt="FAQ support"
          className="w-full h-[560px] object-cover rounded-[24px]"
        />
      </div>
    </section>
  );
};

export default FaqSection;
