import React, { useState, useEffect } from "react";
import {
  Check,
  Minus,
  Plus,
  Sparkles,
  Leaf,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
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

  // Animate text on scroll
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(".fade-up"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[420px] pt-[210px] pb-[80px] overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/58" />

        <div className="relative z-20 page-container text-white text-center">
          <h1 className="text-[38px] md:text-[56px] leading-[0.95] font-bold mb-3">
            {service.title}
          </h1>
          <p className="text-white/90 text-[15px] md:text-[16px] font-medium">
            Home &nbsp;›&nbsp; Services &nbsp;›&nbsp; {service.title}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* Left Sidebar Sticky */}
          <aside className="space-y-4 sticky top-16 self-start">
            {/* Other Services */}
            <div className="rounded-xl border border-[#dce1e6] bg-white p-5 fade-up opacity-0 transform translate-y-4 transition-all duration-700">
              <h3 className="text-[#1f2c3c] text-[24px] font-bold leading-none mb-4">
                Other Services
              </h3>
              <ul>
                {services.map((item) => {
                  const active = item.slug === service.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        to={`/services/${item.slug}`}
                        className={`block py-2 px-3 rounded-lg text-[14px] font-semibold border-b border-[#e7eaee] transition-colors ${
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
            <div className="rounded-xl overflow-hidden bg-gradient-to-b from-[#122a1f] to-[#00A859] text-white p-6 fade-up opacity-0 transform translate-y-4 transition-all duration-700">
              <h4 className="text-[24px] font-bold mb-1">Do You Need Help?</h4>
              <p className="text-[26px] font-bold mb-2">
                +(084) 456-0789
              </p>
              <p className="text-[20px] font-semibold mb-3">support@example.com</p>
              <img
                src="https://images.unsplash.com/photo-1612537611736-c79ffebf3a1f?w=700&q=80"
                alt="Helper"
                className="w-full h-[200px] object-cover rounded-xl"
              />
            </div>
          </aside>

          {/* Right Content Scrollable */}
          <div className="flex flex-col gap-8">
            <img
              src={service.detailImage}
              alt={service.title}
              className="w-full h-[400px] object-fit rounded-xl fade-up opacity-0 transform translate-y-4 transition-all duration-700"
            />

            <h2 className="text-[#1f2c3c] text-[34px] md:text-[42px] font-bold leading-none fade-up opacity-0 transform translate-y-4 transition-all duration-700">
              About The Service
            </h2>
            <p className="text-[#5e6975] text-[15px] leading-relaxed fade-up opacity-0 transform translate-y-4 transition-all duration-700">
              {service.detailIntro}
            </p>
            <p className="text-[#5e6975] text-[15px] leading-relaxed fade-up opacity-0 transform translate-y-4 transition-all duration-700">
              {service.detailBody}
            </p>

            {/* 4 Images After About Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgd7DX7VzVyZ4hXdZ-S7gJb5UfihqRYZyezg&s"
                alt="Cleaning Image 1"
                className="w-full h-[150px] object-cover rounded-lg fade-up opacity-0 transform translate-y-4 transition-all duration-700"
              />
              <img
                src="https://www.nation.sg/wp-content/uploads/2024/11/Housekeeping-1024x683.jpg"
                alt="Cleaning Image 2"
                className="w-full h-[150px] object-cover rounded-lg fade-up opacity-0 transform translate-y-4 transition-all duration-700"
              />
              <img
                src="https://media.istockphoto.com/id/1327447945/photo/female-home-help-cleaning-house-and-talking-to-senior-woman.jpg?s=612x612&w=0&k=20&c=7zIR4Z7uywUigwoS5bypYCf8ghL-bualrJBJV0sIerI="
                alt="Cleaning Image 3"
                className="w-full h-[150px] object-cover rounded-lg fade-up opacity-0 transform translate-y-4 transition-all duration-700"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvXe0e5jBUvga2YddM0H62Csr9HVeGcPgMjA&s"
                alt="Cleaning Image 4"
                className="w-full h-[150px] object-cover rounded-lg fade-up opacity-0 transform translate-y-4 transition-all duration-700"
              />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                {
                  icon: Sparkles,
                  title: "Deep Cleaning Solutions",
                  text: "Choose weekly upkeep or one-time deep clean plans.",
                },
                {
                  icon: ShieldCheck,
                  title: "Comprehensive Cleaning",
                  text: "Safe, non-toxic products protecting your family and pets.",
                },
                {
                  icon: Leaf,
                  title: "Eco-Friendly Products",
                  text: "Thoughtfully selected supplies with strong results.",
                },
                {
                  icon: CalendarClock,
                  title: "Flexible Scheduling",
                  text: "Book by time slot, frequency, or project requirement.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="flex items-start gap-3 fade-up opacity-0 transform translate-y-4 transition-all duration-700"
                >
                  <div className="w-12 h-12 rounded-full bg-[#90ef78] flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-[#16302d]" />
                  </div>
                  <div>
                    <h3 className="text-[#1f2c3c] text-[24px] font-bold leading-none mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#5f6974] text-[14px] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* FAQs */}
            <h2 className="text-[#1f2c3c] text-[40px] md:text-[48px] font-bold leading-none fade-up opacity-0 transform translate-y-4 transition-all duration-700 mt-8 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const open = idx === openFaq;
                return (
                  <article
                    key={faq.question}
                    className="rounded-xl border border-[#dce1e6] bg-white overflow-hidden fade-up opacity-0 transform translate-y-4 transition-all duration-700"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between"
                    >
                      <span className="text-[#1f2c3c] text-[20px] font-semibold leading-none">
                        {faq.question}
                      </span>
                      {open ? (
                        <Minus className="w-5 h-5 text-[#00A859]" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#1f2c3c]" />
                      )}
                    </button>
                    {open && (
                      <p className="px-5 pb-5 text-[#5f6974] text-[14px] leading-relaxed">
                        {faq.answer}
                      </p>
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
