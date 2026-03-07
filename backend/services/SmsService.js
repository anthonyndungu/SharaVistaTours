import AfricasTalking from 'africastalking';
import logger from '../utils/logger.js';

class SmsService {
  constructor() {
    this.at = AfricasTalking({
      username: process.env.AT_USERNAME,
      apiKey: process.env.AT_API_KEY
    });
    this.sender = process.env.AT_SENDER_ID || 'AfricaTalking'; // Sandbox default
    this.sms = this.at.SMS;
  }

  /**
   * Send Payment Confirmation SMS
   */
  async sendPaymentConfirmation({ phone, amount, bookingNumber, transId }) {
    const message = bookingNumber
      ? `✅ Payment Received!\nKES ${amount} confirmed for Booking ${bookingNumber}.\nRef: ${transId}\nThank you for choosing Sharavista Tours!`
      : `✅ Payment Received!\nWe received KES ${amount} (Ref: ${transId}).\nWe are matching it to your booking. Contact us if not updated in 10 mins.`;

    return this.sendSMS(phone, message);
  }

  /**
   * Send Unmatched Payment Alert (Requires Manual Review)
   */
  async sendUnmatchedAlert({ phone, amount, transId }) {
    const message = `⚠️ Payment Pending Match\nWe received KES ${amount} (Ref: ${transId}) but couldn't find your booking.\nPlease reply with your Booking ID or call support.`;
    
    return this.sendSMS(phone, message);
  }

  /**
   * Core SMS Sender
   */
  async sendSMS(phone, message) {
    try {
      // Normalize phone number (ensure starts with +254)
      let formattedPhone = phone.replace(/^0/, '+254');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+254${formattedPhone}`;
      }

      logger.info(`📱 Sending SMS to ${formattedPhone}: ${message.substring(0, 50)}...`);

      const result = await this.sms.send({
        to: [formattedPhone],
        message: message,
        from: this.sender
      });

      logger.info('✅ SMS Sent Successfully', result.SMSMessageData.Recipients[0]);
      return { success: true, messageId: result.SMSMessageData.Recipients[0].messageId };

    } catch (error) {
      logger.error('❌ SMS Sending Failed', {
        phone,
        error: error.message,
        response: error.response?.data
      });
      return { success: false, error: error.message };
    }
  }
}

export default new SmsService();