import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Residential', trim: true },
    excerpt: { type: String, default: '', trim: true },
    coverImage: { type: String, default: '', trim: true },
    bannerImage: { type: String, default: '', trim: true },
    completionDate: { type: String, default: '', trim: true },
    clients: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    projectCategory: { type: String, default: '', trim: true },
    overviewTitle: { type: String, default: 'Project Overview', trim: true },
    overviewText: { type: String, default: '', trim: true },
    galleryImages: { type: [String], default: [] },
    benefitsTitle: { type: String, default: 'Project Benefits', trim: true },
    benefitsText: { type: String, default: '', trim: true },
    benefitPoints: { type: [String], default: [] },
    reviewTitle: { type: String, default: 'Customer Reviews', trim: true },
    reviewQuote: { type: String, default: '', trim: true },
    reviewAuthor: { type: String, default: '', trim: true },
    previousProjectText: { type: String, default: 'Solar Panel Cleaning', trim: true },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
