import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import { signToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = signToken({ sub: user.id, role: user.role });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const me = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
