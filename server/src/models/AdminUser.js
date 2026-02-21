import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['main_admin', 'sub_admin'], default: 'sub_admin' },
  },
  { timestamps: true }
);

export default mongoose.model('AdminUser', adminUserSchema);
