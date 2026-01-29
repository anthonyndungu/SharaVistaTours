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

// Send booking confirmation email
export const sendBookingConfirmation = async (booking, user) => {
  try {
    const message = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking has been confirmed!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Booking Number:</strong> ${booking.booking_number}</li>
        <li><strong>Tour Package:</strong> ${booking.TourPackage.title}</li>
        <li><strong>Destination:</strong> ${booking.TourPackage.destination}</li>
        <li><strong>Start Date:</strong> ${booking.start_date}</li>
        <li><strong>End Date:</strong> ${booking.end_date}</li>
        <li><strong>Total Amount:</strong> KES ${booking.total_amount}</li>
        <li><strong>Status:</strong> ${booking.status}</li>
      </ul>
      <p>Thank you for choosing TravelEase!</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Your Booking Confirmation - TravelEase',
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
      subject: 'Payment Confirmation - TravelEase',
      html: message
    });

    return true;
  } catch (error) {
    logger.error('Error sending payment confirmation:', error);
    return false;
  }
};