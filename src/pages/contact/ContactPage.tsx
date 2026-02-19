import React from 'react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import JoinUsSection from '../../components/home/JoinUsSection';

const ContactPage: React.FC = () => {
  return (
    <>
      <PageHero title="Contact Us" subtitle="Talk to our team and get a customized quote for your cleaning needs." />

      <section className="py-24 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 xl:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-[42px] md:text-[52px] font-black text-[#1f2c3c] mb-5">Let us build your plan</h2>
            <p className="text-[#666] text-[18px] leading-relaxed mb-8">
              Share your space details and preferred schedule. We will send a tailored estimate quickly.
            </p>
            <div className="space-y-3 text-[#1f2c3c] text-[17px]">
              <p><strong>Phone:</strong> (+480) 123 678 900</p>
              <p><strong>Email:</strong> hello@cetro.com</p>
              <p><strong>Address:</strong> 1234 Clean Street, Suite 200, Chicago, IL 60601</p>
            </div>
          </div>

          <form className="bg-[#f6f6f6] rounded-2xl p-6 md:p-8 space-y-4">
            <input className="w-full h-12 rounded-lg border border-[#ddd] px-4 outline-none" placeholder="Your Name" />
            <input className="w-full h-12 rounded-lg border border-[#ddd] px-4 outline-none" placeholder="Email" type="email" />
            <input className="w-full h-12 rounded-lg border border-[#ddd] px-4 outline-none" placeholder="Phone" />
            <textarea className="w-full h-36 rounded-lg border border-[#ddd] px-4 py-3 outline-none" placeholder="Tell us about your cleaning needs" />
            <button type="button" className="h-12 px-6 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white font-bold transition-colors">
              Send Request
            </button>
          </form>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default ContactPage;
