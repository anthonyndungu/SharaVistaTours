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
    // Store raw body for controller (if needed for signature verification later)
    req.rawBody = req.body;
    try {
      // Parse JSON manually so the controller receives a clean object
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      console.error('MPESA Callback JSON Parse Error:', e);
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid JSON' });
    }
  },
  mpesaCallback
);

router.post('/c2b/validation', 
  express.raw({ type: 'application/json', limit: '1mb' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      console.error('C2B Validation JSON Parse Error:', e);
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid JSON' });
    }
  },
  c2bValidation
);

router.post('/c2b/confirmation', 
  express.raw({ type: 'application/json', limit: '1mb' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
      next();
    } catch (e) {
      console.error('C2B Confirmation JSON Parse Error:', e);
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid JSON' });
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
      console.error('Stripe Webhook JSON Parse Error:', e);
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  },
  stripeWebhook
);

export default router;