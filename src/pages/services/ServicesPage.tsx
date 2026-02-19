import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JoinUsSection from '../../components/home/JoinUsSection';
import Footer from '../../components/layout/Footer';
import { apiRequest } from '../../lib/api';

type ServiceItem = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  cardImage: string;
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    Promise.all([apiRequest<ServiceItem[]>('/public/services'), apiRequest('/public/pages/services')])
      .then(([servicesData, pageData]) => {
        setServices(servicesData);
        setPage(pageData);
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <section className="relative min-h-[540px] pt-[210px] pb-[120px] overflow-hidden">
        <img
          src={page?.bannerImage || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=2200&q=80'}
          alt="Cleaning service hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-20 page-container text-center text-white">
          <h1 className="text-[42px] md:text-[64px] leading-[0.95] font-bold mb-4">{page?.title || 'Services Style 03'}</h1>
          <p className="text-white/85 text-[15px] md:text-[16px] font-medium">{page?.subtitle || 'Home > Services Style 03'}</p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px]">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[#5f5f5f] text-[12px] md:text-[13px] font-semibold uppercase tracking-widest mb-3">Featured Service</p>
            <h2 className="text-[#1f2c3c] text-[34px] md:text-[56px] leading-[0.95] font-bold">
              Our Company <span className="text-[#00A859]">Provide The</span>
              <br />
              <span className="text-[#00A859]">Best</span> Cleaning Service
            </h2>
          </div>

          <div className="space-y-8 md:space-y-10">
            {services.slice(0, 6).map((service, idx) => {
              const reverse = idx % 2 === 1;

              return (
                <article
                  key={service._id}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 rounded-[28px] border border-[#dfe2e6] overflow-hidden bg-[#f7f7f7] ${
                    idx > 0 ? 'md:-mt-4' : ''
                  }`}
                >
                  <div className={reverse ? 'order-2' : 'order-1'}>
                    <img src={service.cardImage} alt={service.title} className="w-full h-[320px] md:h-[380px] object-cover" />
                  </div>

                  <div className={`p-8 md:p-12 flex flex-col justify-center ${reverse ? 'order-1' : 'order-2'}`}>
                    <h3 className="text-[#1f2c3c] text-[34px] md:text-[48px] leading-[0.95] font-bold mb-4">{service.title}</h3>
                    <div className="h-px bg-[#d9dde2] mb-6" />
                    <p className="text-[#646f7b] text-[16px] md:text-[18px] leading-relaxed max-w-[95%]">{service.shortDescription}</p>
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    aria-label={`Read more about ${service.title}`}
                    className={`absolute bottom-5 ${reverse ? 'left-5' : 'right-5'} w-14 h-14 rounded-full border border-[#dfe2e6] bg-white hover:bg-[#00A859] hover:text-white text-[#1f2c3c] grid place-items-center transition-colors`}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default ServicesPage;
