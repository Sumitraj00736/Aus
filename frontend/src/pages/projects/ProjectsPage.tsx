import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { apiRequest } from '../../lib/api';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    apiRequest<any[]>('/public/projects')
      .then((rows) => setProjects(rows || []))
      .catch(() => undefined);
  }, []);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visible = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [projects, currentPage]);

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="You can check our portfolio to verify quality."
      />

      <section className="py-16 sm:py-20 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px] px-5 sm:px-6">

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {visible.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project.slug}`}
                className="group relative rounded-[22px] overflow-hidden bg-white border border-[#dbe1e8] shadow-sm"
              >
                {/* Image */}
                <img
                  src={
                    project.coverImage ||
                    'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1200&q=80'
                  }
                  alt={project.title}
                  className="w-full h-[300px] sm:h-[380px] lg:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">

                  {/* Title & Category */}
                  <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                    <h3 className="text-white text-[20px] sm:text-[22px] lg:text-[24px] font-semibold leading-tight mb-1">
                      {project.title}
                    </h3>
                    <p className="text-white/80 text-[12px] uppercase tracking-wide">
                      {project.category || 'Residential'}
                    </p>
                  </div>

                  {/* Hidden Description (Reveal on Hover) */}
                  <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100">
                    <p className="text-white/85 text-[14px] mt-3">
                      {project.description ||
                        'Explore this completed project showcasing our expertise and quality workmanship.'}
                    </p>
                  </div>

                </div>

                {/* Arrow Button */}
                <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-[#00A859] text-white grid place-items-center shadow-md transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12 text-[14px]">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-full border border-[#d0d6dc] grid place-items-center text-[#1f2c3c] disabled:opacity-40"
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-full grid place-items-center ${
                    currentPage === pageNum
                      ? 'bg-[#00A859] text-white'
                      : 'border border-[#d0d6dc] text-[#1f2c3c]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="w-8 h-8 rounded-full border border-[#d0d6dc] grid place-items-center text-[#1f2c3c] disabled:opacity-40"
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default ProjectsPage;