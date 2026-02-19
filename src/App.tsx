import React from 'react';
import HeaderTopBar from './components/sections/HeaderTopBar';
import Navigation from './components/sections/Navigation';
import HeroSection from './components/sections/HeroSection';
import ServicesSection from './components/sections/ServicesSection';
import AboutSection from './components/sections/AboutSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import FooterSection from './components/sections/FooterSection';
import CookieConsent from './components/sections/CookieConsent';
import ScrollToTop from './components/sections/ScrollToTop';

function App() {
  return (
    <div className="relative">
      {/* Envato preview top bar */}
      <HeaderTopBar />

      {/* Hero + Navigation overlay */}
      <div className="relative">
        <Navigation />
        <HeroSection />
      </div>

      {/* Page sections */}
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <FooterSection />

      {/* Floating UI */}
      <CookieConsent />
      <ScrollToTop />
    </div>
  );
}

export default App;
