import { Router } from 'express';
import { submitBooking, submitContact } from '../controllers/submissionController.js';

const router = Router();

router.post('/contact', submitContact);
router.post('/booking', submitBooking);

export default router;
