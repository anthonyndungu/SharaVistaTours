import axios from 'axios';
import { Payment, Booking } from '../models/index.js';
import logger from '../utils/logger.js';

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_SHORTCODE;
    this.passKey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get base URL based on environment
  getBaseUrl() {
    return this.environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  // Get access token
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      
      logger.info('MPESA access token refreshed');
      return this.accessToken;
    } catch (error) {
      logger.error('Error getting MPESA access token:', error.response?.data || error.message);
      throw new Error('Failed to get MPESA access token');
    }
  }

  // Initiate STK Push
  async lipaNaMpesaOnline(phoneNumber, amount, accountReference, transactionDesc = 'Tour Booking Payment') {
    try {
      const accessToken = await this.getAccessToken();
      
      // Format phone number (254...)
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = `254${phoneNumber.substring(1)}`;
      } else if (phoneNumber.startsWith('+')) {
        formattedPhone = phoneNumber.substring(1);
      }

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${this.shortCode}${this.passKey}${timestamp}`).toString('base64');

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: this.shortCode,
          PhoneNumber: formattedPhone,
          CallBackURL: this.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`MPESA STK Push initiated: ${response.data.CheckoutRequestID}`);

      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        message: response.data.CustomerMessage,
        response: response.data
      };
    } catch (error) {
      logger.error('Error initiating MPESA payment:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Handle callback from MPESA
  async handleCallback(body) {
    try {
      const { Body: { stkCallback } } = body;
      const { 
        CheckoutRequestID, 
        MerchantRequestID, 
        ResultCode, 
        ResultDesc,
        CallbackMetadata
      } = stkCallback;

      logger.info(`MPESA callback received for: ${CheckoutRequestID}`);

      if (ResultCode === 0) {
        // Payment successful
        // Extract transaction details
        let amount = 0;
        let mpesaReceiptNumber = '';
        let phoneNumber = '';
        let transactionDate = '';

        if (CallbackMetadata && CallbackMetadata.Item) {
          CallbackMetadata.Item.forEach(item => {
            if (item.Name === 'Amount') amount = item.Value;
            if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
            if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
            if (item.Name === 'TransactionDate') transactionDate = item.Value;
          });
        }

        // Update payment record
        const payment = await Payment.findOne({
          where: { mpesa_checkout_request_id: CheckoutRequestID }
        });

        if (payment) {
          await payment.update({
            status: 'completed',
            mpesa_result_code: ResultCode,
            mpesa_result_desc: ResultDesc,
            transaction_id: mpesaReceiptNumber
          });

          // Update booking payment status
          const booking = await Booking.findByPk(payment.booking_id);
          if (booking) {
            await booking.update({
              payment_status: 'paid',
              status: booking.status === 'pending' ? 'confirmed' : booking.status
            });

            logger.info(`Payment confirmed for booking ${booking.booking_number}`);
          }
        }

        return { 
          success: true, 
          message: 'Payment confirmed',
          transactionId: mpesaReceiptNumber
        };
      } else {
        // Payment failed
        const payment = await Payment.findOne({
          where: { mpesa_checkout_request_id: CheckoutRequestID }
        });

        if (payment) {
          await payment.update({
            status: 'failed',
            mpesa_result_code: ResultCode,
            mpesa_result_desc: ResultDesc
          });
        }

        logger.warn(`MPESA payment failed: ${ResultDesc}`);

        return { 
          success: false, 
          message: ResultDesc 
        };
      }
    } catch (error) {
      logger.error('Error handling MPESA callback:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Query transaction status
  async queryTransactionStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${this.shortCode}${this.passKey}${timestamp}`).toString('base64');

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      logger.error('Error querying transaction status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new MpesaService();