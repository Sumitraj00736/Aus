import { Router } from 'express';
import { submitBlogMessage, submitBooking, submitContact } from '../controllers/submissionController.js';

const router = Router();

router.post('/contact', submitContact);
router.post('/booking', submitBooking);
router.post('/blog-messages', submitBlogMessage);

export default router;
