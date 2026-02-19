import { Router } from 'express';
import {
  getSettings,
  getPage,
  getServices,
  getServiceBySlug,
  getBlogs,
  getBlogBySlug,
} from '../controllers/publicController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/pages/:pageKey', getPage);
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);

export default router;
