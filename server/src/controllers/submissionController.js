import Booking from '../models/Booking.js';
import ContactSubmission from '../models/ContactSubmission.js';
import Notification from '../models/Notification.js';
import { emitNotification } from '../config/socket.js';

const emitAndSaveNotification = async (type, title, message, payload) => {
  const notification = await Notification.create({ type, title, message, payload });
  emitNotification({
    id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    payload: notification.payload,
    createdAt: notification.createdAt,
  });
};

export const submitContact = async (req, res) => {
  const { name, email, phone = '', service = '', message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const submission = await ContactSubmission.create({ name, email, phone, service, message });

  await emitAndSaveNotification(
    'contact',
    'New Contact Submission',
    `${name} submitted contact form`,
    { submissionId: submission._id, name, email, phone, service }
  );

  res.status(201).json({ success: true, submission });
};

export const submitBooking = async (req, res) => {
  const { name, email, phone, serviceSlug, scheduledDate, address, notes = '' } = req.body;

  if (!name || !email || !phone || !serviceSlug || !scheduledDate || !address) {
    return res.status(400).json({ message: 'Required booking fields are missing.' });
  }

  const booking = await Booking.create({
    name,
    email,
    phone,
    serviceSlug,
    scheduledDate,
    address,
    notes,
  });

  await emitAndSaveNotification(
    'booking',
    'New Booking Request',
    `${name} submitted a booking`,
    { bookingId: booking._id, name, email, phone, serviceSlug, scheduledDate }
  );

  res.status(201).json({ success: true, booking });
};
