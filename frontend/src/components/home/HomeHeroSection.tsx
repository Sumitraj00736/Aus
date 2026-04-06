import React, { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { notifyError, notifySuccess } from "../../lib/toast";

const HomeHeroSection: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Preload popup sound
  const popupSound = new Audio("/sounds/popup.mp3");

  const playSound = () => {
    popupSound.currentTime = 0;
    popupSound.play().catch(() => {}); // avoid unhandled promise
  };

  useEffect(() => {
    apiRequest<any[]>("/public/services")
      .then((rows) => setServices(rows))
      .catch(() => undefined);
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
    playSound(); // Play sound when form appears
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/submissions/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.message || "Request a quote",
        }),
      });
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
      notifySuccess("Quote request submitted.");
      setShowForm(false);
    } catch (error: any) {
      notifyError(error?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#1a1a1a]">
      {/* Background */}
<div className="absolute inset-0 z-0">
  <img
    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2400&q=80"
    alt="Cleaning professionals"
    className="w-full h-full object-cover object-center
               sm:object-[center_30%] sm:h-full"
  />
  {/* Mobile Horizontal Banner */}
  <img
    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=60"
    alt="Cleaning professionals"
    className="block sm:hidden w-full h-[220px] object-cover object-center"
  />

  <div className="absolute inset-0 bg-black/60" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(0,168,89,0.22),transparent_38%)]" />
</div>

      <div className="relative z-20 max-w-[1240px] mx-auto px-4 xl:px-6 pt-[160px] pb-[100px] w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-10 items-center">
          {/* Left Hero Text */}
          <div className="max-w-[900px]">
            <h1 className="text-white text-[48px] sm:text-[60px] md:text-[70px] lg:text-[80px] font-extrabold leading-[1.05] tracking-[-0.02em] mb-6">
              Transform <span className="text-[#00A859]">Your </span>
              <br />
             <span className="text-[#00A859]"> Space </span> Today
            </h1>

            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-white/90 max-w-[750px] leading-relaxed mb-8">
              Strata, Domestic, Industrial, Residential, and Heritage
              Restoration Painting – Expertly Executed, Every Time.
            </p>

            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-[22px] sm:text-[24px] md:text-[26px] px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-colors group shadow-lg"
            >
              Request A Quote
              <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white grid place-items-center">
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A859]" />
              </span>
            </button>
          </div>

          {/* Floating Form Panel */}
          {showForm && (
            <div
              className={`fixed top-1/2 right-0 z-50 transform -translate-y-1/2 transition-all duration-500 ease-out
                translate-x-0 scale-100 opacity-100 rotate-0
                w-[380px] sm:w-[440px] lg:w-[480px] rounded-[30px] bg-gradient-to-b from-black/70 to-gray-800/80 border border-white/20 p-6 sm:p-7 backdrop-blur-md shadow-2xl`}
              style={{ transition: "all 0.5s cubic-bezier(.68,-0.55,.265,1.55)" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-white hover:text-[#00A859] transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-white text-[28px] sm:text-[32px] font-semibold mb-5">
                Request A Quote
              </h3>

              <form onSubmit={submitQuote} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your Name *"
                  className="w-full h-[50px] rounded-full px-5 bg-white/15 text-white placeholder:text-white/70 border border-white/10 outline-none transition-all focus:ring-2 focus:ring-[#00A859]"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  required
                  placeholder="Your Email *"
                  className="w-full h-[50px] rounded-full px-5 bg-white/15 text-white placeholder:text-white/70 border border-white/10 outline-none transition-all focus:ring-2 focus:ring-[#00A859]"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="Your Phone *"
                  className="w-full h-[50px] rounded-full px-5 bg-white/15 text-white placeholder:text-white/70 border border-white/10 outline-none transition-all focus:ring-2 focus:ring-[#00A859]"
                />
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  required
                  className="w-full h-[50px] rounded-full px-5 bg-white/15 text-white border border-white/10 outline-none transition-all focus:ring-2 focus:ring-[#00A859]"
                >
                  <option className="text-black" value="">
                    Select Service *
                  </option>
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
                  className="w-full h-[100px] rounded-[20px] px-5 py-3 bg-white/15 text-white placeholder:text-white/70 border border-white/10 outline-none resize-none transition-all focus:ring-2 focus:ring-[#00A859]"
                />

                <button
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#00A859] hover:bg-[#009551] rounded-full h-[50px] text-[15px] font-semibold transition-all shadow-md"
                >
                  {submitting ? "Submitting..." : "Request A Service"}
                  <span className="w-7 h-7 rounded-full bg-white text-[#00A859] grid place-items-center">
                    →
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;