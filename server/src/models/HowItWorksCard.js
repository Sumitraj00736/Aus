import mongoose from 'mongoose';

const howItWorksCardSchema = new mongoose.Schema(
  {
    step: { type: String, default: '' },
    title: { type: String, required: true },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('HowItWorksCard', howItWorksCardSchema);
