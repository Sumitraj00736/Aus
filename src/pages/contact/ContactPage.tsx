import React, { useState } from 'react';
import { ArrowRight, CalendarClock, Mail, MapPin, PhoneCall } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import JoinUsSection from '../../components/home/JoinUsSection';
import { apiRequest } from '../../lib/api';

const contactCards = [
  { title: 'Hotline Number', lines: ['Phone: (+0) 123 678 999', 'Mobile: (+480) 123 678 900'], icon: PhoneCall },
  { title: 'Support Email', lines: ['cetro@mail.com', 'support@example.com'], icon: Mail },
  { title: 'Office Address', lines: ['401 Broadway, 24th Floor, Orchard', 'View, London'], icon: MapPin },
  { title: 'Working Days', lines: ['Mon to Fri - 09:00am To 06:00pm', 'Saturday to Sunday - Closed'], icon: CalendarClock },
];

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('Sending...');
    try {
      await apiRequest('/submissions/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatus('Message sent successfully.');
      setForm({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <>
      <PageHero title="Contact Us" subtitle="Talk to our team and get a customized quote for your cleaning needs." />

      <section className="py-20 md:py-24 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px]">
          <div className="text-center max-w-[860px] mx-auto mb-12 md:mb-14">
            <h2 className="text-[#1f2c3c] text-[40px] md:text-[62px] leading-[0.95] font-bold mb-4">Get <span className="text-[#00A859]">In Touch</span></h2>
            <p className="text-[#616974] text-[16px] md:text-[17px] leading-relaxed">Transform your space with our reliable and eco-friendly cleaning services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
            {contactCards.map((card) => (
              <article key={card.title} className="rounded-[24px] border border-[#dde2e7] bg-[#f5f5f2] p-8 text-center">
                <div className="w-[92px] h-[92px] rounded-full bg-[#86ef72] grid place-items-center mx-auto mb-6"><card.icon className="w-10 h-10 text-[#1f2c3c]" /></div>
                <h3 className="text-[#1f2c3c] text-[22px] md:text-[26px] font-bold mb-4">{card.title}</h3>
                <div className="space-y-1 text-[#636b75] text-[15px] md:text-[16px] leading-relaxed">{card.lines.map((line) => <p key={line}>{line}</p>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px] relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-[#5f5f5f] text-[12px] font-semibold uppercase tracking-widest mb-3">Connect With Us</p>
              <h2 className="text-[#1f2c3c] text-[38px] md:text-[62px] leading-[0.95] font-bold mb-5">Have <span className="text-[#00A859]">Questions?</span><br /><span className="text-[#00A859]">Get In</span> Touch!</h2>
              <p className="text-[#5f6974] text-[16px] md:text-[17px] leading-relaxed max-w-[440px]">We take pride in serving our community and building lasting relationships with our clients.</p>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={submit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-14 rounded-full border border-[#d8dde3] bg-[#f5f5f2] px-6 text-[16px] outline-none" placeholder="Name *" required />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-14 rounded-full border border-[#d8dde3] bg-[#f5f5f2] px-6 text-[16px] outline-none" placeholder="Phone number" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="h-14 rounded-full border border-[#d8dde3] bg-[#f5f5f2] px-6 text-[16px] outline-none" placeholder="Your email address *" required />
                <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="h-14 rounded-full border border-[#d8dde3] bg-[#f5f5f2] px-6 text-[16px] outline-none" placeholder="Our Services *" />
              </div>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full h-40 rounded-[24px] border border-[#d8dde3] bg-[#f5f5f2] px-6 py-5 text-[16px] outline-none resize-none" placeholder="Message Here.." required />
              {status ? <p className="text-[14px] text-[#5f6974]">{status}</p> : null}
              <button type="submit" className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white text-[20px] font-semibold px-8 py-4 rounded-full transition-colors">Send A Message<span className="w-9 h-9 rounded-full bg-[#00A859] grid place-items-center"><ArrowRight className="w-5 h-5" /></span></button>
            </form>
          </div>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default ContactPage;
