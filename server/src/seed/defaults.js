import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';

const defaultPages = [
  { pageKey: 'home', title: 'Home', subtitle: 'Professional cleaning services for homes and businesses.', bannerImage: '' },
  { pageKey: 'services', title: 'Services Style 03', subtitle: 'Home > Services Style 03', bannerImage: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=2200&q=80' },
  { pageKey: 'projects', title: 'Our Projects', subtitle: 'A showcase of quality work', bannerImage: '' },
  { pageKey: 'page', title: 'More Pages', subtitle: 'Explore details', bannerImage: '' },
  { pageKey: 'blog', title: 'From Our Blog', subtitle: 'Latest cleaning updates', bannerImage: '' },
  { pageKey: 'contact', title: 'Contact Us', subtitle: 'Talk to our team', bannerImage: '' },
];

const defaultServices = [
  {
    slug: 'construction-cleaning',
    title: 'Construction Cleaning',
    shortDescription: 'Maintaining a clean and professional environment after build or renovation.',
    heroImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1621905252472-e8f3f8f7386f?w=1400&q=80',
    detailIntro: 'Construction cleanup with precision, safety, and detail-focused workflow.',
    detailBody: 'From debris removal to fine dust control, we prepare your space for immediate use.',
    features: ['Deep Cleaning Solutions', 'Comprehensive Cleaning'],
    checklist: ['Assess Areas Needing Cleaning', 'Dust Surfaces', 'Vacuum Carpets'],
    faqs: [{ question: 'What types of spaces do you clean?', answer: 'Homes, offices, and post-renovation sites.' }],
    sortOrder: 1,
  },
  {
    slug: 'move-in-out-cleaning',
    title: 'Move In Out Cleaning',
    shortDescription: 'Professional move-in/move-out cleaning for stress-free transitions.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1400&q=80',
    detailIntro: 'Move with confidence while we take care of every cleaning detail.',
    detailBody: 'Kitchens, bathrooms, floors, windows and high-touch points are deep-cleaned.',
    sortOrder: 2,
  },
  {
    slug: 'regular-home-cleaning',
    title: 'Regular Home Cleaning',
    shortDescription: 'Recurring home cleaning plans to keep your space fresh and healthy.',
    heroImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1400&q=80',
    detailIntro: 'Flexible recurring schedules and reliable care for all home sizes.',
    detailBody: 'Weekly and bi-weekly plans designed around your routine.',
    sortOrder: 3,
  },
];

const defaultBlogs = [
  {
    slug: 'myths-about-professional-cleaning-services',
    title: 'Myths About Professional Cleaning Services Debunked!',
    excerpt: 'Common cleaning misconceptions and what actually works.',
    coverImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=900&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=1800&q=80',
    content: 'Detailed blog content here.',
    tags: ['Power Tools'],
  },
];

export const ensureDefaults = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cetro.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Site Admin';

  const user = await AdminUser.findOne({ email: adminEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(adminPass, 12);
    await AdminUser.create({ email: adminEmail, passwordHash, name: adminName });
  }

  const settings = await SiteSettings.findOne({ key: 'global' });
  if (!settings) await SiteSettings.create({ key: 'global' });

  for (const page of defaultPages) {
    await PageContent.updateOne({ pageKey: page.pageKey }, { $setOnInsert: page }, { upsert: true });
  }

  for (const service of defaultServices) {
    await Service.updateOne({ slug: service.slug }, { $setOnInsert: service }, { upsert: true });
  }

  for (const post of defaultBlogs) {
    await BlogPost.updateOne({ slug: post.slug }, { $setOnInsert: post }, { upsert: true });
  }
};
