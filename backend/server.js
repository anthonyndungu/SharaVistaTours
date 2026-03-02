import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { sequelize } from './models/index.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import paymentWebhooks from './routes/paymentWebhooks.js'; // Public webhooks

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===========================
// Security Middleware (First!)
// ===========================
app.use(helmet({
  // Customize helmet config if needed
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.safaricom.co.ke", "https://sandbox.safaricom.co.ke", "https://api.stripe.com"],
      // Add other directives as needed
    }
  }
}));

// ===========================
// Rate Limiting
// ===========================
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { status: 'fail', message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for webhooks (they come from trusted providers)
  skip: (req) => req.path.includes('/payments/mpesa/callback') || 
                  req.path.includes('/payments/stripe/webhook') ||
                  req.path.includes('/payments/mpesa/c2b')
});

app.use('/api/', generalLimiter);

// ===========================
// CORS Configuration
// ===========================
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173', // Support multiple origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'] // Add Stripe header
}));

// ===========================
// ⚠️ CRITICAL: Webhook Routes BEFORE JSON Parser
// ===========================
// Public payment webhooks (MPESA, Stripe) - NO auth, raw body
app.use('/api/v1/payments', paymentWebhooks);

// ===========================
// Body Parsers (After webhooks)
// ===========================
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for any routes that need it (fallback)
    if (req.path.includes('/payments')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================
// Static Files & Logging
// ===========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache static files
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request logging (structured)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id
    });
  });
  next();
});

// ===========================
// API Routes (Protected)
// ===========================
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// ===========================
// Health & Info Endpoints
// ===========================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    database: sequelize.config.database
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', database: 'disconnected', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Sharavista Tours & Travel API',
    version: process.env.API_VERSION || 'v1',
    documentation: `${req.protocol}://${req.get('host')}/api/${process.env.API_VERSION || 'v1'}/docs`,
    endpoints: {
      payments: `/api/v1/payments`,
      health: '/health'
    }
  });
});

// ===========================
// 404 Handler
// ===========================
app.all('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
});

// ===========================
// Error Handling (Last!)
// ===========================
app.use(errorHandler);

// ===========================
// Server Startup
// ===========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established');

    // Sync database (development only - use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synchronized (alter mode - development only)');
    }

    // Ensure upload directory exists
    const fs = await import('fs');
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      logger.info(`✅ Upload directory created: ${uploadPath}`);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
      logger.info(`🔗 Webhooks: http://localhost:${PORT}/api/v1/payments`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      logger.info(`🔄 ${signal} received: starting graceful shutdown`);
      
      // Stop accepting new connections
      server.close(async () => {
        logger.info('🔌 HTTP server closed');
        
        // Close database connections
        await sequelize.close();
        logger.info('🗄️ Database connections closed');
        
        // Exit process
        process.exit(0);
      });

      // Force exit after timeout if graceful shutdown hangs
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();