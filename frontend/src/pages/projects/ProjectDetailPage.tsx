import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const ProjectDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([apiRequest(`/public/projects/${slug}`), apiRequest<any[]>('/public/projects')])
      .then(([row, rows]) => {
        setProject(row);
        setAllProjects(rows);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const previous = useMemo(() => {
    const idx = allProjects.findIndex((item) => item.slug === slug);
    if (idx > 0) return allProjects[idx - 1];
    return null;
  }, [allProjects, slug]);

  if (notFound) return <Navigate to="/project" replace />;
  if (!project) return <div className="min-h-[50vh] page-container py-24">Loading...</div>;

  const gallery = (project.galleryImages?.length ? project.galleryImages : [project.coverImage]).slice(0, 2);
  const points = project.benefitPoints?.length
    ? project.benefitPoints
    : [
        'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.',
        'Your time is precious, and we understand that cleaning is really one more item on your to-do list.',
        'We carefully screen all cleaners, so you can rest assured that your home receives the highest quality service.',
        'Lint roll everything and clean details especially if you have pets.',
      ];

  return (
    <section className="pt-[150px] pb-20 bg-[#f2f2ee]">
      <div className="page-container max-w-[1240px]">
        <ProjectHero image={project.coverImage} title={project.title} />

        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-8 items-start">
          <ProjectMeta
            completionDate={project.completionDate}
            clients={project.clients}
            location={project.location}
            category={project.projectCategory || project.category}
          />

          <div className="space-y-8">
            <ProjectOverview title={project.overviewTitle} html={project.overviewText} />
            <ProjectGallery images={gallery} title={project.title} />
            <ProjectOverview title="" html={project.overviewText} />
            <ProjectBenefits title={project.benefitsTitle} text={project.benefitsText} points={points} />
            <ProjectReview
              title={project.reviewTitle}
              text={project.benefitsText}
              quote={project.reviewQuote}
              author={project.reviewAuthor}
            />
            <ProjectPrev previous={previous} fallback={project.previousProjectText} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectHero: React.FC<{ image?: string; title?: string }> = ({ image, title }) => (
  <div className="animate-block">
    <img
      src={image || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1400&q=80'}
      alt={title || 'Project'}
      className="w-full h-[480px] object-cover rounded-[18px] mb-9"
    />
  </div>
);

const ProjectMeta: React.FC<{ completionDate?: string; clients?: string; location?: string; category?: string }> = ({
  completionDate,
  clients,
  location,
  category,
}) => (
  <aside className="rounded-[14px] border border-[#d0d7de] overflow-hidden bg-[#f4f4f2] animate-block">
    <Meta label="Completion Date" value={completionDate || 'October 30, 2025'} />
    <Meta label="Clients" value={clients || 'Themeforest, Evanto'} />
    <Meta label="Location" value={location || 'Main Address, USA'} />
    <Meta label="Category" value={category || 'Residential'} />
  </aside>
);

const ProjectOverview: React.FC<{ title?: string; html?: string }> = ({ title, html }) => (
  <div className="animate-block">
    {title ? (
      <h1 className="text-[46px] md:text-[52px] leading-[0.98] font-semibold text-[#1f2c3c] mb-3">{title}</h1>
    ) : null}
    <div className="text-[#5d6874] text-[13px] leading-[1.65]" dangerouslySetInnerHTML={{ __html: html || '' }} />
  </div>
);

const ProjectGallery: React.FC<{ images: string[]; title?: string }> = ({ images, title }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-block">
    {images.map((img, idx) => (
      <img key={`${img}-${idx}`} src={img} alt={`${title} ${idx + 1}`} className="w-full h-[210px] object-cover rounded-[12px]" />
    ))}
  </div>
);

const ProjectBenefits: React.FC<{ title?: string; text?: string; points: string[] }> = ({ title, text, points }) => (
  <div className="animate-block">
    <h2 className="text-[42px] md:text-[48px] leading-[0.98] font-semibold text-[#1f2c3c] mb-2">{title || 'Project Benefits'}</h2>
    <p className="text-[#5d6874] text-[13px] leading-[1.65] mb-4">{text}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
      {points.map((point) => (
        <p key={point} className="inline-flex items-start gap-2 text-[12px] leading-[1.6] text-[#2c3947]">
          <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 flex-none" />
          <span>{point}</span>
        </p>
      ))}
    </div>
  </div>
);

const ProjectReview: React.FC<{ title?: string; text?: string; quote?: string; author?: string }> = ({
  title,
  text,
  quote,
  author,
}) => (
  <div className="animate-block">
    <h3 className="text-[40px] md:text-[46px] leading-[0.98] font-semibold text-[#1f2c3c] mb-2">{title || 'Customer Reviews'}</h3>
    <p className="text-[#5d6874] text-[13px] leading-[1.65] mb-3">{text}</p>
    <div className="rounded-[14px] bg-[#e9ebed] p-6">
      <div className="w-9 h-9 rounded-full bg-[#8aef72] grid place-items-center text-[#1f2c3c] text-[20px] font-bold mb-3">“</div>
      <p className="text-[30px] md:text-[34px] leading-[1.15] text-[#1f2c3c] font-medium mb-3">{quote}</p>
      <p className="text-[14px] text-[#1f2c3c] font-semibold">{author || 'Dishes Cleaning'}</p>
    </div>
  </div>
);

const ProjectPrev: React.FC<{ previous?: any; fallback?: string }> = ({ previous, fallback }) => (
  <div className="pt-6 border-t border-[#d5dbe2] animate-block">
    <p className="text-[11px] uppercase text-[#8b95a2] mb-1">Previous Project</p>
    {previous ? (
      <Link to={`/project/${previous.slug}`} className="text-[18px] font-semibold text-[#1f2c3c] hover:text-[#00A859]">
        {previous.title}
      </Link>
    ) : (
      <p className="text-[18px] font-semibold text-[#1f2c3c]">{fallback || 'Solar Panel Cleaning'}</p>
    )}
  </div>
);

const Meta: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="px-4 py-4 border-b border-[#d0d7de] last:border-b-0">
    <p className="text-[18px] leading-none font-semibold text-[#1f2c3c] mb-1">{label} :</p>
    <p className="text-[12px] text-[#687584]">{value}</p>
  </div>
);

export default ProjectDetailPage;
