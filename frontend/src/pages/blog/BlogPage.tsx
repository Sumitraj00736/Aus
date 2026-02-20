import React, { useEffect, useState } from 'react';
import { CalendarDays, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/layout/Footer';
import JoinUsSection from '../../components/home/JoinUsSection';
import { apiRequest } from '../../lib/api';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    apiRequest<any[]>('/public/blogs')
      .then((rows) => setPosts(rows))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <PageHero title="From Our Blog" subtitle="Industry updates, practical cleaning tips, and home-care insights." />
      <section className="py-20 bg-[#f5f6f8]">
        <div className="page-container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {posts.map((post) => (
            <article key={post._id} className="rounded-[22px] border border-[#dde3ea] bg-white p-5">
              <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-[16px] mb-4">
                <img src={post.coverImage} alt={post.title} className="w-full h-[240px] object-cover hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="flex items-center gap-4 text-[12px] text-[#7b8794] mb-3">
                <span className="inline-flex items-center gap-1"><CalendarDays className="w-4 h-4 text-[#00A859]" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                <span className="inline-flex items-center gap-1"><UserRound className="w-4 h-4 text-[#00A859]" />{post.author || 'Admin'}</span>
              </div>
              <h2 className="text-[26px] leading-[1.1] text-[#1f2c3c] font-semibold mb-3">{post.title}</h2>
              <p className="text-[#5f6b78] text-[15px] leading-[1.7] mb-5">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#00A859] text-[15px] font-semibold">
                Read More
              </Link>
            </article>
          ))}
        </div>
      </section>
      <JoinUsSection />
      <Footer />
    </>
  );
};

export default BlogPage;
