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
  listBlogMessagesAdmin,
  updateBlogMessageAdmin,
  replyBlogMessageAdmin,
  listHowItWorksAdmin,
  createHowItWorksAdmin,
  updateHowItWorksAdmin,
  deleteHowItWorksAdmin,
  listFaqsAdmin,
  createFaqAdmin,
  updateFaqAdmin,
  deleteFaqAdmin,
  getCloudinarySignature,
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
router.get('/blog-messages', listBlogMessagesAdmin);
router.patch('/blog-messages/:id', updateBlogMessageAdmin);
router.post('/blog-messages/:id/reply', replyBlogMessageAdmin);
router.get('/how-it-works', listHowItWorksAdmin);
router.post('/how-it-works', createHowItWorksAdmin);
router.put('/how-it-works/:id', updateHowItWorksAdmin);
router.delete('/how-it-works/:id', deleteHowItWorksAdmin);
router.get('/faqs', listFaqsAdmin);
router.post('/faqs', createFaqAdmin);
router.put('/faqs/:id', updateFaqAdmin);
router.delete('/faqs/:id', deleteFaqAdmin);
router.get('/uploads/cloudinary-signature', getCloudinarySignature);

export default router;
