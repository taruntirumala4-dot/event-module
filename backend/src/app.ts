import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './modules/auth/auth.routes';
import eventRoutes from './modules/events/event.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();

// ─── SECURITY ───────────────────────────────────────────────────────────────
app.use(helmet());

const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://eventmodule.netlify.app')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        configuredOrigins.includes('*') ||
        configuredOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.netlify.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ─── LOGGING & PARSING ──────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Event Module API is running', timestamp: new Date().toISOString() });
});

// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 & ERROR HANDLER ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
