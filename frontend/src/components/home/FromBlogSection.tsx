import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const FromBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<any[]>('/public/blogs')
      .then((data) => {
        // Fallback to dummy data if API is empty so you can see the design
        if (!data || data.length === 0) {
          setPosts([
            { _id: '1', title: 'Myths About Professional Cleaning Services – Debunked!', slug: 'myths', coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', tags: ['Ware Accessories'], author: 'ADMIN', createdAt: new Date() },
            { _id: '2', title: 'The Ultimate Deep Cleaning Checklist for Your Home', slug: 'checklist', coverImage: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=400', tags: ['Power Tools'], author: 'ADMIN', createdAt: new Date() },
            { _id: '3', title: 'The Germiest Spots in Your Home (and How Pros...', slug: 'germs', coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400', tags: ['Home Appliance'], author: 'ADMIN', createdAt: new Date() },
            { _id: '4', title: 'Spring Cleaning vs. Deep Cleaning: What’s the...', slug: 'spring', coverImage: 'https://images.unsplash.com/photo-1550963048-19309485132d?w=400', tags: ['Ware Accessories'], author: 'ADMIN', createdAt: new Date() },
          ]);
        } else {
          setPosts(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }).toUpperCase();
  };

  if (isLoading) return <div className="py-24 text-center font-poppins">Loading...</div>;

  return (
    <section className="py-24 bg-[#f2f2ee] font-poppins">
      <div className="max-w-[1320px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
             <span className="text-[#00A859] text-xl">✦</span>
             <p className="text-[#555] text-[13px] font-bold uppercase tracking-[0.2em]">From Our Blog</p>
          </div>
          <h2 className="text-[42px] md:text-[64px] leading-[1.05] font-bold text-[#1f2c3c]">
            Learn About <span className="text-[#00A859]">Our Latest</span>
            <br />
            <span className="text-[#00A859]">News</span> From Blog.
          </h2>
        </div>

        {/* Layout: Large Post Left, Small Posts Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 1. Large Featured Post (Left) */}
          {posts[0] && (
            <article className="group">
              <div className="relative mb-8 overflow-hidden rounded-[40px] h-[450px] md:h-[600px]">
                <img src={posts[0].coverImage} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute top-6 left-6 bg-[#00A859] text-white text-[12px] font-bold px-6 py-2.5 rounded-full uppercase">
                  {posts[0].tags?.[0] || 'News'}
                </span>
              </div>
              <div className="flex items-center gap-6 text-[#7a7a7a] text-[12px] font-semibold tracking-wider mb-5 uppercase">
                <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#00A859]" /> {formatDate(posts[0].createdAt)}</span>
                <span className="inline-flex items-center gap-2"><UserRound className="w-4 h-4 text-[#00A859]" /> BY {posts[0].author || 'ADMIN'}</span>
              </div>
              <h3 className="text-[#1f2c3c] text-[32px] md:text-[38px] leading-tight font-bold mb-6 group-hover:text-[#00A859] transition-colors line-clamp-2">
                {posts[0].title}
              </h3>
              <Link to={`/blog/${posts[0].slug}`} className="inline-flex items-center gap-3 text-[#1f2c3c] font-bold text-[18px] group-hover:text-[#00A859]">
                Read More <div className="w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center text-white"><ArrowRight size={18} /></div>
              </Link>
            </article>
          )}

          {/* 2. Smaller Posts (Right Side - Stacked) */}
          <div className="flex flex-col gap-10 overflow-y-auto max-h-[850px] pr-4 scrollbar-hide">
            {posts.slice(1).map((post) => (
              <article key={post._id} className="group grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-8 items-center border-b border-gray-200 pb-10 last:border-0 last:pb-0">
                <div className="relative overflow-hidden rounded-[30px] h-[180px] w-full">
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute top-4 left-4 bg-[#00A859] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">
                    {post.tags?.[0] || 'Clean'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-4 text-[#7a7a7a] text-[11px] font-semibold tracking-widest mb-3 uppercase">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}</span>
                    <span className="inline-flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5" /> BY {post.author || 'ADMIN'}</span>
                  </div>
                  <h3 className="text-[#1f2c3c] text-[22px] font-bold leading-tight mb-4 group-hover:text-[#00A859] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#1f2c3c] font-bold text-[15px] group-hover:text-[#00A859]">
                    Read More <div className="w-6 h-6 rounded-full bg-[#00A859] flex items-center justify-center text-white"><ArrowRight size={14} /></div>
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FromBlogSection;