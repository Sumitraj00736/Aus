import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDb } from './config/db.js';
import { setSocket } from './config/socket.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { ensureDefaults } from './seed/defaults.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
});

setSocket(io);

io.on('connection', (socket) => {
  socket.emit('connected', { id: socket.id, message: 'Socket connected' });
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sumitraj00736_db_user:sumitraj00736@cluster0.zqncxn5.mongodb.net/?appName=Cluster0';

const bootstrap = async () => {
  await connectDb(mongoUri);
  await ensureDefaults();

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});
