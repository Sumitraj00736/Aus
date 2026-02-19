import React from 'react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import PricingSection from '../../components/home/PricingSection';

const ServicesPage: React.FC = () => {
  return (
    <>
      <PageHero title="Our Services" subtitle="Professional plans for homes, offices, and commercial spaces." />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </>
  );
};

export default ServicesPage;
