import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`
    };

    await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent to ${options.email}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Send booking confirmation email with payment instructions
export const sendBookingConfirmation = async (booking, user) => {
  try {
    const message = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for your booking! Your reservation has been successfully created.</p>
      
      <h3>📋 Booking Details:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Booking Number:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.booking_number}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tour Package:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.TourPackage.title}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Destination:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.TourPackage.destination}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Travel Dates:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #e67e22;">KES ${booking.total_amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; color: #ff9800; text-transform: uppercase;"><strong>${booking.status}</strong></td>
        </tr>
      </table>

      <h3>💳 Payment Instructions:</h3>
      <p>Your booking is pending payment confirmation. To secure your reservation, please make your payment using one of the methods below:</p>
      
      <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h4 style="color: #2e7d32; margin-top: 0;">📱 M-Pesa Payment (Recommended):</h4>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Till Number:</strong> <span style="font-size: 18px; color: #e67e22; font-family: monospace;">7915503</span>
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Phone Number (STK Push):</strong> <span style="font-size: 18px; color: #e67e22; font-family: monospace;">+254 712 345 678</span>
        </p>
        <ol style="margin: 15px 0; padding-left: 20px;">
          <li>Open M-Pesa on your phone</li>
          <li>Select "Send Money"</li>
          <li>Enter Till Number: <strong>7915503</strong></li>
          <li>Enter amount: <strong>KES ${booking.total_amount.toLocaleString()}</strong></li>
          <li>Enter your PIN to confirm</li>
          <li>Send a screenshot/confirmation to: <strong>bookings@sharavistastours.com</strong></li>
        </ol>
        <p style="color: #d32f2f; font-size: 14px;"><strong>⚠️ Important:</strong> Include your booking number <strong>${booking.booking_number}</strong> in the payment message.</p>
      </div>

      <h3>👥 Passengers:</h3>
      <ul>
        ${booking.BookingPassengers.map(p => `
          <li>
            <strong>${p.name}</strong> 
            ${p.age ? `(Age: ${p.age})` : ''} 
            ${p.nationality ? `- ${p.nationality}` : ''}
          </li>
        `).join('')}
      </ul>

      ${booking.special_requests ? `
        <h3>📝 Special Requests:</h3>
        <p>${booking.special_requests}</p>
      ` : ''}

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 14px;">
        <strong>Questions?</strong> Contact us at <a href="mailto:support@sharavistastours.com">support@sharavistastours.com</a> or call <strong>+254 712 345 678</strong>
      </p>
      <p style="color: #666; font-size: 14px;">Thank you for choosing Sharavista Tours! We look forward to making your trip unforgettable.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: `Booking Confirmation - ${booking.booking_number} | Sharavista Tours`,
      html: message
    });

    return true;
  } catch (error) {
    logger.error('Error sending booking confirmation:', error);
    return false;
  }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (payment, booking, user) => {
  try {
    const message = `
      <h2>Payment Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your payment has been successfully processed!</p>
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Booking Number:</strong> ${booking.booking_number}</li>
        <li><strong>Payment Method:</strong> ${payment.payment_method.toUpperCase()}</li>
        <li><strong>Amount Paid:</strong> KES ${payment.amount}</li>
        <li><strong>Transaction ID:</strong> ${payment.transaction_id}</li>
        <li><strong>Payment Status:</strong> ${payment.status}</li>
      </ul>
      <p>Your booking is now confirmed. We look forward to serving you!</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Payment Confirmation - Sharavista Tours',
      html: message
    });

    return true;
  } catch (error) {
    logger.error('Error sending payment confirmation:', error);
    return false;
  }
};

// Send M-Pesa payment reminder email
export const sendMpesaPaymentReminder = async (booking, user) => {
  try {
    const message = `
      <h2>Complete Your Payment - Booking Pending</h2>
      <p>Dear ${user.name},</p>
      <p>We're still waiting for your payment to confirm booking <strong>${booking.booking_number}</strong>.</p>
      <p>Complete your payment now to secure your reservation!</p>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #856404; margin-top: 0;">⏰ Payment Deadline:</h3>
        <p style="font-size: 16px; color: #856404;">
          Please complete payment within <strong>24 hours</strong> to avoid booking cancellation.
        </p>
      </div>

      <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h4 style="color: #2e7d32; margin-top: 0;">📱 M-Pesa Payment Instructions:</h4>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Till Number:</strong> <span style="font-size: 18px; color: #e67e22; font-family: monospace;">7915503</span>
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Amount:</strong> <span style="font-size: 18px; color: #e67e22; font-family: monospace;">KES ${booking.total_amount.toLocaleString()}</span>
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Reference:</strong> <span style="font-size: 14px; color: #666; font-family: monospace;">${booking.booking_number}</span>
        </p>
        <ol style="margin: 15px 0; padding-left: 20px;">
          <li>Open M-Pesa on your phone</li>
          <li>Tap "Lipa Na M-Pesa Online"</li>
          <li>Use Till Number: <strong>7915503</strong></li>
          <li>Enter amount: <strong>KES ${booking.total_amount.toLocaleString()}</strong></li>
          <li>Complete the transaction</li>
        </ol>
      </div>

      <h3>📋 Booking Summary:</h3>
      <ul>
        <li><strong>Package:</strong> ${booking.TourPackage.title}</li>
        <li><strong>Destination:</strong> ${booking.TourPackage.destination}</li>
        <li><strong>Travel Dates:</strong> ${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}</li>
        <li><strong>Total Amount:</strong> KES ${booking.total_amount.toLocaleString()}</li>
      </ul>

      <p style="color: #666; font-size: 14px;">
        For support, contact us at <a href="mailto:support@sharavistastours.com">support@sharavistastours.com</a>
      </p>
    `;

    await sendEmail({
      email: user.email,
      subject: `Payment Reminder: Complete Your Booking ${booking.booking_number}`,
      html: message
    });

    return true;
  } catch (error) {
    logger.error('Error sending M-Pesa payment reminder:', error);
    return false;
  }
};