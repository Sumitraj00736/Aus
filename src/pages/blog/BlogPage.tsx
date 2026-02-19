import React from 'react';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import FromBlogSection from '../../components/home/FromBlogSection';
import JoinUsSection from '../../components/home/JoinUsSection';

const BlogPage: React.FC = () => {
  return (
    <>
      <PageHero title="From Our Blog" subtitle="Industry updates, practical cleaning tips, and home-care insights." />
      <FromBlogSection />
      <JoinUsSection />
      <Footer />
    </>
  );
};

export default BlogPage;
