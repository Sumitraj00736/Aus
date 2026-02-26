import React from "react";
import HomeHeroSection from "../../components/home/HomeHeroSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";
import OurProjectsSection from "../../components/home/OurProjectsSection";
import HowItWorksSection from "../../components/home/HowItWorksSection";
import BookServiceSection from "../../components/home/BookServiceSection";
import WhatClientsSaySection from "../../components/home/WhatClientsSaySection";
import FaqSection from "../../components/home/FaqSection";
import FromBlogSection from "../../components/home/FromBlogSection";
import ServicesCard from "../../components/home/ServicesCard";
import FeatureServices from "../../components/home/FeaturedServices";

const HomePage: React.FC = () => {
  return (
    <>
      <HomeHeroSection />
      <BookServiceSection />
      <ServicesCard />
      <WhyChooseUsSection />
      <FeatureServices />
      <OurProjectsSection />
      <HowItWorksSection />
      <WhatClientsSaySection />
      <FromBlogSection />
      <FaqSection />
    </>
  );
};

export default HomePage;
