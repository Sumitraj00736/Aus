import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';

export const getSettings = async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: 'global' }).lean();
  res.json(settings);
};

export const getPage = async (req, res) => {
  const page = await PageContent.findOne({ pageKey: req.params.pageKey }).lean();
  if (!page) return res.status(404).json({ message: 'Page content not found.' });
  res.json(page);
};

export const getServices = async (_req, res) => {
  const services = await Service.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(services);
};

export const getServiceBySlug = async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  res.json(service);
};

export const getBlogs = async (_req, res) => {
  const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
  res.json(posts);
};

export const getBlogBySlug = async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!post) return res.status(404).json({ message: 'Blog post not found.' });
  res.json(post);
};
