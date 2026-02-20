import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Power Tools' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    authorRole: { type: String, default: 'Admin' },
    readMinutes: { type: Number, default: 5 },
    tags: { type: [String], default: [] },
    popularTags: { type: [String], default: [] },
    galleryImages: { type: [String], default: [] },
    quoteText: { type: String, default: '' },
    quoteAuthor: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('BlogPost', blogPostSchema);
