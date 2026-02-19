import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('PageContent', pageContentSchema);
