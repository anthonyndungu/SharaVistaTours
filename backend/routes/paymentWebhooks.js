// routes/paymentWebhooks.js
import express from 'express';
import {
  mpesaCallback,
  stripeWebhook,
  c2bValidation,
  c2bConfirmation
} from '../controllers/paymentController.js';

const router = express.Router();

// ⚠️ NO AUTH MIDDLEWARE - These are called by external servers

// MPESA Webhooks (raw body required for signature/callback parsing)
router.post('/mpesa/callback', 
  express.raw({ type: 'application/json', limit: '1mb' }), 
  (req, res, next) => {
    // Store raw body for controller, then parse JSON for logging
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      next(e);
    }
  },
  mpesaCallback
);

router.post('/mpesa/c2b/validation', 
  express.raw({ type: 'application/json', limit: '1mb' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      next(e);
    }
  },
  c2bValidation
);

router.post('/mpesa/c2b/confirmation', 
  express.raw({ type: 'application/json', limit: '1mb' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      next(e);
    }
  },
  c2bConfirmation
);

// Stripe Webhook (raw body required for signature verification)
router.post('/stripe/webhook', 
  express.raw({ type: 'application/json', limit: '1mb' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      next(e);
    }
  },
  stripeWebhook
);

export default router;