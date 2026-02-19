import React from 'react';
import Footer from '../../components/layout/Footer';
import HomeHeroSection from '../../components/home/HomeHeroSection';
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection';
import OurProjectsSection from '../../components/home/OurProjectsSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import PricingSection from '../../components/home/PricingSection';
import WhatClientsSaySection from '../../components/home/WhatClientsSaySection';
import FaqSection from '../../components/home/FaqSection';
import FromBlogSection from '../../components/home/FromBlogSection';
import JoinUsSection from '../../components/home/JoinUsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HomeHeroSection />
      <WhyChooseUsSection />
      <OurProjectsSection />
      <HowItWorksSection />
      <PricingSection />
      <WhatClientsSaySection />
      <FaqSection />
      <FromBlogSection />
      <JoinUsSection />
      <Footer />
    </>
  );
};

export default HomePage;
