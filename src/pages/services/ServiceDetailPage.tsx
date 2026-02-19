import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import JoinUsSection from '../../components/home/JoinUsSection';
import Footer from '../../components/layout/Footer';
import { apiRequest } from '../../lib/api';

const ServiceDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [service, setService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([apiRequest('/public/services'), apiRequest(`/public/services/${slug}`)])
      .then(([allServices, current]) => {
        setServices(allServices);
        setService(current);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <Navigate to="/services" replace />;
  if (!service) return <div className="min-h-[50vh] bg-[#f2f2ee] page-container py-20">Loading...</div>;

  const faqs = service.faqs?.length
    ? service.faqs
    : [
        { question: 'What types of spaces do you clean?', answer: 'Homes, offices, and post-renovation sites.' },
        { question: 'Are your cleaning products eco-friendly?', answer: 'Yes, we use safe and non-toxic products.' },
      ];

  return (
    <>
      <section className="relative min-h-[420px] pt-[210px] pb-[80px] overflow-hidden">
        <img src={service.heroImage} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/58" />

        <div className="relative z-20 page-container text-white text-center">
          <h1 className="text-[38px] md:text-[56px] leading-[0.95] font-bold mb-3">{service.title}</h1>
          <p className="text-white/90 text-[15px] md:text-[16px] font-medium">Home › Services › {service.title}</p>
        </div>
      </section>

      <section className="py-20 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <aside className="space-y-4 sticky top-16 self-start">
            <div className="rounded-xl border border-[#dce1e6] bg-white p-5">
              <h3 className="text-[#1f2c3c] text-[24px] font-bold leading-none mb-4">Other Services</h3>
              <ul>
                {services.map((item) => {
                  const active = item.slug === service.slug;
                  return (
                    <li key={item._id}>
                      <Link
                        to={`/services/${item.slug}`}
                        className={`block py-2 px-3 rounded-lg text-[14px] font-semibold border-b border-[#e7eaee] transition-colors ${
                          active ? 'bg-[#00A859] text-white border-transparent' : 'text-[#1f2c3c] hover:text-[#00A859]'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="flex flex-col gap-8">
            <img src={service.detailImage} alt={service.title} className="w-full h-[400px] object-cover rounded-xl" />

            <h2 className="text-[#1f2c3c] text-[34px] md:text-[42px] font-bold leading-none">About The Service</h2>
            <p className="text-[#5e6975] text-[15px] leading-relaxed">{service.detailIntro}</p>
            <p className="text-[#5e6975] text-[15px] leading-relaxed">{service.detailBody}</p>

            <h2 className="text-[#1f2c3c] text-[40px] md:text-[48px] font-bold leading-none mt-4 mb-1">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mb-2">
              {(service.checklist?.length ? service.checklist : ['Assess Needs', 'Dust Surfaces', 'Vacuum Carpets', 'Mop Floors']).map((item: string) => (
                <p key={item} className="inline-flex items-center gap-3 text-[#1f2c3c] text-[17px] font-semibold">
                  <span className="w-5 h-5 rounded-full bg-[#00A859] text-white grid place-items-center">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </p>
              ))}
            </div>

            <h2 className="text-[#1f2c3c] text-[40px] md:text-[48px] font-bold leading-none mt-4 mb-2">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq: any, idx: number) => {
                const open = idx === openFaq;
                return (
                  <article key={faq.question} className="rounded-xl border border-[#dce1e6] bg-white overflow-hidden">
                    <button type="button" onClick={() => setOpenFaq(open ? -1 : idx)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                      <span className="text-[#1f2c3c] text-[20px] font-semibold leading-none">{faq.question}</span>
                      {open ? <Minus className="w-5 h-5 text-[#00A859]" /> : <Plus className="w-5 h-5 text-[#1f2c3c]" />}
                    </button>
                    {open ? <p className="px-5 pb-5 text-[#5f6974] text-[14px] leading-relaxed">{faq.answer}</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
