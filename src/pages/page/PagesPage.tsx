import React from 'react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection';
import FaqSection from '../../components/home/FaqSection';

const PagesPage: React.FC = () => {
  return (
    <>
      <PageHero title="More Pages" subtitle="Explore company details, FAQs, and why clients choose Cetro." />
      <WhyChooseUsSection />
      <FaqSection />
      <Footer />
    </>
  );
};

export default PagesPage;
