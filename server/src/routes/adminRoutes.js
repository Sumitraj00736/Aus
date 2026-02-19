import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getDashboardStats,
  getNotifications,
  markNotificationRead,
  getAdminSettings,
  updateAdminSettings,
  getAllPages,
  updatePage,
  listServicesAdmin,
  createService,
  updateService,
  deleteService,
  listBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  listContactsAdmin,
  listBookingsAdmin,
} from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', getDashboardStats);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

router.get('/pages', getAllPages);
router.put('/pages/:pageKey', updatePage);

router.get('/services', listServicesAdmin);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.get('/blogs', listBlogsAdmin);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/contacts', listContactsAdmin);
router.get('/bookings', listBookingsAdmin);

export default router;
