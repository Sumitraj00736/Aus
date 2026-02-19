import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    service: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('ContactSubmission', contactSubmissionSchema);
