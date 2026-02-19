import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    cardImage: { type: String, default: '' },
    detailImage: { type: String, default: '' },
    detailIntro: { type: String, default: '' },
    detailBody: { type: String, default: '' },
    features: { type: [String], default: [] },
    checklist: { type: [String], default: [] },
    faqs: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      default: [],
    },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
