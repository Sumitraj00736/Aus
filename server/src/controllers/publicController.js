import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import BlogMessage from '../models/BlogMessage.js';
import HowItWorksCard from '../models/HowItWorksCard.js';
import FaqItem from '../models/FaqItem.js';

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

export const getBlogMessagesBySlug = async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!post) return res.status(404).json({ message: 'Blog post not found.' });

  const messages = await BlogMessage.find({
    blogPostId: post._id,
    status: 'approved',
  })
    .sort({ createdAt: 1 })
    .lean();

  const mapped = messages.map((row) => ({ ...row, replies: [] }));
  const byId = new Map(mapped.map((row) => [String(row._id), row]));
  const roots = [];

  for (const row of mapped) {
    if (row.parentMessageId) {
      const parent = byId.get(String(row.parentMessageId));
      if (parent) {
        parent.replies.push(row);
      } else {
        roots.push(row);
      }
    } else {
      roots.push(row);
    }
  }

  res.json(roots);
};

export const getHowItWorksCards = async (_req, res) => {
  const rows = await HowItWorksCard.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json(rows);
};

export const getFaqs = async (req, res) => {
  const pageKey = req.query.pageKey ? String(req.query.pageKey) : 'home';
  const rows = await FaqItem.find({ pageKey, isPublished: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json(rows);
};
