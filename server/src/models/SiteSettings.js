import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    siteName: { type: String, default: 'Cetro Cleaning' },
    theme: {
      primary: { type: String, default: '#00A859' },
      dark: { type: String, default: '#1f2c3c' },
      lightBg: { type: String, default: '#f2f2ee' },
      text: { type: String, default: '#1a1a1a' },
    },
    contact: {
      phone: { type: String, default: '(+480) 123 678 900' },
      email: { type: String, default: 'hello@cetro.com' },
      address: { type: String, default: '1234 Clean Street, Chicago, IL 60601' },
    },
    newsletter: {
      title: { type: String, default: 'Join Our Newsletter' },
      subtitle: { type: String, default: 'Stay Up To Date' },
      enabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
