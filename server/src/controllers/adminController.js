import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import ContactSubmission from '../models/ContactSubmission.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [contacts, bookings, blogs, services, notifications, unreadNotifications] = await Promise.all([
    ContactSubmission.countDocuments(),
    Booking.countDocuments(),
    BlogPost.countDocuments(),
    Service.countDocuments(),
    Notification.countDocuments(),
    Notification.countDocuments({ isRead: false }),
  ]);

  const latestContacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean();
  const latestBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).lean();

  res.json({
    totals: { contacts, bookings, blogs, services, notifications, unreadNotifications },
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
  res.json(page);
});

export const listServicesAdmin = asyncHandler(async (_req, res) => {
  const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(services);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  res.json(service);
});

export const deleteService = asyncHandler(async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Service not found.' });
  res.json({ success: true });
});

export const listBlogsAdmin = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find().sort({ publishedAt: -1, createdAt: -1 }).lean();
  res.json(posts);
});

export const createBlog = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.status(201).json(post);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!post) return res.status(404).json({ message: 'Blog not found.' });
  res.json(post);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Blog not found.' });
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
