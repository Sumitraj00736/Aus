import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    image: { type: String, default: '' },
    quote: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
