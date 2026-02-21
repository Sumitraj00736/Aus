import React, { useEffect, useState } from 'react';
import JoinUsSection from '../../components/home/JoinUsSection';
import Footer from '../../components/layout/Footer';
import { apiRequest } from '../../lib/api';
import { notifyError, notifySuccess } from '../../lib/toast';

const BookServicePage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceSlug: '',
    scheduledDate: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    apiRequest<any[]>('/public/services')
      .then((rows) => setServices(rows))
      .catch(() => undefined);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/submissions/booking', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({
        name: '',
        email: '',
        phone: '',
        serviceSlug: '',
        scheduledDate: '',
        address: '',
        notes: '',
      });
      notifySuccess('Booking request submitted successfully.');
    } catch (error: any) {
      notifyError(error.message || 'Failed to submit booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative min-h-[430px] pt-[190px] pb-[100px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=2200&q=80"
          alt="Book service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/58" />
        <div className="relative z-20 page-container text-white text-center">
          <h1 className="text-[44px] md:text-[68px] leading-[0.95] font-bold mb-3">Book A Service</h1>
          <p className="text-[16px] text-white/85">Home › Book A Service</p>
        </div>
      </section>

      <section className="py-20 bg-[#f2f2ee]">
        <div className="page-container">
          <div className="rounded-[28px] border border-[#dce1e6] bg-white grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] overflow-hidden">
            <div className="p-7 md:p-10 bg-[linear-gradient(180deg,#112130,#153045)] text-white">
              <p className="text-[13px] uppercase tracking-widest text-white/75 mb-3">Get In Touch</p>
              <h2 className="text-[36px] md:text-[52px] leading-[0.95] font-bold mb-5">
                Schedule
                <br />
                Your Cleaning
              </h2>
              <p className="text-[15px] leading-relaxed text-white/85 mb-8">
                Fill the form and choose your preferred service and time. We will confirm availability and booking shortly.
              </p>
              <img
                src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&q=80"
                alt="Cleaning booking"
                className="w-full h-[280px] object-cover rounded-[18px]"
              />
            </div>

            <div className="p-7 md:p-10">
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="h-12 rounded-lg border border-[#d9dfe6] px-4" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="h-12 rounded-lg border border-[#d9dfe6] px-4" placeholder="Your Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input className="h-12 rounded-lg border border-[#d9dfe6] px-4" placeholder="Your Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                <select className="h-12 rounded-lg border border-[#d9dfe6] px-4" value={form.serviceSlug} onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })} required>
                  <option value="">Select Service *</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.slug}>{service.title}</option>
                  ))}
                </select>
                <input className="h-12 rounded-lg border border-[#d9dfe6] px-4 md:col-span-1" type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required />
                <input className="h-12 rounded-lg border border-[#d9dfe6] px-4 md:col-span-1" placeholder="Address *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                <textarea className="h-[130px] rounded-lg border border-[#d9dfe6] px-4 py-3 md:col-span-2 resize-none" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button disabled={submitting} className="md:col-span-2 h-12 rounded-full bg-[#00A859] hover:bg-[#00914d] text-white font-semibold transition-colors">
                  {submitting ? 'Submitting...' : 'Submit Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default BookServicePage;
