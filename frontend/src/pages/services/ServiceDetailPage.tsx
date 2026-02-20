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
  const [globalFaqs, setGlobalFaqs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([apiRequest('/public/services'), apiRequest(`/public/services/${slug}`)])
      .then(([allServices, current]) => {
        setServices(allServices);
        setService(current);
      })
      .catch(() => setNotFound(true));

    apiRequest<any[]>('/public/faqs?pageKey=service')
      .then((rows) => setGlobalFaqs(rows))
      .catch(() => undefined);
  }, [slug]);

  if (notFound) return <Navigate to="/services" replace />;
  if (!service) return <div className="min-h-[50vh] bg-[#f2f2ee] page-container py-20">Loading...</div>;

  const faqs = service.faqs?.length ? service.faqs : globalFaqs?.length
    ? globalFaqs
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
            <div className="rounded-[24px] bg-[linear-gradient(180deg,#102014,#0baa53)] p-6 text-white overflow-hidden">
              <p className="text-[30px] font-semibold mb-4">{service.helpCard?.title || 'Do You Need Help?'}</p>
              <p className="text-[42px] leading-none font-bold mb-3">{service.helpCard?.phone || '+(084) 456-0789'}</p>
              <p className="text-[28px] font-semibold mb-4">{service.helpCard?.email || 'support@example.com'}</p>
              {service.helpCard?.image ? (
                <img src={service.helpCard.image} alt="Help card" className="w-full h-[260px] object-contain object-bottom" />
              ) : null}
            </div>
          </aside>

          <div className="flex flex-col gap-8">
            <img src={service.detailImage} alt={service.title} className="w-full h-[400px] object-cover rounded-xl" />

            <h2 className="text-[#1f2c3c] text-[34px] md:text-[42px] font-bold leading-none">{service.aboutSectionTitle || 'About The Service'}</h2>
            <p className="text-[#5e6975] text-[15px] leading-relaxed">{service.aboutSectionDescription || service.detailIntro}</p>
            <p className="text-[#5e6975] text-[15px] leading-relaxed">{service.detailBody}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(service.aboutImages?.length ? service.aboutImages : [service.detailImage]).slice(0, 4).map((img: string, idx: number) => (
                <img key={`${img}-${idx}`} src={img} alt={`${service.title} about ${idx + 1}`} className="w-full h-[220px] object-cover rounded-[18px]" />
              ))}
            </div>

            <h2 className="text-[#1f2c3c] text-[40px] md:text-[48px] font-bold leading-none mt-4 mb-1">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              {(service.aboutBullets?.length
                ? service.aboutBullets
                : [
                    { title: 'Deep Cleaning Solutions', description: 'Choose a time that works for you, whether you need weekly upkeep or one-time deep clean.' },
                    { title: 'Comprehensive Cleaning', description: 'We use safe, non-toxic products that protect your family, pets, and the environment.' },
                    { title: 'Eco-Friendly Products', description: 'Certified products that protect your home and improve indoor air quality.' },
                    { title: 'Flexible Scheduling', description: 'Book one-time sessions or recurring plans based on your lifestyle.' },
                  ]).map((item: any) => (
                <div key={item.title} className="grid grid-cols-[56px_1fr] items-start gap-4">
                  <span className="w-14 h-14 rounded-full bg-[#86ef72] grid place-items-center overflow-hidden">
                    {item.iconImage ? <img src={item.iconImage} alt={item.title} className="w-8 h-8 object-contain" /> : <Check className="w-7 h-7 text-[#16302d]" />}
                  </span>
                  <div>
                    <p className="text-[#1f2c3c] text-[26px] font-bold leading-none mb-1">{item.title}</p>
                    <p className="text-[#5e6975] text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                </div>
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
