import React from 'react';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const posts = [
  {
    title: 'Myths About Professional Cleaning Services Debunked!',
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=900&q=80',
    tag: 'Ware Accessories',
  },
  {
    title: 'How to Choose the Right Cleaning Service for Your Home',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80',
    tag: 'Power Tools',
  },
  {
    title: 'Moving Out? Here is Why You Need a Move-Out Cleaning Service',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=900&q=80',
    tag: 'Power Tools',
  },
];

const FromBlogSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f6f6f6]">
      <div className="max-w-[1240px] mx-auto px-4 xl:px-6">
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
            <article key={post.title}>
              <div className="relative mb-5 overflow-hidden rounded-[22px]">
                <img src={post.image} alt={post.title} className="w-full h-[300px] object-cover" />
                <span className="absolute top-4 left-4 bg-[#00A859] text-white text-[13px] font-bold px-4 py-2 rounded-full">
                  {post.tag}
                </span>
              </div>

              <div className="flex items-center gap-5 text-[#7a7a7a] text-[13px] font-semibold uppercase tracking-wide mb-4">
                <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Jul 02, 2025</span>
                <span className="inline-flex items-center gap-2"><UserRound className="w-4 h-4" /> By Admin</span>
              </div>

              <h3 className="text-[#1f2c3c] text-[18px] md:text-[20px] leading-tight font-black mb-6">{post.title}</h3>

              <Link to="/blog" className="inline-flex items-center gap-2 text-[#1f2c3c] font-bold text-[18px] md:text-[18px] hover:text-[#00A859] transition-colors">
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
