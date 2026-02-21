import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import HowItWorksCard from '../models/HowItWorksCard.js';
import FaqItem from '../models/FaqItem.js';

const defaultPages = [
  {
    pageKey: 'home',
    title: 'Home',
    subtitle: 'Professional cleaning services for homes and businesses.',
    bannerImage: '',
    sections: {
      whyChooseUs: {
        eyebrow: 'Why Choosing Us',
        title: 'We Make Your Home Sparkle And Shine',
        description:
          'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=80',
        bullets: [
          { title: '100% Satisfaction', description: 'Guaranteed high-quality cleaning outcomes with strict quality checks.', iconImage: '' },
          { title: 'Eco-Friendly Cleaning Products', description: 'Safe and non-toxic products for family, pets, and environment.', iconImage: '' },
          { title: 'Trusted Professionals', description: 'Experienced cleaners trained for residential and commercial spaces.', iconImage: '' },
          { title: 'Flexible Scheduling', description: 'Daily, weekly, and custom plans based on your routine and needs.', iconImage: '' },
          { title: 'Transparent Pricing', description: 'No hidden costs, clear estimates, and predictable billing.', iconImage: '' },
          { title: 'Fast Support', description: 'Quick response team for bookings, updates, and issue resolution.', iconImage: '' },
        ],
      },
    },
  },
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
    aboutImages: [
      'https://images.unsplash.com/photo-1621905252472-e8f3f8f7386f?w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&q=80',
    ],
    aboutSectionDescription:
      'Our residential cleaning services cover every corner of your home, ensuring that no detail is overlooked.',
    aboutBullets: [
      { title: 'Deep Cleaning Solutions', description: 'Choose a time that works for you, whether you need weekly upkeep or one-time deep clean.', iconImage: '' },
      { title: 'Comprehensive Cleaning', description: 'We use safe, non-toxic products that protect your family, pets, and the environment.', iconImage: '' },
      { title: 'Eco-Friendly Products', description: 'Certified products that protect your home and improve indoor air quality.', iconImage: '' },
      { title: 'Flexible Scheduling', description: 'Book one-time sessions or recurring plans based on your lifestyle.', iconImage: '' },
    ],
    helpCard: {
      title: 'Do You Need Help?',
      phone: '+(084) 456-0789',
      email: 'support@example.com',
      image: 'https://images.unsplash.com/photo-1674995752255-2f8c0b7e1233?w=800&q=80',
    },
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
    aboutImages: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&q=80',
    ],
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
    aboutImages: [
      'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&q=80',
    ],
    detailIntro: 'Flexible recurring schedules and reliable care for all home sizes.',
    detailBody: 'Weekly and bi-weekly plans designed around your routine.',
    sortOrder: 3,
  },
];

const defaultHowItWorks = [
  {
    step: '01',
    title: 'Provide The Details',
    text: 'Fill out a quick form with details about your space, schedule, and preferences.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=700&q=80',
    sortOrder: 1,
  },
  {
    step: '02',
    title: 'Pick A Suitable Plan',
    text: 'We will send you a personalized estimate, no hidden fees, no upselling.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80',
    sortOrder: 2,
  },
  {
    step: '03',
    title: 'We House Cleaned',
    text: 'Our team arrives on time, equipped, and ready to clean thoroughly.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=80',
    sortOrder: 3,
  },
  {
    step: '04',
    title: 'You Enjoy & Relax',
    text: 'Enjoy a spotless home or workspace that looks, feels, and smells truly clean.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80',
    sortOrder: 4,
  },
];

const defaultFaqs = [
  {
    pageKey: 'home',
    question: 'What types of spaces do you clean?',
    answer: 'We offer cleaning for homes, offices, retail spaces, and post-renovation sites.',
    sortOrder: 1,
  },
  {
    pageKey: 'home',
    question: 'Are your cleaning products eco-friendly?',
    answer: 'Yes. We use eco-conscious and non-toxic products that are safe for families and pets.',
    sortOrder: 2,
  },
  {
    pageKey: 'home',
    question: 'How do I book a cleaning session?',
    answer: 'You can call us, request a quote, or submit the booking form on the website.',
    sortOrder: 3,
  },
  {
    pageKey: 'service',
    question: 'Do I need to be home during service?',
    answer: 'Not necessarily. Many clients provide secure access instructions in advance.',
    sortOrder: 1,
  },
];

const defaultBlogs = [
  {
    slug: 'how-often-should-you-really-clean-these-7-overlooked-areas',
    title: 'How Often Should You Really Clean These 7 Overlooked Areas?',
    category: 'Power Tools',
    excerpt: 'Maintaining a clean and organized home can feel like a daunting task, but with the right strategies, it becomes much more manageable.',
    coverImage: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=2200&q=80',
    content:
      'Maintaining a clean and organized home can feel like a daunting task, but with the right strategies, it becomes much more manageable.\n\nCreate a cleaning schedule and tackle one zone at a time. Focus on overlooked high-touch surfaces, vents, and soft furnishings for healthier indoor air quality.',
    contentHtml:
      '<h2>Create a Cleaning Schedule</h2><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentially life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.</p><h2>Exploring Design Styles</h2><p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable.</p><blockquote>A massage is just like a movie, really relaxing and a total escape, except in a massage you are the star. And you do not miss anything by falling asleep!</blockquote><h2>Protecting Your Pet&apos;s Favorite Spots</h2><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.</p>',
    galleryImages: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1200&q=80',
    ],
    quoteText:
      'A massage is just like a movie, really relaxing and a total escape, except in a massage you are the star. And you do not miss anything by falling asleep!',
    quoteAuthor: 'Dishes Cleaning',
    tags: ['Furniture', 'Interior', 'Living Room'],
    popularTags: ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'],
  },
  {
    slug: 'myths-about-professional-cleaning-services-debunked',
    title: 'Myths About Professional Cleaning Services Debunked!',
    category: 'Ware Accessories',
    excerpt: 'Common cleaning misconceptions and what actually works.',
    coverImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=900&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=1800&q=80',
    content: 'The most common myths and practical facts.',
    tags: ['Ware Accessories'],
    popularTags: ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'],
  },
  {
    slug: 'how-to-choose-the-right-cleaning-service-for-your-home',
    title: 'How to Choose the Right Cleaning Service for Your Home',
    category: 'Power Tools',
    excerpt: 'What to check before you hire any cleaning team.',
    coverImage: 'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=900&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1800&q=80',
    content: 'Selection framework and checklist.',
    tags: ['Power Tools'],
    popularTags: ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'],
  },
  {
    slug: 'moving-out-heres-why-you-need-a-move-out-cleaning-service',
    title: 'Moving Out? Here’s Why You Need a Move-Out Cleaning Service',
    category: 'Power Tools',
    excerpt: 'Move-out cleaning essentials that save deposit issues.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80',
    content: 'Move-out cleaning essentials.',
    tags: ['Power Tools'],
    popularTags: ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'],
  },
  {
    slug: 'is-a-weekly-or-biweekly-cleaning-service-right-for-you',
    title: 'Is a Weekly or Biweekly Cleaning Service Right for You?',
    category: 'Home Appliance',
    excerpt: 'Which cleaning schedule works best for your routine.',
    coverImage: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=900&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=1800&q=80',
    content: 'Compare weekly and biweekly cleaning plans.',
    tags: ['Home Appliance'],
    popularTags: ['Architecture', 'Building', 'Construction', 'Design', 'Furniture', 'Interior', 'Kitchen', 'Living Room', 'Planning'],
  },
];

export const ensureDefaults = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cetro.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Site Admin';

  const user = await AdminUser.findOne({ email: adminEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(adminPass, 12);
    await AdminUser.create({ email: adminEmail, passwordHash, name: adminName, role: 'main_admin' });
  } else if (user.role !== 'main_admin') {
    await AdminUser.updateOne({ _id: user._id }, { $set: { role: 'main_admin' } });
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

  for (const card of defaultHowItWorks) {
    await HowItWorksCard.updateOne({ title: card.title }, { $setOnInsert: card }, { upsert: true });
  }

  for (const faq of defaultFaqs) {
    await FaqItem.updateOne({ pageKey: faq.pageKey, question: faq.question }, { $setOnInsert: faq }, { upsert: true });
  }
};
