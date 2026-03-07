import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { Payment, Booking } from '../models/index.js';
import smsService from './SmsService.js';

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

    // Rate limiting for querySTKStatus (MPESA limit: 5 requests per 60 seconds)
    this.queryRequests = []; // Track request timestamps
    this.queryQueue = []; // Queue for rate-limited requests
    this.maxRequestsPerMinute = 5;
    this.rateLimitWindow = 60000; // 60 seconds in milliseconds
    this.isProcessingQueue = false;
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

  // Rate Limiting: Check if we can make a request
  canMakeRequest() {
    const now = Date.now();
    // Remove requests older than the rate limit window
    this.queryRequests = this.queryRequests.filter(timestamp => now - timestamp < this.rateLimitWindow);

    return this.queryRequests.length < this.maxRequestsPerMinute;
  }

  // Rate Limiting: Record a successful request
  recordRequest() {
    this.queryRequests.push(Date.now());
  }

  // Rate Limiting: Get requests made in current window
  getRequestsInWindow() {
    const now = Date.now();
    this.queryRequests = this.queryRequests.filter(timestamp => now - timestamp < this.rateLimitWindow);
    return this.queryRequests.length;
  }

  // Rate Limiting: Calculate wait time until next available request
  getWaitTime() {
    if (this.queryRequests.length < this.maxRequestsPerMinute) {
      return 0;
    }
    const oldestRequest = this.queryRequests[0];
    const now = Date.now();
    return Math.max(0, this.rateLimitWindow - (now - oldestRequest) + 100); // +100ms buffer
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
        // Amount: Math.round(amount), // MPESA requires integer amounts (no decimals)
        Amount: Math.round(1),
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
  // async registerC2BUrls() {
  //   try {
  //     const accessToken = await this.getAccessToken();

  //     const payload = {
  //       ShortCode: this.shortcode,
  //       ResponseType: 'Completed', // or 'Cancelled' if you want to handle cancellations
  //       ConfirmationURL: process.env.MPESA_C2B_CONFIRMATION_URL,
  //       ValidationURL: process.env.MPESA_C2B_VALIDATION_URL
  //     };

  //     logger.info('Registering C2B URLs', {
  //       shortcode: this.shortcode,
  //       confirmationUrl: payload.ConfirmationURL,
  //       validationUrl: payload.ValidationURL
  //     });

  //     const response = await axios.post(
  //       `${this.baseUrl}/mpesa/c2b/v1/registerurl`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json'
  //         },
  //         timeout: 10000
  //       }
  //     );

  //     logger.info('C2B URLs registered successfully', response.data);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     logger.error('C2B Registration Error', {
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status
  //     });
  //     return {
  //       success: false,
  //       error: error.response?.data?.errorMessage || error.message
  //     };
  //   }
  // }

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

      // ✅ Find payment by checkout request ID
      const payment = await Payment.findOne({
        where: { mpesa_checkout_request_id: CheckoutRequestID },
        include: [{ model: Booking, as: 'Booking' }],
        transaction,
        lock: transaction ? sequelize.Lock.UPDATE : undefined // ✅ Prevent race conditions
      });

      if (!payment) {
        logger.warn('Payment not found for CheckoutRequestID', { CheckoutRequestID });
        // Still return success to MPESA to stop retries for unknown requests
        return { success: true, message: 'Payment not found (already processed or invalid)' };
      }

      // ✅ IDEMPOTENCY CHECK: Skip if already processed (ignore retries)
      if (payment.status === 'completed' || payment.status === 'failed' || payment.status === 'cancelled') {
        logger.info(`⏭️ Callback already processed for ${CheckoutRequestID} (status: ${payment.status}) - skipping retry`);
        return {
          success: true,
          message: 'Already processed - ignored',
          paymentId: payment.id,
          status: payment.status
        };
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

        // ✅ Extract and add M-Pesa specific fields
        updateData.transaction_id = getMetadataValue('MpesaReceiptNumber');
        updateData.mpesa_amount = getMetadataValue('Amount');
        updateData.mpesa_phone = getMetadataValue('PhoneNumber');
        updateData.mpesa_transaction_date = getMetadataValue('TransactionDate'); // YYYYMMDDHHmmss
        updateData.mpesa_balance = getMetadataValue('Balance');

        // ✅ Update status and timestamp
        updateData.status = 'completed';
        updateData.paid_at = new Date(); // Record exact payment time

        // Update booking if associated
        if (payment.Booking) {
          await payment.Booking.update({
            payment_status: 'paid',
            status: 'confirmed'
          }, { transaction });

          logger.info('Payment completed successfully', {
            transactionId: updateData.transaction_id,
            bookingNumber: payment.Booking.booking_number,
            amount: payment.amount,
            mpesaAmount: updateData.mpesa_amount,
            mpesaPhone: updateData.mpesa_phone
          });
        }

        logger.info('✅ Payment completed', {
          checkoutRequestId: CheckoutRequestID,
          mpesaReceiptNumber: updateData.transaction_id,
          amount: updateData.mpesa_amount,
          phone: updateData.mpesa_phone,
          transactionDate: updateData.mpesa_transaction_date,
          balance: updateData.mpesa_balance
        });

      } else {
        // ❌ Payment Failed/Cancelled by user
        updateData.status = ResultCode === 1032 ? 'cancelled' : 'failed';
        updateData.failed_at = new Date();

        // Revert booking payment status if still pending
        if (payment.Booking?.payment_status === 'pending') {
          await payment.Booking.update({
            payment_status: 'unpaid'
          }, { transaction });
        }

        logger.warn(`Payment ${ResultCode === 1032 ? 'cancelled' : 'failed'}`, {
          checkoutRequestId: CheckoutRequestID,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          bookingNumber: payment.Booking?.booking_number
        });
      }

      // ✅ Update payment record (ONLY ONCE per CheckoutRequestID)
      await payment.update(updateData, { transaction });

      logger.info(`📝 Payment ${payment.status} updated for ${CheckoutRequestID}`, {
        paymentId: payment.id,
        status: updateData.status,
        transactionId: updateData.transaction_id
      });

      return {
        success: true,
        paymentId: payment.id,
        status: updateData.status,
        transactionId: updateData.transaction_id,
        bookingNumber: payment.Booking?.booking_number,
        mpesaAmount: updateData.mpesa_amount,
        mpesaPhone: updateData.mpesa_phone
      };

    } catch (error) {
      // ✅ Handle unique constraint violation (if DB has unique index)
      if (error.name === 'SequelizeUniqueConstraintError') {
        logger.warn(`⚠️ Duplicate callback detected: ${callbackData.Body?.stkCallback?.CheckoutRequestID}`);
        return { success: true, message: 'Duplicate ignored - already exists' };
      }

      logger.error('Callback Processing Error', {
        message: error.message,
        stack: error.stack,
        checkoutRequestId: callbackData.Body?.stkCallback?.CheckoutRequestID
      });
      return { success: false, message: error.message };
    }
  }

  // 🔄 Query STK Push Status with Rate Limiting (MPESA limit: 5 requests per 60 seconds)
  async querySTKStatus(checkoutRequestId, retryCount = 0) {
    try {
      if (!checkoutRequestId) {
        return { success: false, error: 'CheckoutRequestID is required' };
      }

      // Check if we can make a request immediately
      if (!this.canMakeRequest()) {
        const waitTime = this.getWaitTime();
        const currentRequests = this.getRequestsInWindow();

        logger.warn('MPESA rate limit: queuing request', {
          checkoutRequestId,
          requestsInWindow: currentRequests,
          maxRequests: this.maxRequestsPerMinute,
          waitTimeMs: waitTime,
          queuedRequests: this.queryQueue.length
        });

        // Create a promise that resolves when the request can be made
        return new Promise((resolve) => {
          this.queryQueue.push({
            checkoutRequestId,
            resolve,
            timestamp: Date.now(),
            retryCount
          });

          // Process queue if not already processing
          this.processQueryQueue();
        });
      }

      // Record the request and make it
      this.recordRequest();

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
          timeout: 15000 // Increased from 10s to 15s for rate-limited scenarios
        }
      );

      logger.info('STK Query successful', {
        checkoutRequestId,
        resultCode: response.data.ResultCode,
        requestsInWindow: this.getRequestsInWindow()
      });

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
        checkoutRequestId,
        statusCode: error.response?.status,
        retryCount
      });

      // Check if this is a rate limit error
      if (error.response?.status === 429 && retryCount < 3) {
        logger.warn('Rate limit error, retrying with exponential backoff', {
          checkoutRequestId,
          retryCount,
          nextRetryIn: Math.pow(2, retryCount + 1) * 1000
        });

        // Exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, retryCount + 1) * 1000;
        return new Promise((resolve) => {
          setTimeout(() => {
            this.querySTKStatus(checkoutRequestId, retryCount + 1).then(resolve);
          }, waitTime);
        });
      }

      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        statusCode: error.response?.status
      };
    }
  }

  // Rate Limiting: Process queued STK query requests
  async processQueryQueue() {
    if (this.isProcessingQueue || this.queryQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.queryQueue.length > 0) {
        // Check if we can make a request
        if (!this.canMakeRequest()) {
          const waitTime = this.getWaitTime();
          logger.debug('Queue processor: waiting before next request', { waitTime });
          await new Promise(resolve => setTimeout(resolve, waitTime + 100));
          continue;
        }

        // Get next request from queue
        const queuedRequest = this.queryQueue.shift();

        // Calculate wait time since queued
        const queueWaitTime = Date.now() - queuedRequest.timestamp;
        logger.debug('Processing queued STK query', {
          checkoutRequestId: queuedRequest.checkoutRequestId,
          queuedFor: queueWaitTime,
          remainingInQueue: this.queryQueue.length
        });

        // Make the actual request
        this.recordRequest(); // Record before making request

        try {
          const accessToken = await this.getAccessToken();
          const timestamp = this.generateTimestamp();

          const payload = {
            BusinessShortCode: this.shortcode,
            Password: this.generatePassword(timestamp),
            Timestamp: timestamp,
            CheckoutRequestID: queuedRequest.checkoutRequestId
          };

          const response = await axios.post(
            `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              timeout: 15000
            }
          );

          // Resolve the promise with result
          queuedRequest.resolve({
            success: true,
            data: {
              resultCode: response.data.ResultCode,
              resultDesc: response.data.ResultDesc,
              checkoutRequestId: response.data.CheckoutRequestID,
              merchantRequestId: response.data.MerchantRequestID,
              status: this.mapMpesaStatus(response.data.ResultCode)
            }
          });
        } catch (error) {
          logger.error('Error processing queued STK query', {
            checkoutRequestId: queuedRequest.checkoutRequestId,
            error: error.message
          });

          queuedRequest.resolve({
            success: false,
            error: error.response?.data?.errorMessage || error.message
          });
        }

        // Small delay between queue requests
        if (this.queryQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } finally {
      this.isProcessingQueue = false;
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

  //c2b validation and confirmation handlers can be added here as needed
  async registerC2BUrls() {
    const accessToken = await this.getAccessToken();
    const payload = {
      ShortCode: this.shortcode,
      ResponseType: 'Completed',
      ConfirmationURL: process.env.MPESA_C2B_CONFIRMATION_URL,
      ValidationURL: process.env.MPESA_C2B_VALIDATION_URL
    };

    try {
      const response = await axios.post(`${this.baseUrl}/mpesa/c2b/v1/registerurl`, payload, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });
      logger.info('✅ C2B URLs Registered', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      logger.error('❌ Registration Failed', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
  // 🔍 Hybrid Matching Logic
  async matchPaymentToBooking(data) {
    const { TransAmount, MSISDN, BillRefNumber } = data;

    // Strategy 1: Account Reference (PayBill or Till with Ref)
    if (BillRefNumber) {
      const booking = await Booking.findOne({ 
        where: { booking_number: BillRefNumber.trim() },
        attributes: ['id', 'booking_number', 'total_amount', 'payment_status']
      });
      if (booking) {
        logger.info(`🎯 Matched via Account Ref: ${BillRefNumber}`);
        return { booking, confidence: 'high', method: 'account_ref' };
      }
    }

    // Strategy 2: Expected Payment (Phone + Amount + Time)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const expected = await ExpectedPayment.findOne({
      where: {
        phone: MSISDN,
        amount: TransAmount,
        status: 'pending',
        expires_at: { [Op.gte]: new Date() },
        createdAt: { [Op.gte]: tenMinsAgo }
      },
      include: [{ model: Booking, as: 'Booking', attributes: ['id', 'booking_number'] }],
      order: [['createdAt', 'DESC']]
    });

    if (expected && expected.Booking) {
      await expected.update({ status: 'matched', trans_id: data.TransID });
      logger.info(`🎯 Matched via Expected Payment: ${expected.id}`);
      return { booking: expected.Booking, confidence: 'medium', method: 'expected_payment' };
    }

    logger.warn(`⚠️ No match found for TransID: ${data.TransID}`);
    return { booking: null, confidence: 'none', method: 'none' };
  }

  async handleC2BConfirmation(data) {
    const transaction = await C2BPayment.sequelize.transaction();
    
    try {
      const { TransID, TransAmount, MSISDN, FirstName, LastName, BillRefNumber } = data;

      // 1. Idempotency Check
      const existing = await C2BPayment.findOne({ where: { trans_id: TransID }, transaction });
      if (existing) {
        await transaction.commit();
        return { ResultCode: 0, ResultDesc: 'Already processed' };
      }

      // 2. Run Hybrid Matching
      const matchResult = await this.matchPaymentToBooking(data);
      const { booking, confidence } = matchResult;

      // 3. Create C2B Record
      const paymentRecord = await C2BPayment.create({
        trans_id: TransID,
        trans_type: data.TransType,
        trans_time: data.TransTime,
        trans_amount: TransAmount,
        business_shortcode: data.BusinessShortCode,
        msisdn: MSISDN,
        first_name: FirstName,
        last_name: LastName,
        account_number: BillRefNumber,
        booking_id: booking ? booking.id : null,
        status: booking ? 'completed' : 'unmatched',
        match_confidence: confidence,
        raw_callback: data,
        processed_at: new Date()
      }, { transaction });

      // 4. Update Booking if matched
      if (booking) {
        await booking.update({
          payment_status: 'paid',
          status: 'confirmed'
        }, { transaction });
        logger.info(`✅ Payment Confirmed: ${TransID} -> Booking ${booking.booking_number}`);
      } else {
        logger.warn(`⚠️ Unmatched Payment: ${TransID}. Requires manual review.`);
      }

      await transaction.commit();

      // 5. 🚀 Send SMS Notification (Async - do not block response)
      setImmediate(() => {
        this.sendNotificationSMS({
          phone: MSISDN,
          amount: TransAmount,
          transId: TransID,
          bookingNumber: booking?.booking_number,
          isMatched: !!booking
        });
      });

      return { ResultCode: 0, ResultDesc: 'Success', bookingMatched: !!booking };

    } catch (error) {
      await transaction.rollback();
      logger.error('❌ C2B Confirmation Error', error);
      return { ResultCode: 0, ResultDesc: `Error: ${error.message}` };
    }
  }

  async sendNotificationSMS({ phone, amount, transId, bookingNumber, isMatched }) {
    try {
      if (isMatched) {
        await smsService.sendPaymentConfirmation({
          phone,
          amount,
          bookingNumber,
          transId
        });
      } else {
        // Send unmatched alert to customer
        await smsService.sendUnmatchedAlert({
          phone,
          amount,
          transId
        });
        
        // Optional: Send alert to Admin (implement separate admin SMS method if needed)
        // await smsService.sendSMS('+254700000000', `ADMIN ALERT: Unmatched payment KES ${amount} from ${phone}. Ref: ${transId}`);
      }
    } catch (error) {
      logger.error('Failed to send notification SMS', error);
      // Don't throw - payment is still valid even if SMS fails
    }
  }

}

// ✅ Export singleton instance
export default new MpesaService();