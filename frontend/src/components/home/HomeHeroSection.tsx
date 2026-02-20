import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

const HomeHeroSection: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest<any[]>('/public/services')
      .then((rows) => setServices(rows))
      .catch(() => undefined);
  }, []);

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/submissions/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.message || 'Request a quote',
        }),
      });
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
      notifySuccess('Quote request submitted.');
    } catch (error: any) {
      notifyError(error?.message || 'Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#1a1a1a]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2400&q=80"
          alt="Cleaning professionals"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(0,168,89,0.22),transparent_38%)]" />
      </div>

      <div className="relative z-20 max-w-[1240px] mx-auto px-4 xl:px-6 pt-[160px] pb-[100px] w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-10 items-center">
          <div className="max-w-[900px]">
          <h1 className="text-white text-[48px] sm:text-[60px] md:text-[80px] lg:text-[96px] font-extrabold leading-[1.05] tracking-[-0.02em] mb-6">
            Your Trusted <span className="text-[#00A859]">Home</span>
            <br />
            <span className="text-[#00A859]">Clean</span> Solutions
          </h1>

          <p className="text-[16px] sm:text-[18px] md:text-[20px] text-white/90 max-w-[750px] leading-relaxed mb-8">
            We take pride in our attention to detail and commitment to customer satisfaction. Whether you require regular
            maintenance or deep cleaning, our team ensures your home stays spotless.
          </p>

          <Link
            to="/#request-quote"
            className="inline-flex items-center gap-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-[22px] sm:text-[24px] md:text-[26px] px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-colors group shadow-lg"
          >
            Request A Quote
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white grid place-items-center">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A859]" />
            </span>
          </Link>
        </div>

          <div id="request-quote" className="rounded-[30px] bg-[linear-gradient(180deg,rgba(0,0,0,0.72),rgba(70,80,78,0.82))] border border-white/10 p-7 md:p-9 backdrop-blur-sm">
            <h3 className="text-white text-[42px] leading-[1] font-semibold mb-8">Request A Quote</h3>
            <form onSubmit={submitQuote} className="space-y-5">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your Name *"
                className="w-full h-[64px] rounded-full px-7 bg-white/20 text-white placeholder:text-white/80 border border-white/10 outline-none"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                required
                placeholder="Your Email *"
                className="w-full h-[64px] rounded-full px-7 bg-white/20 text-white placeholder:text-white/80 border border-white/10 outline-none"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                placeholder="Your Phone *"
                className="w-full h-[64px] rounded-full px-7 bg-white/20 text-white placeholder:text-white/80 border border-white/10 outline-none"
              />
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                required
                className="w-full h-[64px] rounded-full px-7 bg-white/20 text-white border border-white/10 outline-none"
              >
                <option className="text-black" value="">Select Service *</option>
                {services.map((service) => (
                  <option className="text-black" key={service._id} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </select>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Message..."
                className="w-full h-[150px] rounded-[26px] px-7 py-4 bg-white/20 text-white placeholder:text-white/80 border border-white/10 outline-none resize-none"
              />
              <button
                disabled={submitting}
                className="inline-flex items-center gap-3 bg-[#00A859] text-white hover:bg-[#009551] rounded-full px-9 h-[60px] text-[16px] font-semibold transition-colors"
              >
                {submitting ? 'Submitting...' : 'Request A Service'}
                <span className="w-8 h-8 rounded-full bg-white text-[#00A859] grid place-items-center">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
