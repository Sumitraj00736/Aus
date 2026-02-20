import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Footer from '../../components/layout/Footer';
import JoinUsSection from '../../components/home/JoinUsSection';
import { API_BASE, apiRequest } from '../../lib/api';

const BlogDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '', saveInfo: false });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      apiRequest(`/public/blogs/${slug}`),
      apiRequest<any[]>('/public/blogs'),
      apiRequest<any[]>(`/public/blogs/${slug}/messages`),
    ])
      .then(([postData, postsData, messageData]) => {
        setPost(postData);
        setAllPosts(postsData);
        setMessages(messageData);
      })
      .catch(() => undefined);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const socket = io(API_BASE.replace('/api', ''), { transports: ['websocket'] });

    socket.on(`blog:${slug}:message`, (payload) => {
      const row = payload?.message || payload;
      if (!row?._id || row.status === 'spam' || row.status === 'pending') return;

      setMessages((prev) => {
        const exists = (items: any[]): boolean =>
          items.some((item) => item._id === row._id || (item.replies && exists(item.replies)));
        if (exists(prev)) return prev;

        if (row.parentMessageId) {
          const attach = (items: any[]): any[] =>
            items.map((item) => {
              if (String(item._id) === String(row.parentMessageId)) {
                return { ...item, replies: [...(item.replies || []), { ...row, replies: [] }] };
              }
              return item.replies ? { ...item, replies: attach(item.replies) } : item;
            });
          return attach(prev);
        }

        return [...prev, { ...row, replies: [] }];
      });
    });

    return () => {
      socket.close();
    };
  }, [slug]);

  const filteredRecent = useMemo(() => {
    const source = allPosts.filter((row) => row.slug !== slug);
    if (!search.trim()) return source.slice(0, 4);
    const q = search.toLowerCase();
    return source.filter((row) => row.title?.toLowerCase().includes(q)).slice(0, 4);
  }, [allPosts, search, slug]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((row) => set.add(row.category || 'Uncategorized'));
    return Array.from(set);
  }, [allPosts]);

  const popularTags = post?.popularTags?.length ? post.popularTags : ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'];

  const postDate = post?.publishedAt || post?.createdAt;
  const currentIndex = allPosts.findIndex((row) => row.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slug) return;
    setSending(true);
    try {
      await apiRequest('/submissions/blog-messages', {
        method: 'POST',
        body: JSON.stringify({
          blogSlug: slug,
          name: form.name,
          email: form.email,
          website: form.website,
          message: form.message,
        }),
      });
      setForm({ name: '', email: '', website: '', message: '', saveInfo: form.saveInfo });
      alert('Your message has been posted.');
    } catch (error: any) {
      alert(error.message || 'Failed to post message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="relative pt-[170px] pb-[150px] overflow-hidden">
        <img
          src={post?.bannerImage || 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=2200&q=80'}
          alt={post?.title || 'Blog banner'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f2230]/70" />
        <div className="relative z-10 page-container">
          <p className="text-white/95 text-[16px] font-semibold text-center leading-[1.4]">
            Home <span className="mx-3">›</span> Posts <span className="mx-3">›</span> {post?.category || 'Power Tools'} <span className="mx-3">›</span> {post?.title || '...'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f4f6f8]">
        <div className="page-container max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1.6fr_0.8fr] gap-10">
          <div className="min-w-0">
            <h1 className="text-[38px] md:text-[56px] leading-[1.02] font-semibold text-[#1f2c3c] mb-5 break-words">{post?.title}</h1>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <span className="bg-[#00A859] text-white text-[17px] font-semibold px-6 py-2 rounded-full">{post?.category || 'Power Tools'}</span>
              <span className="inline-flex items-center gap-2 text-[#7a8695] text-[18px]">
                <CalendarDays className="w-5 h-5 text-[#00A859]" />
                <span className="text-[18px]">{postDate ? new Date(postDate).toLocaleDateString() : ''}</span>
              </span>
              <span className="text-[#8c98a5] text-[18px]">BY {post?.author || 'ADMIN'}</span>
            </div>
            <p className="text-[18px] leading-[1.65] text-[#5a6673] mb-8 text-left break-words">{post?.excerpt}</p>

            <img src={post?.coverImage} alt={post?.title} className="w-full h-[560px] object-cover rounded-[26px] mb-10" />

            <div className="text-[18px] text-[#5a6673] leading-[1.78] space-y-7 mb-10 text-left">
              {post?.content?.split('\n\n').filter(Boolean).map((line: string, idx: number) => (
                <p key={`${line}-${idx}`} className="break-words">{line}</p>
              ))}
            </div>

            <h2 className="text-[44px] md:text-[58px] leading-[1] text-[#1f2c3c] font-semibold mb-6">Create a Cleaning Schedule</h2>
            <p className="text-[18px] text-[#5a6673] leading-[1.7] mb-8">
              “She came out petrified with her Piggy Bank, HER PIGGY BANK! hoping that the men would take it and leave her dad alone,” one outraged officer wrote. especially in capital projects and the suppliers and consultants that work for you know the value of a customer like that.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-9">
              {(post?.galleryImages || []).slice(0, 2).map((image: string) => (
                <img key={image} src={image} alt="Blog gallery" className="w-full h-[360px] object-cover rounded-[24px]" />
              ))}
            </div>

            <h2 className="text-[44px] md:text-[58px] leading-[1] text-[#1f2c3c] font-semibold mb-6">Exploring Design Styles</h2>
            <p className="text-[18px] text-[#5a6673] leading-[1.7] mb-9">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable.
            </p>

            <div className="bg-[#ebedef] rounded-[28px] px-16 py-14 text-center mb-10">
              <p className="text-[#00A859] text-[84px] leading-none mb-4">“</p>
              <p className="text-[32px] md:text-[46px] leading-[1.28] text-[#1f2c3c] font-semibold mb-5">
                {post?.quoteText || 'A massage is just like a movie, really relaxing and a total escape, except in a massage you are the star. And you do not miss anything by falling asleep!'}
              </p>
              <p className="text-[28px] md:text-[36px] text-[#111827] font-semibold">{post?.quoteAuthor || 'Dishes Cleaning'}</p>
            </div>

            <h2 className="text-[44px] md:text-[58px] leading-[1] text-[#1f2c3c] font-semibold mb-6">Protecting Your Pet’s Favorite Spots</h2>
            <p className="text-[18px] text-[#5a6673] leading-[1.7] mb-8">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {(post?.tags || ['Furniture', 'Interior', 'Living Room']).map((tag: string) => (
                <span key={tag} className="rounded-full border border-[#d7dde3] px-6 py-2 text-[16px] text-[#3f4d5a]">{tag}</span>
              ))}
            </div>

            <div className="border-y border-[#d7dde3] py-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[16px] text-[#667481] uppercase inline-flex items-center gap-2 mb-3"><ArrowLeft className="w-6 h-6" />Previous Post</p>
                {prevPost ? (
                  <Link to={`/blog/${prevPost.slug}`} className="block text-[28px] md:text-[34px] leading-[1.2] font-semibold text-[#1f2c3c] hover:text-[#00A859] break-words">
                    {prevPost.title}
                  </Link>
                ) : null}
              </div>
              <div className="md:text-right">
                <p className="text-[16px] text-[#667481] uppercase inline-flex items-center gap-2 mb-3">Next Post <ArrowRight className="w-6 h-6" /></p>
                {nextPost ? (
                  <Link to={`/blog/${nextPost.slug}`} className="block text-[28px] md:text-[34px] leading-[1.2] font-semibold text-[#1f2c3c] hover:text-[#00A859] break-words">
                    {nextPost.title}
                  </Link>
                ) : null}
              </div>
            </div>

            <h3 className="text-[48px] md:text-[72px] leading-[1] text-[#1f2c3c] font-semibold mb-10">
              Customer <span className="text-[#00A859]">Reviews</span>
            </h3>

            <div className="space-y-10 mb-16">
              {messages.map((message) => (
                <article key={message._id} className="pb-8 border-b border-[#d7dde3]">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#d9dde2]" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[28px] text-[#1f2c3c] font-semibold">{message.name}</p>
                          <p className="text-[15px] text-[#6f7c88] uppercase">{new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-[18px] text-[#5a6673] leading-[1.7] mb-4">{message.message}</p>
                      {(message.replies || []).map((reply: any) => (
                        <div key={reply._id} className="pl-6 border-l-2 border-[#00A859] mt-4">
                          <p className="text-[22px] font-semibold text-[#1f2c3c]">{reply.name}</p>
                          <p className="text-[14px] text-[#6f7c88] uppercase mb-2">{new Date(reply.createdAt).toLocaleString()}</p>
                          <p className="text-[18px] text-[#5a6673] leading-[1.7]">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <h3 className="text-[48px] md:text-[72px] leading-[1] text-[#1f2c3c] font-semibold mb-5">
              Leave A <span className="text-[#00A859]">Reply</span>
            </h3>
            <p className="text-[18px] text-[#5e6a77] mb-6">Your email address will not be published. Required fields are marked *</p>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name *" required className="h-[64px] rounded-full border border-[#d7dde3] px-7 text-[16px] outline-none" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" required type="email" className="h-[64px] rounded-full border border-[#d7dde3] px-7 text-[16px] outline-none" />
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Your Website" className="h-[64px] rounded-full border border-[#d7dde3] px-7 text-[16px] outline-none" />
              </div>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message Here.." required className="w-full h-[220px] rounded-[26px] border border-[#d7dde3] px-7 py-6 text-[16px] outline-none resize-none" />
              <label className="inline-flex items-center gap-3 text-[16px] text-[#5e6a77]">
                <input type="checkbox" checked={form.saveInfo} onChange={(e) => setForm({ ...form, saveInfo: e.target.checked })} className="w-6 h-6" />
                Save my name, email, and website in this browser for the next time I comment.
              </label>
              <button disabled={sending} className="inline-flex items-center gap-3 rounded-full bg-[#1f2c3c] hover:bg-[#00A859] text-white text-[16px] font-semibold px-10 h-[66px] transition-colors">
                {sending ? 'Posting...' : 'Post Comment'} <span className="w-8 h-8 rounded-full bg-[#00A859] grid place-items-center">→</span>
              </button>
            </form>
          </div>

          <aside className="min-w-0 xl:pl-2">
            <div className="xl:sticky xl:top-[130px] space-y-10">
              <div>
                <h4 className="text-[24px] text-[#1f2c3c] font-semibold mb-4">Search</h4>
                <div className="relative">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ..." className="w-full h-[68px] rounded-full border border-[#d7dde3] px-8 pr-14 text-[16px] outline-none" />
                  <Search className="w-8 h-8 text-[#6a7684] absolute right-6 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <h4 className="text-[24px] text-[#1f2c3c] font-semibold mb-4">Categories</h4>
                <div className="bg-transparent">
                  {categories.map((category) => (
                    <p key={category} className="text-[18px] text-[#1f2c3c] py-4 border-b border-[#d7dde3]">{category}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[24px] text-[#1f2c3c] font-semibold mb-5">Recent Posts</h4>
                <div className="space-y-5">
                  {filteredRecent.map((recent) => (
                    <Link key={recent._id} to={`/blog/${recent.slug}`} className="grid grid-cols-[116px_1fr] gap-4 border-b border-[#d7dde3] pb-5 min-w-0">
                      <img src={recent.coverImage} alt={recent.title} className="w-full h-[104px] object-cover rounded-[16px]" />
                      <div className="min-w-0">
                        <p className="text-[14px] text-[#7c8795] mb-1 inline-flex items-center gap-2"><CalendarDays className="w-5 h-5 text-[#00A859]" />{new Date(recent.publishedAt || recent.createdAt).toLocaleDateString()}</p>
                        <p className="text-[20px] leading-[1.2] text-[#1f2c3c] font-semibold break-words">{recent.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[24px] text-[#1f2c3c] font-semibold mb-4">Popular Tags</h4>
                <div className="flex flex-wrap gap-3">
                  {popularTags.map((tag: string) => (
                    <span key={tag} className="rounded-full border border-[#d7dde3] px-5 py-2 text-[16px] text-[#4b5967]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <JoinUsSection />
      <Footer />
    </>
  );
};

export default BlogDetailPage;
