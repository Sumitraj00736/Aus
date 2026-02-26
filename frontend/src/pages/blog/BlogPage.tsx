import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiRequest<any[]>('/public/blogs')
      .then((rows) => setPosts(rows))
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter((post) => (post.title || '').toLowerCase().includes(q));
  }, [posts, search]);

  const featured = filtered[0];
  const list = filtered.slice(1);
  const recent = posts.slice(0, 4);
  const categories = Array.from(new Set(posts.map((post) => post.category || 'Uncategorized')));
  const allTags = Array.from(
    new Set(posts.flatMap((post) => (post.popularTags?.length ? post.popularTags : ['Architecture', 'Building', 'Construction', 'Design'])))
  );

  return (
    <section className="pt-[150px] pb-20 bg-[#f2f2ee]">
      <div className="page-container max-w-[1320px] grid grid-cols-1 xl:grid-cols-[1.62fr_0.75fr] gap-12">
        <div className="space-y-10">
          {featured ? (
            <article className="pb-10 border-b border-[#d6dce3]">
              <Link to={`/blog/${featured.slug}`} className="block relative overflow-hidden rounded-[26px] mb-5">
                {featured.category ? (
                  <span className="absolute top-5 left-5 z-10 inline-flex rounded-full bg-[#00A859] text-white text-[11px] font-semibold px-4 py-1.5">
                    {featured.category}
                  </span>
                ) : null}
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-[420px] object-cover hover:scale-[1.02] transition-transform duration-500"
                />
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#8893a1] mb-3 uppercase tracking-wide">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#00A859]" />
                  {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5 text-[#00A859]" /> BY {featured.author || 'ADMIN'}
                </span>
              </div>
              <Link to={`/blog/${featured.slug}`}>
                <h2 className="text-[#00A859] text-[48px] md:text-[56px] leading-[0.95] font-semibold mb-4">{featured.title}</h2>
              </Link>
              <p className="text-[#5c6774] text-[15px] leading-[1.65] mb-5 max-w-[900px]">{featured.excerpt}</p>
              <Link to={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-[#1f2c3c] hover:text-[#00A859] text-[15px] font-semibold">
                Read More <span className="w-5 h-5 rounded-full bg-[#00A859] text-white grid place-items-center text-[11px]">→</span>
              </Link>
            </article>
          ) : null}

          {list.map((post) => (
            <article key={post._id} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 pb-8 border-b border-[#d6dce3]">
              <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden rounded-[20px]">
                {post.category ? (
                  <span className="absolute top-3 left-3 z-10 inline-flex rounded-full bg-[#00A859] text-white text-[10px] font-semibold px-3 py-1">
                    {post.category}
                  </span>
                ) : null}
                <img src={post.coverImage} alt={post.title} className="w-full h-[220px] object-cover" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8a95a3] mb-2 uppercase tracking-wide">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-[#00A859]" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5 text-[#00A859]" /> BY {post.author || 'ADMIN'}
                  </span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-[40px] md:text-[46px] leading-[0.95] text-[#1f2c3c] font-semibold mb-3">{post.title}</h3>
                </Link>
                <p className="text-[#5c6774] text-[15px] leading-[1.65] mb-4">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#1f2c3c] hover:text-[#00A859] text-[15px] font-semibold">
                  Read More <span className="w-5 h-5 rounded-full bg-[#00A859] text-white grid place-items-center text-[11px]">→</span>
                </Link>
              </div>
            </article>
          ))}

          <div className="flex items-center gap-4 text-[15px]">
            <span className="w-8 h-8 rounded-full bg-[#00A859] text-white grid place-items-center">1</span>
            <span className="text-[#1f2c3c]">2</span>
            <span className="text-[#1f2c3c]">...</span>
            <span className="text-[#1f2c3c]">5</span>
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white grid place-items-center text-[11px]">→</span>
          </div>
        </div>

        <aside>
          <div className="xl:sticky xl:top-[120px] space-y-10">
            <div>
              <h4 className="text-[44px] leading-[1] font-semibold text-[#1f2c3c] mb-4">Search</h4>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ..."
                  className="w-full h-[58px] rounded-full border border-[#d2d8df] bg-transparent px-6 pr-12 text-[15px] outline-none"
                />
                <Search className="w-5 h-5 text-[#6f7b89] absolute right-5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <h4 className="text-[44px] leading-[1] font-semibold text-[#1f2c3c] mb-4">Categories</h4>
              <div>
                {categories.map((category) => (
                  <p key={category} className="text-[16px] text-[#1f2c3c] py-2.5 border-b border-[#d2d8df]">
                    {category}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[44px] leading-[1] font-semibold text-[#1f2c3c] mb-5">Recent Posts</h4>
              <div className="space-y-4">
                {recent.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="grid grid-cols-[84px_1fr] gap-3 border-b border-[#d2d8df] pb-4">
                    <img src={post.coverImage} alt={post.title} className="w-full h-[72px] rounded-[12px] object-cover" />
                    <div>
                      <p className="inline-flex items-center gap-1.5 text-[10px] text-[#8a95a3] uppercase tracking-wide mb-1">
                        <CalendarDays className="w-3 h-3 text-[#00A859]" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[17px] leading-[1.15] text-[#1f2c3c] font-semibold">{post.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[44px] leading-[1] font-semibold text-[#1f2c3c] mb-4">Popular Tags</h4>
              <div className="flex flex-wrap gap-2.5">
                {allTags.slice(0, 10).map((tag) => (
                  <span key={tag} className="rounded-full border border-[#cfd6de] px-4 py-1.5 text-[14px] text-[#4f5d6c]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default BlogPage;
