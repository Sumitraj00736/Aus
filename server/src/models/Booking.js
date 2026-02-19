import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceSlug: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
