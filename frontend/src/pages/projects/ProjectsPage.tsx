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
      .then((rows) => setProjects(rows))
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
      <PageHero title="Our Projects" subtitle="You can check our portfolio to verify quality." />

      <section className="py-20 bg-[#f2f2ee]">
        <div className="page-container max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visible.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project.slug}`}
                className="group relative rounded-[24px] overflow-hidden bg-white border border-[#dbe1e8] shadow-sm"
              >
                <img
                  src={project.coverImage || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1200&q=80'}
                  alt={project.title}
                  className="w-full h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202426] via-black/20 to-transparent opacity-90" />
                <div className="absolute left-6 right-6 bottom-6">
                  <h3 className="text-white text-[24px] font-semibold leading-[1.2] mb-2">{project.title}</h3>
                  <p className="text-white/85 text-[14px] uppercase tracking-wide">{project.category || 'Residential'}</p>
                </div>
                <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#00A859] text-white grid place-items-center shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-10 text-[14px]">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-full border border-[#d0d6dc] grid place-items-center text-[#1f2c3c]"
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
                    currentPage === pageNum ? 'bg-[#00A859] text-white' : 'border border-[#d0d6dc] text-[#1f2c3c]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="w-8 h-8 rounded-full border border-[#d0d6dc] grid place-items-center text-[#1f2c3c]"
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
