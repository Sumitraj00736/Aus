import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";

const FromBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<any[]>("/public/blogs")
      .then((data) => {
        if (!data || data.length === 0) {
          setPosts([
            {
              _id: "1",
              title: "Myths About Professional Cleaning Services – Debunked!",
              slug: "myths",
              coverImage:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
              tags: ["Ware Accessories"],
              author: "ADMIN",
              createdAt: new Date(),
            },
            {
              _id: "2",
              title: "The Ultimate Deep Cleaning Checklist for Your Home",
              slug: "checklist",
              coverImage:
                "https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=400",
              tags: ["Power Tools"],
              author: "ADMIN",
              createdAt: new Date(),
            },
            {
              _id: "3",
              title: "The Germiest Spots in Your Home (and How Pros Clean Them)",
              slug: "germs",
              coverImage:
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
              tags: ["Home Appliance"],
              author: "ADMIN",
              createdAt: new Date(),
            },
            {
              _id: "4",
              title: "Spring Cleaning vs. Deep Cleaning: What’s the Difference?",
              slug: "spring",
              coverImage:
                "https://images.unsplash.com/photo-1550963048-19309485132d?w=400",
              tags: ["Ware Accessories"],
              author: "ADMIN",
              createdAt: new Date(),
            },
          ]);
        } else {
          setPosts(data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const formatDate = (dateString: any) => {
    return new Date(dateString)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (isLoading)
    return <div className="py-24 text-center font-poppins">Loading...</div>;

  return (
    <section className="py-20 lg:py-24 bg-[#f2f2ee] font-poppins">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[#00A859] text-xl">✦</span>
            <p className="text-[#555] text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em]">
              From Our Blog
            </p>
          </div>

          <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[64px] leading-[1.1] font-bold text-[#1f2c3c]">
            Learn About <span className="text-[#00A859]">Our Latest</span>
            <br />
            <span className="text-[#00A859]">News</span> From Blog.
          </h2>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">

          {/* Featured Post */}
          {posts[0] && (
            <article className="group flex flex-col lg:h-[420px] justify-between">
              
              {/* Image */}
              <div className="relative overflow-hidden rounded-[28px] lg:rounded-[40px] h-[250px] sm:h-[320px] lg:h-[70%]">
                <img
                  src={posts[0].coverImage}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-5 left-5 bg-[#00A859] text-white text-[11px] font-bold px-5 py-2 rounded-full uppercase">
                  {posts[0].tags?.[0] || "News"}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-end lg:h-[30%] mt-6">
                <div className="flex flex-wrap items-center gap-4 text-[#7a7a7a] text-[11px] sm:text-[12px] font-semibold tracking-wider mb-3 uppercase">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#00A859]" />
                    {formatDate(posts[0].createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="w-4 h-4 text-[#00A859]" />
                    BY {posts[0].author || "ADMIN"}
                  </span>
                </div>

                <h3 className="text-[#1f2c3c] text-[20px] sm:text-[22px] lg:text-[20px] leading-tight font-bold mb-4 group-hover:text-[#00A859] transition-colors line-clamp-2">
                  {posts[0].title}
                </h3>

                <Link
                  to={`/blog/${posts[0].slug}`}
                  className="inline-flex items-center gap-3 text-[#1f2c3c] font-bold text-[16px] sm:text-[18px] group-hover:text-[#00A859]"
                >
                  Read More
                  <div className="w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center text-white">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </div>
            </article>
          )}

          {/* Right Posts */}
          <div className="flex flex-col gap-8 lg:gap-6 lg:overflow-y-auto lg:h-[400px] lg:pr-4 scrollbar-hide">
            {posts.slice(1).map((post) => (
              <article
                key={post._id}
                className="group grid grid-cols-1 sm:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-5 items-start border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                
                {/* Image */}
                <div className="relative overflow-hidden rounded-[20px] lg:rounded-[30px] h-[200px] sm:h-[160px] lg:h-[180px] w-full">
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 bg-[#00A859] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">
                    {post.tags?.[0] || "Clean"}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-[#7a7a7a] text-[11px] font-semibold tracking-widest mb-2 uppercase">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="w-3.5 h-3.5" />
                      BY {post.author || "ADMIN"}
                    </span>
                  </div>

                  <h3 className="text-[#1f2c3c] text-[18px] sm:text-[20px] lg:text-[22px] font-bold leading-tight mb-3 group-hover:text-[#00A859] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#1f2c3c] font-bold text-[14px] sm:text-[15px] group-hover:text-[#00A859]"
                  >
                    Read More
                    <div className="w-6 h-6 rounded-full bg-[#00A859] flex items-center justify-center text-white">
                      <ArrowRight size={14} />
                    </div>
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