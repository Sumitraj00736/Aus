import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 'sofa',
    title: 'Sofa & Mattress Deep Cleaning',
    category: 'Sanitization',
    image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1600&q=80',
  },
  {
    id: 'office',
    title: 'Office Maintenance Cleaning',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=1600&q=80',
  },
  {
    id: 'glass',
    title: 'Glass & Surface Shine Service',
    category: 'Window Care',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1600&q=80',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Deep Care Program',
    category: 'Home Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',
  },
];

const OurProjectsSection: React.FC = () => {
  const [activeId, setActiveId] = useState(projects[0].id);

  return (
    <section className="py-24 bg-[#055d57] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff22,transparent_40%),radial-gradient(circle_at_80%_60%,#ffffff22,transparent_42%)]" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 xl:px-6">
        <div className="text-center mb-12">
          <p className="text-[#9de5cd] text-[14px] font-bold uppercase tracking-widest mb-3">Our Projects</p>
          <h2 className="text-white text-[32px] md:text-[58px] leading-[0.95] font-black">
            You Can Check <span className="text-[#00c96a]">Portfolio</span>
            <br />
            <span className="text-[#00c96a]">To Check</span> Quality.
          </h2>
        </div>

        <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4">
          {projects.map((project) => {
            const isActive = project.id === activeId;

            return (
              <article
                key={project.id}
                className={`relative rounded-[30px] overflow-hidden min-h-[520px] lg:min-h-[620px] cursor-pointer transition-all duration-700 ease-out ${
                  isActive ? 'lg:flex-[3.5]' : 'lg:flex-1 lg:min-w-[120px]'
                }`}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(project.id)}
                  aria-expanded={isActive}
                  aria-label={`Show project ${project.title}`}
                  className="absolute inset-0 z-10 w-full h-full"
                />
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 transition-all duration-500 ${isActive ? 'bg-black/35' : 'bg-black/55'}`} />

                <div
                  className={`absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8 z-20 flex items-end justify-between gap-4 transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'
                  }`}
                >
                  <div className={isActive ? 'max-w-[460px]' : 'max-w-[200px]'}>
                    <h3 className="text-white text-[24px] md:text-[34px] font-black leading-[1.06]">
                      {project.title}
                    </h3>
                    <p
                      className={`text-white/85 text-[16px] mt-2 transition-all duration-500 ${
                        isActive ? 'opacity-100 max-h-12' : 'opacity-75 max-h-0 overflow-hidden'
                      }`}
                    >
                      {project.category}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full bg-[#00c96a] text-white flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'w-16 h-16' : 'w-12 h-12'
                    }`}
                  >
                    <ArrowUpRight className={isActive ? 'w-7 h-7' : 'w-5 h-5'} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurProjectsSection;
