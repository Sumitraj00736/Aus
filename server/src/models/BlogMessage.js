import mongoose from 'mongoose';

const blogMessageSchema = new mongoose.Schema(
  {
    blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true, index: true },
    parentMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogMessage', default: null, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, default: '' },
    message: { type: String, required: true },
    isAdminReply: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'spam'], default: 'approved' },
  },
  { timestamps: true }
);

export default mongoose.model('BlogMessage', blogMessageSchema);
