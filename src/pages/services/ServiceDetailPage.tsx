import React, { useState } from "react";
import { Check, Minus, Plus, Sparkles, Leaf, ShieldCheck, CalendarClock } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import JoinUsSection from "../../components/home/JoinUsSection";
import Footer from "../../components/layout/Footer";
import { getServiceBySlug, services } from "../../data/services";

const faqs = [
  {
    question: "What types of spaces do you clean?",
    answer:
      "We offer cleaning for homes, offices, retail spaces, and post-renovation sites with custom packages based on your needs.",
  },
  {
    question: "Are your cleaning products eco-friendly?",
    answer:
      "Yes. We use non-toxic, eco-conscious solutions that are effective and safe for families and pets.",
  },
  {
    question: "How do I book a cleaning session?",
    answer:
      "You can book online, call our team directly, or request a quote through the contact page.",
  },
  {
    question: "Do I need to be home during the service?",
    answer:
      "No. Many clients provide secure access instructions and receive completion updates from our team.",
  },
];

const ServiceDetailPage: React.FC = () => {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);
  const [openFaq, setOpenFaq] = useState(0);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[420px] pt-[180px] pb-[60px] overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 xl:px-6 text-white text-center">
          <h1 className="text-[48px] md:text-[64px] font-black mb-2">{service.title}</h1>
          <p className="text-white/90 text-[16px] font-semibold">
            Home &nbsp;›&nbsp; Services &nbsp;›&nbsp; {service.title}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[#f2f2ee]">
        <div className="max-w-[1360px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar Sticky */}
          <aside className="space-y-6 sticky top-20 self-start">
            {/* Other Services */}
            <div className="rounded-lg border border-[#dce1e6] bg-white p-4">
              <h3 className="text-[#1f2c3c] text-[28px] font-black mb-3">Other Services</h3>
              <ul>
                {services.map((item) => {
                  const active = item.slug === service.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        to={`/services/${item.slug}`}
                        className={`block py-2 px-3 rounded-lg text-[14px] font-bold border-b border-[#e7eaee] transition-colors ${
                          active
                            ? "bg-[#00A859] text-white border-transparent"
                            : "text-[#1f2c3c] hover:text-[#00A859]"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help Box */}
            <div className="rounded-lg overflow-hidden bg-gradient-to-b from-[#122a1f] to-[#00A859] text-white p-5">
              <h4 className="text-[24px] font-black mb-1">Do You Need Help?</h4>
              <p className="text-[32px] font-black leading-none mb-1">+(084) 456-0789</p>
              <p className="text-[20px] font-bold mb-2">support@example.com</p>
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80"
                alt="Helper"
                className="w-full h-[200px] object-cover rounded-lg"
              />
            </div>
          </aside>

          {/* Right Content */}
          <div className="flex flex-col gap-8">
            <img
              src={service.detailImage}
              alt={service.title}
              className="w-full h-[400px] object-fit rounded-lg"
            />

            <h2 className="text-[#1f2c3c] text-[48px] font-black leading-none mb-3">
              About The Service
            </h2>
            <p className="text-[#5e6975] text-[16px] leading-relaxed mb-2">{service.detailIntro}</p>
            <p className="text-[#5e6975] text-[16px] leading-relaxed mb-5">{service.detailBody}</p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {[
                { icon: Sparkles, title: "Deep Cleaning Solutions", text: "Weekly or one-time plans." },
                { icon: ShieldCheck, title: "Comprehensive Cleaning", text: "Safe, non-toxic products." },
                { icon: Leaf, title: "Eco-Friendly Products", text: "Thoughtfully selected supplies." },
                { icon: CalendarClock, title: "Flexible Scheduling", text: "Book by time, frequency, or project." },
              ].map((item) => (
                <article key={item.title} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#90ef78] flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#16302d]" />
                  </div>
                  <div>
                    <h3 className="text-[#1f2c3c] text-[24px] font-black mb-1">{item.title}</h3>
                    <p className="text-[#5f6974] text-[14px]">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* FAQs */}
            <h2 className="text-[#1f2c3c] text-[48px] font-black leading-none mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const open = idx === openFaq;
                return (
                  <article key={faq.question} className="rounded-lg border border-[#dce1e6] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between"
                    >
                      <span className="text-[#1f2c3c] text-[20px] font-black">{faq.question}</span>
                      {open ? (
                        <Minus className="w-5 h-5 text-[#00A859]" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#1f2c3c]" />
                      )}
                    </button>
                    {open && (
                      <p className="px-5 pb-5 text-[#5f6974] text-[14px] leading-relaxed">{faq.answer}</p>
                    )}
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
