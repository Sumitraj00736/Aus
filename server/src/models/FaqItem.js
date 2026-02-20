import mongoose from 'mongoose';

const faqItemSchema = new mongoose.Schema(
  {
    pageKey: { type: String, default: 'home', index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('FaqItem', faqItemSchema);
