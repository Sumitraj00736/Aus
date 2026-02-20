import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const FromBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    apiRequest<any[]>('/public/blogs')
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => undefined);
  }, []);

  return (
    <section className="py-24 bg-[#f6f6f6]">
      <div className="page-container">
        <div className="text-center mb-12">
          <p className="text-[#555] text-[14px] font-bold uppercase tracking-widest mb-4">From Our Blog</p>
          <h2 className="text-[30px] md:text-[58px] leading-[0.9] font-black text-[#1f2c3c]">
            Learn About <span className="text-[#00A859]">Our Latest</span>
            <br />
            <span className="text-[#00A859]">News</span> From Blog.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post._id}>
              <div className="relative mb-5 overflow-hidden rounded-[22px]">
                <img src={post.coverImage} alt={post.title} className="w-full h-[300px] object-cover" />
                <span className="absolute top-4 left-4 bg-[#00A859] text-white text-[13px] font-bold px-4 py-2 rounded-full">
                  {(post.tags && post.tags[0]) || 'News'}
                </span>
              </div>

              <div className="flex items-center gap-5 text-[#7a7a7a] text-[13px] font-semibold uppercase tracking-wide mb-4">
                <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                <span className="inline-flex items-center gap-2"><UserRound className="w-4 h-4" /> {post.author || 'Admin'}</span>
              </div>

              <h3 className="text-[#1f2c3c] text-[18px] md:text-[20px] leading-tight font-black mb-6">{post.title}</h3>

              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#1f2c3c] font-bold text-[18px] hover:text-[#00A859] transition-colors">
                Read More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FromBlogSection;
