import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import AdminUser from '../models/AdminUser.js';
import ContactSubmission from '../models/ContactSubmission.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import BlogMessage from '../models/BlogMessage.js';
import { emitAdminBlogMessage, emitPublicBlogMessage } from '../config/socket.js';
import HowItWorksCard from '../models/HowItWorksCard.js';
import FaqItem from '../models/FaqItem.js';
import AuditLog from '../models/AuditLog.js';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toArray = (value) => {
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const safeRole = (value) => (value === 'main_admin' ? 'main_admin' : 'sub_admin');

const logAudit = async (req, action, entity, entityId = '', details = {}) => {
  if (!req?.user?._id) return;
  await AuditLog.create({
    adminId: req.user._id,
    adminName: req.user.name,
    adminEmail: req.user.email,
    adminRole: safeRole(req.user.role),
    action,
    entity,
    entityId: entityId ? String(entityId) : '',
    details,
  });
};

const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `${field} already exists.` });
    }
    if (error?.name === 'ValidationError') {
      const first = Object.values(error.errors || {})[0];
      return res.status(400).json({ message: first?.message || 'Validation failed.' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [contacts, bookings, blogs, blogMessages, services, howItWorks, faqs, adminUsers, auditLogs, notifications, unreadNotifications] = await Promise.all([
    ContactSubmission.countDocuments(),
    Booking.countDocuments(),
    BlogPost.countDocuments(),
    BlogMessage.countDocuments(),
    Service.countDocuments(),
    HowItWorksCard.countDocuments(),
    FaqItem.countDocuments(),
    AdminUser.countDocuments(),
    AuditLog.countDocuments(),
    Notification.countDocuments(),
    Notification.countDocuments({ isRead: false }),
  ]);

  const latestContacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean();
  const latestBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).lean();

  res.json({
    totals: { contacts, bookings, blogs, blogMessages, services, howItWorks, faqs, adminUsers, auditLogs, notifications, unreadNotifications },
    latestContacts,
    latestBookings,
  });
});

export const getNotifications = asyncHandler(async (_req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  ).lean();
  if (!notification) return res.status(404).json({ message: 'Notification not found.' });
  res.json(notification);
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: 'global' }).lean();
  res.json(settings);
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'global' }, req.body, {
    new: true,
    upsert: true,
  }).lean();
  await logAudit(req, 'update', 'site_settings', settings?._id, {
    changedKeys: Object.keys(req.body || {}),
  });
  res.json(settings);
});

export const getAllPages = asyncHandler(async (_req, res) => {
  const pages = await PageContent.find().sort({ pageKey: 1 }).lean();
  res.json(pages);
});

export const updatePage = asyncHandler(async (req, res) => {
  const page = await PageContent.findOneAndUpdate({ pageKey: req.params.pageKey }, req.body, {
    new: true,
    upsert: true,
  }).lean();
  await logAudit(req, 'update', 'page', page?._id, { pageKey: req.params.pageKey });
  res.json(page);
});

export const listServicesAdmin = asyncHandler(async (_req, res) => {
  const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(services);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  await logAudit(req, 'create', 'service', service?._id, { title: service?.title, slug: service?.slug });
  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  await logAudit(req, 'update', 'service', service?._id, { title: service?.title, slug: service?.slug });
  res.json(service);
});

export const deleteService = asyncHandler(async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Service not found.' });
  await logAudit(req, 'delete', 'service', deleted?._id, { title: deleted?.title, slug: deleted?.slug });
  res.json({ success: true });
});

export const listBlogsAdmin = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find().sort({ publishedAt: -1, createdAt: -1 }).lean();
  res.json(posts);
});

export const createBlog = asyncHandler(async (req, res) => {
  const title = (req.body?.title || '').trim();
  if (!title) return res.status(400).json({ message: 'Blog title is required.' });

  const requestedSlug = (req.body?.slug || '').trim();
  const baseSlug = slugify(requestedSlug || title);
  if (!baseSlug) return res.status(400).json({ message: 'Valid slug or title is required.' });

  const exists = await BlogPost.exists({ slug: baseSlug });
  if (exists) return res.status(400).json({ message: 'Slug already exists. Use a different slug.' });

  const payload = {
    ...req.body,
    title,
    slug: baseSlug,
    tags: toArray(req.body?.tags),
    popularTags: toArray(req.body?.popularTags),
    galleryImages: toArray(req.body?.galleryImages),
    readMinutes: Number(req.body?.readMinutes || 5),
  };

  const post = await BlogPost.create(payload);
  await logAudit(req, 'create', 'blog', post?._id, { title: post?.title, slug: post?.slug });
  res.status(201).json(post);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const title = req.body?.title ? String(req.body.title).trim() : undefined;
  const requestedSlug = req.body?.slug ? String(req.body.slug).trim() : undefined;
  const update = { ...req.body };

  if (title !== undefined) {
    if (!title) return res.status(400).json({ message: 'Blog title cannot be empty.' });
    update.title = title;
  }

  if (requestedSlug !== undefined || title !== undefined) {
    const nextSlug = slugify(requestedSlug || title || '');
    if (!nextSlug) return res.status(400).json({ message: 'Valid slug is required.' });

    const collision = await BlogPost.exists({
      _id: { $ne: req.params.id },
      slug: nextSlug,
    });
    if (collision) return res.status(400).json({ message: 'Slug already exists. Use a different slug.' });

    update.slug = nextSlug;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'tags')) update.tags = toArray(req.body.tags);
  if (Object.prototype.hasOwnProperty.call(req.body, 'popularTags')) update.popularTags = toArray(req.body.popularTags);
  if (Object.prototype.hasOwnProperty.call(req.body, 'galleryImages')) update.galleryImages = toArray(req.body.galleryImages);
  if (Object.prototype.hasOwnProperty.call(req.body, 'readMinutes')) update.readMinutes = Number(req.body.readMinutes || 5);

  const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!post) return res.status(404).json({ message: 'Blog not found.' });
  await logAudit(req, 'update', 'blog', post?._id, { title: post?.title, slug: post?.slug });
  res.json(post);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Blog not found.' });
  await logAudit(req, 'delete', 'blog', deleted?._id, { title: deleted?.title, slug: deleted?.slug });
  res.json({ success: true });
});

export const listContactsAdmin = asyncHandler(async (_req, res) => {
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  res.json(submissions);
});

export const listBookingsAdmin = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  res.json(bookings);
});

export const listHowItWorksAdmin = asyncHandler(async (_req, res) => {
  const rows = await HowItWorksCard.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json(rows);
});

export const createHowItWorksAdmin = asyncHandler(async (req, res) => {
  const row = await HowItWorksCard.create(req.body);
  await logAudit(req, 'create', 'how_it_works', row?._id, { title: row?.title });
  res.status(201).json(row);
});

export const updateHowItWorksAdmin = asyncHandler(async (req, res) => {
  const row = await HowItWorksCard.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!row) return res.status(404).json({ message: 'How it works card not found.' });
  await logAudit(req, 'update', 'how_it_works', row?._id, { title: row?.title });
  res.json(row);
});

export const deleteHowItWorksAdmin = asyncHandler(async (req, res) => {
  const row = await HowItWorksCard.findByIdAndDelete(req.params.id).lean();
  if (!row) return res.status(404).json({ message: 'How it works card not found.' });
  await logAudit(req, 'delete', 'how_it_works', row?._id, { title: row?.title });
  res.json({ success: true });
});

export const listFaqsAdmin = asyncHandler(async (req, res) => {
  const pageKey = req.query.pageKey ? String(req.query.pageKey) : undefined;
  const query = pageKey ? { pageKey } : {};
  const rows = await FaqItem.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json(rows);
});

export const createFaqAdmin = asyncHandler(async (req, res) => {
  const row = await FaqItem.create(req.body);
  await logAudit(req, 'create', 'faq', row?._id, { pageKey: row?.pageKey });
  res.status(201).json(row);
});

export const updateFaqAdmin = asyncHandler(async (req, res) => {
  const row = await FaqItem.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!row) return res.status(404).json({ message: 'FAQ not found.' });
  await logAudit(req, 'update', 'faq', row?._id, { pageKey: row?.pageKey });
  res.json(row);
});

export const deleteFaqAdmin = asyncHandler(async (req, res) => {
  const row = await FaqItem.findByIdAndDelete(req.params.id).lean();
  if (!row) return res.status(404).json({ message: 'FAQ not found.' });
  await logAudit(req, 'delete', 'faq', row?._id, { pageKey: row?.pageKey });
  res.json({ success: true });
});

export const getCloudinarySignature = asyncHandler(async (_req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(400).json({ message: 'Cloudinary env vars are missing.' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || 'cetro';
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  res.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
});

export const listBlogMessagesAdmin = asyncHandler(async (_req, res) => {
  const rows = await BlogMessage.find()
    .sort({ createdAt: -1 })
    .populate('blogPostId', 'title slug')
    .lean();
  res.json(rows);
});

export const updateBlogMessageAdmin = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const update = {};
  if (status) update.status = status;

  const row = await BlogMessage.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate('blogPostId', 'title slug')
    .lean();
  if (!row) return res.status(404).json({ message: 'Blog message not found.' });
  await logAudit(req, 'update', 'blog_message', row?._id, { status: row?.status });

  emitAdminBlogMessage({ type: 'blog-message-updated', message: row });
  if (row.blogPostId?.slug) emitPublicBlogMessage(row.blogPostId.slug, { type: 'blog-message-updated', message: row });

  res.json(row);
});

export const replyBlogMessageAdmin = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Reply message is required.' });

  const parent = await BlogMessage.findById(req.params.id).populate('blogPostId', 'title slug').lean();
  if (!parent) return res.status(404).json({ message: 'Parent blog message not found.' });

  const reply = await BlogMessage.create({
    blogPostId: parent.blogPostId._id,
    parentMessageId: parent._id,
    name: 'Admin',
    email: 'admin@cetro.com',
    website: '',
    message,
    isAdminReply: true,
    status: 'approved',
  });

  const payload = {
    _id: reply._id,
    blogPostId: reply.blogPostId,
    parentMessageId: reply.parentMessageId,
    name: reply.name,
    email: reply.email,
    website: reply.website,
    message: reply.message,
    isAdminReply: reply.isAdminReply,
    status: reply.status,
    createdAt: reply.createdAt,
    blogSlug: parent.blogPostId.slug,
    blogTitle: parent.blogPostId.title,
  };

  await logAudit(req, 'reply', 'blog_message', payload?._id, { parentMessageId: parent._id, blogSlug: parent.blogPostId.slug });

  emitAdminBlogMessage({ type: 'blog-message-reply', message: payload });
  emitPublicBlogMessage(parent.blogPostId.slug, { type: 'blog-message-reply', message: payload });

  res.status(201).json(payload);
});

export const listAdminUsers = asyncHandler(async (_req, res) => {
  const users = await AdminUser.find().select('_id name email role createdAt updatedAt').sort({ createdAt: -1 }).lean();
  res.json(users);
});

export const createSubAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'sub_admin' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const exists = await AdminUser.exists({ email: String(email).toLowerCase() });
  if (exists) return res.status(400).json({ message: 'Email already exists.' });

  const passwordHash = await bcrypt.hash(String(password), 12);
  const user = await AdminUser.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    passwordHash,
    role: safeRole(role),
  });

  await logAudit(req, 'create', 'admin_user', user?._id, { name: user?.name, email: user?.email, role: user?.role });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

export const listAuditLogs = asyncHandler(async (_req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(300).lean();
  res.json(logs);
});
