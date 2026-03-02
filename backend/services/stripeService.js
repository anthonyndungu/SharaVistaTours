import Stripe from 'stripe';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use latest stable version
  typescript: true
});

class StripeService {
  // Create Payment Intent for Card Payment
  async createPaymentIntent(amount, currency = 'kes', metadata = {}) {
    try {
      // Stripe requires amount in smallest currency unit (KES cents)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          platform: 'sharavista_tours'
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        capture_method: 'automatic',
        confirm: false
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase()
      };
    } catch (error) {
      logger.error('Stripe PaymentIntent Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  }

  // Confirm Payment Intent (for frontend confirmation)
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      logger.error('Stripe Confirm Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle Stripe Webhook
  async handleWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      const { Payment, Booking } = await import('../models/index.js');
      const { sequelize } = await import('../models/index.js');

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          
          // Update payment record
          await sequelize.transaction(async (t) => {
            const payment = await Payment.findOne({
              where: { transaction_id: paymentIntent.id },
              transaction: t
            });

            if (payment) {
              await payment.update({
                status: 'completed',
                mpesa_result_desc: `Stripe: ${paymentIntent.status}`
              }, { transaction: t });

              if (payment.Booking) {
                await payment.Booking.update({
                  payment_status: 'paid',
                  status: 'confirmed'
                }, { transaction: t });
              }
            }
          });
          
          logger.info(`Stripe payment succeeded: ${paymentIntent.id}`);
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object;
          logger.warn(`Stripe payment failed: ${failedIntent.id} - ${failedIntent.last_payment_error?.message}`);
          break;

        case 'charge.refunded':
          // Handle refunds if needed
          break;

        default:
          logger.info(`Unhandled Stripe event type: ${event.type}`);
      }

      return { success: true, eventId: event.id };
    } catch (error) {
      logger.error('Stripe Webhook Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Process Refund via Stripe
  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100
      };
    } catch (error) {
      logger.error('Stripe Refund Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new StripeService();