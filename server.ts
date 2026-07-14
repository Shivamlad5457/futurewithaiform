import './src/backend/config/env-init.js';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/backend/routes/api.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. INPUT LIMITS & PARSING
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true, parameterLimit: 10000 }));

  // 2. SECURITY HEADERS (Helmet-equivalent)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*; connect-src 'self' https://*;"
    );
    next();
  });

  // 3. SECURE IP RATE LIMITING
  const ipRequests = new Map<string, { count: number; firstRequestTime: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
  const MAX_REQUESTS = 60; // Max 60 requests per minute

  app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const rateData = ipRequests.get(ip);

    if (!rateData) {
      ipRequests.set(ip, { count: 1, firstRequestTime: now });
      return next();
    }

    if (now - rateData.firstRequestTime > RATE_LIMIT_WINDOW) {
      // Reset window
      ipRequests.set(ip, { count: 1, firstRequestTime: now });
      return next();
    }

    rateData.count += 1;
    if (rateData.count > MAX_REQUESTS) {
      res.status(429).json({
        error: 'Too many requests from this IP. Please try again after a minute.'
      });
      return;
    }

    next();
  });

  // 4. API ROUTING
  app.use('/api', apiRouter);

  // 5. VITE INTEGRATION / STATIC SERVING
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Creator Collaboration Hub Server Running!`);
    console.log(`🔗 Dev URL: http://localhost:${PORT}`);
    console.log(`📁 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

startServer();
