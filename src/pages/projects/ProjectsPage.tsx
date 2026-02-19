import React from 'react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import OurProjectsSection from '../../components/home/OurProjectsSection';
import WhatClientsSaySection from '../../components/home/WhatClientsSaySection';

const ProjectsPage: React.FC = () => {
  return (
    <>
      <PageHero title="Our Projects" subtitle="A showcase of the quality and consistency we deliver for every client." />
      <OurProjectsSection />
      <WhatClientsSaySection />
      <Footer />
    </>
  );
};

export default ProjectsPage;
