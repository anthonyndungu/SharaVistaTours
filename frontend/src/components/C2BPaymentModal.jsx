// src/components/Payment/C2BPaymentModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Alert, Steps, Spin, Result } from 'antd'; // Or your UI library
import { CopyOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const C2BPaymentModal = ({ visible, onClose, booking, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState('initiating'); // initiating, waiting, success, failed
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds

  // 1. Initialize Payment (Call Backend to create ExpectedPayment)
  useEffect(() => {
    if (visible && booking) {
      initiatePayment();
    }
  }, [visible, booking]);

  // 2. Countdown Timer
  useEffect(() => {
    if (status === 'waiting' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setStatus('failed');
    }
  }, [status, timeLeft]);

  // 3. Polling Logic (Check if backend received callback)
  useEffect(() => {
    let pollInterval;
    if (status === 'waiting' && paymentData) {
      pollInterval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/v1/bookings/${booking.id}/payment-status`);
          if (res.data.status === 'paid') {
            setStatus('success');
            clearInterval(pollInterval);
            onSuccess?.(res.data);
            setTimeout(onClose, 3000); // Close after 3s
          } else if (res.data.status === 'unmatched') {
            setStatus('unmatched');
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Polling error', error);
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(pollInterval);
  }, [status, paymentData, booking?.id]);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/v1/bookings/${booking.id}/pay-c2b`, {
        phone: booking.customer_phone, // Ensure this is normalized (254...)
        method: booking.payment_method // 'paybill' or 'till'
      });
      setPaymentData(res.data.data);
      setStatus('waiting');
    } catch (error) {
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Show toast "Copied!"
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal
      title="Complete Your Payment"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <p>Generating payment instructions...</p>
        </div>
      ) : status === 'initiating' || status === 'failed' ? (
        <Result
          status="error"
          title="Failed to Load Instructions"
          subTitle="Please refresh and try again."
          extra={<Button type="primary" onClick={initiatePayment}>Retry</Button>}
        />
      ) : status === 'success' ? (
        <Result
          status="success"
          title="Payment Confirmed!"
          subTitle={`Booking ${booking.booking_number} is now confirmed.`}
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 48 }} />}
        />
      ) : status === 'unmatched' ? (
        <Result
          status="warning"
          title="Payment Received but Not Matched"
          subTitle="We received your money but couldn't find your booking automatically. Please contact support with Ref: ..."
          extra={[
            <Button key="contact" type="primary">Contact Support</Button>,
            <Button key="close" onClick={onClose}>Close</Button>
          ]}
        />
      ) : (
        // ✅ WAITING STATE (The Core UI)
        <div>
          <Alert
            message={`Time Remaining: ${formatTime(timeLeft)}`}
            description="Please complete the payment on your phone before time expires."
            type="info"
            showIcon
            icon={<ClockCircleOutlined />}
            style={{ marginBottom: 20 }}
          />

          <Steps
            direction="vertical"
            current={1}
            items={[
              {
                title: '1. Open M-Pesa Menu',
                description: 'Go to Lipa na M-Pesa',
              },
              {
                title: `2. Select ${paymentData?.type === 'PayBill' ? 'Pay Bill' : 'Buy Goods'}`,
                description: (
                  <div style={{ marginTop: 10, background: '#f5f5f5', padding: 15, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>{paymentData?.type === 'PayBill' ? 'Business No:' : 'Till Number:'}</strong>
                      <span>
                        {paymentData?.shortcode} 
                        <CopyOutlined 
                          onClick={() => copyToClipboard(paymentData?.shortcode)}
                          style={{ marginLeft: 8, cursor: 'pointer', color: '#1890ff' }}
                        />
                      </span>
                    </div>
                    
                    {paymentData?.type === 'PayBill' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <strong>Account No:</strong>
                        <span style={{ color: '#d46b08', fontWeight: 'bold' }}>
                          {paymentData?.accountRef} 
                          <CopyOutlined 
                            onClick={() => copyToClipboard(paymentData?.accountRef)}
                            style={{ marginLeft: 8, cursor: 'pointer' }}
                          />
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Amount:</strong>
                      <span style={{ color: '#cf1322', fontWeight: 'bold' }}>KES {paymentData?.amount}</span>
                    </div>
                    
                    {paymentData?.type === 'Till Number' && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                        💡 Tip: You can enter <strong>{paymentData?.accountRef}</strong> as the account reference, but it's optional.
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: '3. Enter PIN & Send',
                description: 'Wait for the confirmation SMS from us.',
              },
            ]}
          />

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ color: '#666' }}>Waiting for M-Pesa confirmation...</p>
            <Button onClick={onClose} danger ghost style={{ marginTop: 10 }}>
              Cancel Payment
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default C2BPaymentModal;