import { Router } from 'express';
import {
  getSettings,
  getPage,
  getServices,
  getServiceBySlug,
  getBlogs,
  getBlogBySlug,
  getBlogMessagesBySlug,
  getHowItWorksCards,
  getFaqs,
} from '../controllers/publicController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/pages/:pageKey', getPage);
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/blogs/:slug/messages', getBlogMessagesBySlug);
router.get('/how-it-works', getHowItWorksCards);
router.get('/faqs', getFaqs);

export default router;
