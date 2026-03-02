import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { Payment, Booking } from '../models/index.js';

dotenv.config();

class MpesaService {
  constructor() {
    this.baseUrl = process.env.MPESA_BASE_URL;
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Generate Access Token (cached for 1 hour)
  async getAccessToken() {
    const now = Date.now();

    // Return cached token if still valid (with 5-min safety buffer)
    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in 1 hour; refresh 5 minutes early
      this.tokenExpiry = now + (3300 * 1000);

      return this.accessToken;
    } catch (error) {
      logger.error('MPESA Token Generation Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Failed to generate MPESA access token: ${error.message}`);
    }
  }

  // Generate Password for STK Push (Base64 of Shortcode+Passkey+Timestamp)
  generatePassword(timestamp) {
    const data = `${this.shortcode}${this.passkey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  // Generate Timestamp (YYYYMMDDHHmmss)
  generateTimestamp() {
    const now = new Date();
    return now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
  }

  // Format Phone Number to 254XXXXXXXXX (MPESA required format)
  formatPhoneNumber(phone) {
    if (!phone) throw new Error('Phone number is required');

    // Remove all non-digit characters
    let formatted = phone.replace(/\D/g, '');

    // Handle different input formats
    if (formatted.startsWith('0') && formatted.length === 10) {
      // 0712345678 → 254712345678
      formatted = '254' + formatted.slice(1);
    } else if (formatted.startsWith('254') && formatted.length === 12) {
      // Already correct format
    } else if (formatted.length === 9) {
      // 712345678 → 254712345678
      formatted = '254' + formatted;
    } else {
      throw new Error(`Invalid phone number format: ${phone}. Expected 07XXXXXXXX or 2547XXXXXXXX`);
    }

    return formatted;
  }

  // 🚀 STK Push (Lipa Na Mpesa Online)
  async lipaNaMpesaOnline(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      // Validate inputs
      if (!phoneNumber || !amount || amount <= 0) {
        return {
          success: false,
          error: 'Invalid input: phone number and positive amount required'
        };
      }

      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      console.log('Generated MPESA STK Push password:', password);
      logger.info('Generated MPESA STK Push password:', password)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(1), // MPESA requires integer amounts (no decimals)
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference || `TOUR_${Date.now()}`,
        TransactionDesc: transactionDesc || 'Tour Booking Payment'
      };

      logger.info('Initiating STK Push', {
        phone: formattedPhone,
        amount: payload.Amount,
        accountRef: payload.AccountReference
      });

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 15 second timeout for STK push
        }
      );

      // Validate MPESA response
      if (response.data.ResponseCode !== '0') {
        return {
          success: false,
          error: response.data.ResponseDescription || 'STK Push request rejected',
          responseCode: response.data.ResponseCode
        };
      }

      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        message: response.data.CustomerMessage || 'STK Push sent successfully',
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        // Return sanitized data for frontend
        customerMessage: response.data.CustomerMessage,
        phoneNumber: formattedPhone,
        amount: payload.Amount
      };
      
    } catch (error) {
      logger.error('STK Push Error', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        phone: phoneNumber,
        amount
      });

      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message || 'Network error initiating STK Push',
        responseCode: error.response?.data?.ResponseCode
      };
    }
  }

  // 🔄 C2B URL Registration (Run ONCE during setup/deployment)
  async registerC2BUrls() {
    try {
      const accessToken = await this.getAccessToken();

      const payload = {
        ShortCode: this.shortcode,
        ResponseType: 'Completed', // or 'Cancelled' if you want to handle cancellations
        ConfirmationURL: process.env.MPESA_C2B_CONFIRMATION_URL,
        ValidationURL: process.env.MPESA_C2B_VALIDATION_URL
      };

      logger.info('Registering C2B URLs', {
        shortcode: this.shortcode,
        confirmationUrl: payload.ConfirmationURL,
        validationUrl: payload.ValidationURL
      });

      const response = await axios.post(
        `${this.baseUrl}/mpesa/c2b/v1/registerurl`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      logger.info('C2B URLs registered successfully', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      logger.error('C2B Registration Error', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // 📥 Handle STK Push Callback (MPESA server → your server)
  async handleCallback(callbackData, transaction) {
    try {
      // Log raw callback for debugging (sanitize sensitive data in production)
      logger.debug('MPESA Callback received', {
        checkoutRequestId: callbackData.Body?.stkCallback?.CheckoutRequestID,
        resultCode: callbackData.Body?.stkCallback?.ResultCode
      });

      const stkCallback = callbackData.Body?.stkCallback;

      if (!stkCallback) {
        logger.error('Invalid callback structure', { callbackData });
        return { success: false, message: 'Invalid callback format' };
      }

      const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

      // ✅ Find payment by checkout request ID (using module-level import)
      const payment = await Payment.findOne({
        where: { mpesa_checkout_request_id: CheckoutRequestID },
        include: [{ model: Booking, as: 'Booking' }],
        transaction // Use passed transaction for consistency
      });

      if (!payment) {
        logger.warn('Payment not found for CheckoutRequestID', { CheckoutRequestID });
        // Still return success to MPESA to stop retries for unknown requests
        return { success: true, message: 'Payment not found (already processed or invalid)' };
      }

      // Prepare update data
      const updateData = {
        mpesa_result_code: ResultCode,
        mpesa_result_desc: ResultDesc
      };

      if (ResultCode === 0) {
        // ✅ Payment Successful - extract metadata
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];

        // Helper to extract metadata values
        const getMetadataValue = (name) => {
          const item = callbackMetadata.find(i => i.Name === name);
          return item?.Value;
        };

        // Update with confirmed transaction details
        updateData.transaction_id = getMetadataValue('MpesaReceiptNumber');
        updateData.status = 'completed';
        updateData.paid_at = new Date(); // Record exact payment time

        // Update booking if associated
        if (payment.Booking) {
          await payment.Booking.update({
            payment_status: 'paid',
            status: 'confirmed' // Or keep as 'pending' if you have manual confirmation flow
          }, { transaction });

          logger.info('Payment completed successfully', {
            transactionId: updateData.transaction_id,
            bookingNumber: payment.Booking.booking_number,
            amount: payment.amount
          });
        }
      } else {
        // ❌ Payment Failed/Cancelled by user
        updateData.status = 'failed';

        // Revert booking payment status if still pending
        if (payment.Booking?.payment_status === 'pending') {
          await payment.Booking.update({
            payment_status: 'unpaid'
          }, { transaction });
        }

        logger.warn('Payment failed or cancelled', {
          checkoutRequestId: CheckoutRequestID,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          bookingNumber: payment.Booking?.booking_number
        });
      }

      // Update payment record
      await payment.update(updateData, { transaction });

      return {
        success: true,
        paymentId: payment.id,
        status: updateData.status,
        transactionId: updateData.transaction_id,
        bookingNumber: payment.Booking?.booking_number
      };
    } catch (error) {
      logger.error('Callback Processing Error', {
        message: error.message,
        stack: error.stack,
        checkoutRequestId: callbackData.Body?.stkCallback?.CheckoutRequestID
      });
      return { success: false, message: error.message };
    }
  }

  // 🔄 Query STK Push Status (Optional: for frontend polling fallback)
  async querySTKStatus(checkoutRequestId) {
    try {
      if (!checkoutRequestId) {
        return { success: false, error: 'CheckoutRequestID is required' };
      }

      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: this.generatePassword(timestamp),
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: {
          resultCode: response.data.ResultCode,
          resultDesc: response.data.ResultDesc,
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
          // Map MPESA status to our internal status
          status: this.mapMpesaStatus(response.data.ResultCode)
        }
      };
    } catch (error) {
      logger.error('STK Query Error', {
        message: error.message,
        response: error.response?.data,
        checkoutRequestId
      });
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Helper: Map MPESA ResultCode to internal status
  mapMpesaStatus(resultCode) {
    const statusMap = {
      0: 'completed',
      1037: 'pending', // Timeout - user hasn't entered PIN yet
      1032: 'failed',  // Cancelled by user
      1036: 'failed',  // Insufficient funds
      1031: 'failed',  // Invalid parameters
      1: 'failed'      // General failure
    };
    return statusMap[resultCode] || 'unknown';
  }

  // 🔄 Optional: B2C Refund (Business to Customer) - for processing refunds
  async b2cRefund(phoneNumber, amount, remark, occasion = 'TourRefund') {
    try {
      const accessToken = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const payload = {
        InitiatorName: process.env.MPESA_INITIATOR_NAME, // Required for B2C
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL, // Encrypted password
        CommandID: 'BusinessPayment', // or 'SalaryPayment', 'PromotionPayment'
        Amount: Math.round(amount),
        PartyA: this.shortcode, // Your short code
        PartyB: formattedPhone, // Customer phone
        Remarks: remark,
        QueueTimeOutURL: process.env.MPESA_B2C_TIMEOUT_URL,
        ResultURL: process.env.MPESA_B2C_RESULT_URL,
        Occasion: occasion
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/b2c/v1/paymentrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      return {
        success: response.data.ResponseCode === '0',
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        message: response.data.ResponseDescription
      };
    } catch (error) {
      logger.error('B2C Refund Error', {
        message: error.message,
        response: error.response?.data,
        phoneNumber,
        amount
      });
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }
}

// ✅ Export singleton instance
export default new MpesaService();