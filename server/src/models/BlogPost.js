import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('BlogPost', blogPostSchema);
