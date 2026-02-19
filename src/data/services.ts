export type ServiceItem = {
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: string;
  cardImage: string;
  detailImage: string;
  detailIntro: string;
  detailBody: string;
};

export const services: ServiceItem[] = [
  {
    slug: 'construction-cleaning',
    title: 'Construction Cleaning',
    shortDescription:
      'We understand the importance of maintaining a clean and professional environment for your business.',
    heroImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
    detailImage: 'https://t4.ftcdn.net/jpg/02/71/38/99/360_F_271389908_TeU2XysWbT1Lxlbum9IeLf9U4sH6Pz5j.jpg',
    detailIntro:
      'Construction cleanup requires precision, safety awareness, and a strong eye for detail. Our crews remove dust, debris, and residue from every corner so your property is ready to use immediately.',
    detailBody:
      'From post-renovation apartments to large commercial build-outs, we provide full-scope cleaning with trained professionals and quality control checklists.',
  },
  {
    slug: 'move-in-out-cleaning',
    title: 'Move In Out Cleaning',
    shortDescription:
      'The housekeepers we hired are professionals who take pride in doing excellent work and in exceeding expectations.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1400&q=80',
    detailIntro:
      'Moving can be stressful, so we make the cleaning part effortless. We deep-clean kitchens, bathrooms, floors, baseboards, and high-touch surfaces.',
    detailBody:
      'Our move-in/out packages are designed for tenants, landlords, and property managers who need a spotless handover every time.',
  },
  {
    slug: 'regular-home-cleaning',
    title: 'Regular Home Cleaning',
    shortDescription:
      'Our house cleaning services are designed to keep your home tidy and healthy, from dusting to sanitizing.',
    heroImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1400&q=80',
    detailIntro:
      'A clean home is essential for comfort and wellbeing. Our recurring service keeps each room fresh with consistent, high-quality care.',
    detailBody:
      'Choose weekly, bi-weekly, or custom schedules with flexible plans that adapt to your routine and household priorities.',
  },
  {
    slug: 'specialized-cleaning',
    title: 'Specialized Cleaning',
    shortDescription:
      'Targeted cleaning solutions for unique environments, sensitive areas, and high-standard requirements.',
    heroImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=1400&q=80',
    detailIntro:
      'Our specialized service addresses spaces that need more than routine cleaning. We use tailored methods and task-specific equipment.',
    detailBody:
      'Ideal for clinics, studios, post-event cleanup, and premium residential spaces requiring strict standards.',
  },
  {
    slug: 'skilled-cleaning',
    title: 'Skilled Cleaning',
    shortDescription:
      'For homes that need more than a surface clean, our team delivers thorough and detailed care.',
    heroImage: 'https://images.unsplash.com/photo-1711963475652-f351307374f7?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1711963475652-f351307374f7?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1400&q=80',
    detailIntro:
      'Skilled cleaning is built around craftsmanship and consistency. We focus on overlooked details to elevate everyday hygiene.',
    detailBody:
      'Our trained crew follows a quality-first workflow and performs final checks before completion.',
  },
  {
    slug: 'residential-services',
    title: 'Residential Services',
    shortDescription:
      'Complete home-care cleaning plans crafted for busy families, apartments, and houses of every size.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2000&q=80',
    cardImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=80',
    detailIntro:
      'Our residential team keeps your home spotless while respecting your schedule and preferences.',
    detailBody:
      'We combine safe products, thoughtful planning, and reliable execution to deliver a fresh, healthy space for everyday living.',
  },
];

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
