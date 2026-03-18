// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import { sequelize } from './models/index.js';
// import routes from './routes/index.js';
// import errorHandler from './middleware/errorHandler.js';
// import logger from './utils/logger.js';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import paymentWebhooks from './routes/paymentWebhooks.js'; // Public webhooks
// import { c2bConfirmation, c2bValidation, mpesaCallback } from './controllers/paymentController.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // ===========================
// // Security Middleware (First!)
// // ===========================
// app.use(helmet({
//   // Customize helmet config if needed
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", "https://api.safaricom.co.ke", "https://sandbox.safaricom.co.ke", "https://api.stripe.com"],
//       // Add other directives as needed
//     }
//   }
// }));

// // ===========================
// // Rate Limiting (Relaxed in Dev)
// // ===========================
// const generalLimiter = rateLimit({
//   windowMs: process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000,
//   max: process.env.NODE_ENV === 'development' ? 1000 : 100,
//   message: { status: 'fail', message: 'Too many requests from this IP, please try again later.' },
//   standardHeaders: true,
//   legacyHeaders: false,
//   // Skip rate limiting for webhooks and health checks
//   skip: (req) => req.path.includes('/payments/mpesa/callback') ||
//     req.path.includes('/payments/stripe/webhook') ||
//     req.path.includes('/payments/mpesa/c2b') ||
//     req.path.includes('/health')
// });

// app.use('/api/', generalLimiter);

// // ===========================
// // CORS Configuration
// // ===========================
// app.use(cors({
//   origin: process.env.CLIENT_URL?.split(',') || 'https://tours.mogulafric.com',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
//   maxAge: 86400 // 24 hours
// }));

// // Handle preflight OPTIONS requests immediately
// app.options('*', cors());

// // Prevent connection drops on rapid requests
// app.use((req, res, next) => {
//   // Set keep-alive and cache headers
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('Keep-Alive', 'timeout=65, max=100');
//   next();
// });

// //for stripe webhook and mpesa callbacks
// app.use('/api/v1/payments', paymentWebhooks);


// // ===========================
// // Body Parsers (After webhooks)
// // ===========================
// app.use(express.json({
//   limit: '10mb',
//   verify: (req, res, buf) => {
//     // Store raw body for any routes that need it (fallback)
//     if (req.path.includes('/payments')) {
//       req.rawBody = buf;
//     }
//   }
// }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ===========================
// // Static Files & Logging
// // ===========================
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//   maxAge: '1d', // Cache static files
//   setHeaders: (res, path) => {
//     if (path.endsWith('.pdf')) {
//       res.setHeader('Content-Disposition', 'inline');
//     }
//   }
// }));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Request logging (structured)
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     logger.info('Request completed', {
//       method: req.method,
//       path: req.path,
//       status: res.statusCode,
//       duration: `${duration}ms`,
//       ip: req.ip,
//       userId: req.user?.id
//     });
//   });
//   next();
// });

// // ===========================
// // API Routes (Protected)
// // ===========================
// app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// // ===========================
// // Health & Info Endpoints
// // ===========================
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//     uptime: process.uptime(),
//     database: sequelize.config.database
//   });
// });

// app.get('/health/db', async (req, res) => {
//   try {
//     await sequelize.authenticate();
//     res.status(200).json({ status: 'OK', database: 'connected' });
//   } catch (error) {
//     res.status(503).json({ status: 'ERROR', database: 'disconnected', error: error.message });
//   }
// });

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Welcome to Sharavista Tours & Travel API',
//     version: process.env.API_VERSION || 'v1',
//     documentation: `${req.protocol}://${req.get('host')}/api/${process.env.API_VERSION || 'v1'}/docs`,
//     endpoints: {
//       payments: `/api/v1/payments`,
//       health: '/health'
//     }
//   });
// });

// // ===========================
// // 404 Handler
// // ===========================
// app.all('*', (req, res, next) => {
//   const error = new Error(`Route ${req.originalUrl} not found`);
//   error.statusCode = 404;
//   error.isOperational = true;
//   next(error);
// });

// // ===========================
// // Error Handling (Last!)
// // ===========================
// app.use(errorHandler);

// // ===========================
// // Server Startup
// // ===========================
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     // ===========================
//     // Global Error Handlers (Before Server Start!)
//     // ===========================
//     // Handle unhandled promise rejections
//     process.on('unhandledRejection', (reason, promise) => {
//       logger.error('❌ UNHANDLED REJECTION', {
//         reason: reason?.message || reason,
//         stack: reason?.stack,
//         promise: promise
//       });
//       // Optionally exit after logging
//       // process.exit(1);
//     });

//     // Handle uncaught exceptions
//     process.on('uncaughtException', (error) => {
//       logger.error('❌ UNCAUGHT EXCEPTION', {
//         message: error.message,
//         stack: error.stack
//       });
//       // Force shutdown on uncaught exception
//       process.exit(1);
//     });

//     // Handle warnings
//     process.on('warning', (warning) => {
//       logger.warn('⚠️ WARNING', {
//         name: warning.name,
//         message: warning.message,
//         stack: warning.stack
//       });
//     });

//     // Test database connection
//     await sequelize.authenticate();
//     logger.info('✅ Database connection established');

//     // Sync database (development only - use migrations in production)
//     if (process.env.NODE_ENV === 'development') {
//       await sequelize.sync({ alter: true });
//       logger.info('✅ Database synchronized (alter mode - development only)');
//     }

//     // Database pool error handling is managed by global error handlers

//     // Monitor database pool status (development only)
//     if (process.env.NODE_ENV === 'development') {
//       setInterval(() => {
//         try {
//           const pool = sequelize.connectionManager?.pool;
//           if (pool) {
//             logger.debug('Database pool status', {
//               totalConnections: pool._clients?.length || pool.size || 0,
//               availableConnections: pool._availableObjects?.length || 0,
//               waitingRequests: pool._waitingClients?.length || 0
//             });
//           }
//         } catch (err) {
//           // Silently fail if pool structure differs
//         }
//       }, 30000); // Every 30 seconds
//       logger.info('✅ Database monitoring enabled');
//     }

//     // Ensure upload directory exists
//     const fs = await import('fs');
//     const uploadPath = process.env.UPLOAD_PATH || './uploads';
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//       logger.info(`✅ Upload directory created: ${uploadPath}`);
//     }

//     // Start HTTP server with keep-alive and timeout settings
//     const server = app.listen(PORT, () => {
//       logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//       logger.info(`📡 API: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
//       logger.info(`🔗 Webhooks: http://localhost:${PORT}/api/v1/payments`);
//     });

//     // Configure server timeouts and keep-alive
//     server.keepAliveTimeout = 65 * 1000; // 65 seconds
//     server.headersTimeout = 66 * 1000; // 66 seconds
//     server.requestTimeout = 120 * 1000; // 2 minutes
//     server.maxHeadersCount = 2000;
//     server.setTimeout(120 * 1000); // 2 minutes

//     // Handle client errors gracefully
//     server.on('clientError', (error, socket) => {
//       if (error.code === 'HPE_HEADER_OVERFLOW') {
//         logger.error('❌ Request header overflow');
//         socket.end('HTTP/1.1 431 Request Header Fields Too Large\r\n\r\n');
//       } else if (error.code === 'ECONNRESET') {
//         logger.debug('ℹ️ Client forcefully closed connection');
//       } else {
//         logger.error('❌ Client error', { code: error.code });
//         socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
//       }
//     });

//     // Add server error handler
//     server.on('error', (error) => {
//       logger.error('❌ SERVER ERROR', {
//         message: error.message,
//         code: error.code,
//         stack: error.stack
//       });
//       if (error.code === 'EADDRINUSE') {
//         logger.error(`⚠️ Port ${PORT} is already in use. Try a different port.`);
//         process.exit(1);
//       }
//     });

//     // Track active connections (for debugging)
//     let activeConnections = 0;
//     server.on('connection', (conn) => {
//       activeConnections++;
//       if (process.env.NODE_ENV === 'development') {
//         logger.debug(`New connection. Active: ${activeConnections}`);
//       }
//       conn.on('close', () => {
//         activeConnections--;
//         if (process.env.NODE_ENV === 'development') {
//           logger.debug(`Connection closed. Active: ${activeConnections}`);
//         }
//       });
//     });

//     // Graceful shutdown handling
//     const gracefulShutdown = async (signal) => {
//       logger.info(`🔄 ${signal} received: starting graceful shutdown`);

//       // Stop accepting new connections
//       server.close(async () => {
//         logger.info('🔌 HTTP server closed');

//         // Close database connections
//         await sequelize.close();
//         logger.info('🗄️ Database connections closed');

//         // Exit process
//         process.exit(0);
//       });

//       // Force exit after timeout if graceful shutdown hangs
//       setTimeout(() => {
//         logger.error('⚠️ Forced shutdown after timeout');
//         process.exit(1);
//       }, 10000);
//     };

//     process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//     process.on('SIGINT', () => gracefulShutdown('SIGINT'));

//   } catch (error) {
//     logger.error('❌ Failed to start server', { error: error.message, stack: error.stack });
//     process.exit(1);
//   }
// };

// startServer();




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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.safaricom.co.ke", "https://sandbox.safaricom.co.ke", "https://api.stripe.com"],
    }
  }
}));

// ===========================
// Rate Limiting (Relaxed in Dev)
// ===========================
const generalLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: { status: 'fail', message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for webhooks and health checks
  skip: (req) => req.path.includes('/payments/mpesa/callback') ||
    req.path.includes('/payments/stripe/webhook') ||
    req.path.includes('/payments/mpesa/c2b') ||
    req.path.includes('/health')
});

app.use('/api/', generalLimiter);

// ===========================
// CORS Configuration
// ===========================
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || 'https://tours.mogulafric.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight OPTIONS requests immediately
app.options('*', cors());

// Prevent connection drops on rapid requests
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=65, max=100');
  next();
});

// ==========================================
// ⚠️ CRITICAL: Mount Webhooks BEFORE Body Parsers
// ==========================================
// This ensures paymentWebhooks.js can use express.raw() exclusively
// without interference from the global express.json() middleware.
app.use('/api/v1/payments', paymentWebhooks);

// ===========================
// Body Parsers (After webhooks)
// ===========================
// ✅ FIXED: Removed 'verify' function to prevent conflicts with webhook raw body parsing.
// This parser now only handles non-webhook routes.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================
// Static Files & Logging
// ===========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
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
    // Global Error Handlers
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ UNHANDLED REJECTION', {
        reason: reason?.message || reason,
        stack: reason?.stack,
        promise: promise
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('❌ UNCAUGHT EXCEPTION', {
        message: error.message,
        stack: error.stack
      });
      process.exit(1);
    });

    process.on('warning', (warning) => {
      logger.warn('⚠️ WARNING', {
        name: warning.name,
        message: warning.message,
        stack: warning.stack
      });
    });

    // Database Connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established');

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

    // Server Timeouts
    server.keepAliveTimeout = 65 * 1000;
    server.headersTimeout = 66 * 1000;
    server.requestTimeout = 120 * 1000;
    server.maxHeadersCount = 2000;
    server.setTimeout(120 * 1000);

    server.on('clientError', (error, socket) => {
      if (error.code === 'HPE_HEADER_OVERFLOW') {
        logger.error('❌ Request header overflow');
        socket.end('HTTP/1.1 431 Request Header Fields Too Large\r\n\r\n');
      } else if (error.code === 'ECONNRESET') {
        logger.debug('ℹ️ Client forcefully closed connection');
      } else {
        logger.error('❌ Client error', { code: error.code });
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      }
    });

    server.on('error', (error) => {
      logger.error('❌ SERVER ERROR', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      if (error.code === 'EADDRINUSE') {
        logger.error(`⚠️ Port ${PORT} is already in use.`);
        process.exit(1);
      }
    });

    // Graceful Shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`🔄 ${signal} received: starting graceful shutdown`);
      server.close(async () => {
        logger.info('🔌 HTTP server closed');
        await sequelize.close();
        logger.info('🗄️ Database connections closed');
        process.exit(0);
      });
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