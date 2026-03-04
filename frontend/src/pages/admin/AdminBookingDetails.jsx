// src/pages/AdminBookingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookingById, updateBookingStatus, cancelBooking } from '../../features/bookings/bookingSlice';

// Icons
const Icons = {
  Back: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  User: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Calendar: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  MapPin: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Package: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Dollar: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>,
};

export default function AdminBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedBooking, loading, error } = useSelector((state) => state.bookings);
  const [localStatus, setLocalStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId, selectedBooking]);

  useEffect(() => {
    if (selectedBooking) {
      setLocalStatus(selectedBooking.status);
    }
  }, [selectedBooking]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    setIsUpdating(true);
    try {
      await dispatch(updateBookingStatus({ id: bookingId, status: newStatus })).unwrap();
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on error
      setLocalStatus(selectedBooking.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to CANCEL this booking? This action cannot be undone.')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        navigate('/admin/bookings');
      } catch (err) {
        alert("Failed to cancel booking: " + err.message);
      }
    }
  };

  if (loading && !selectedBooking) {
    return (
      <div className="admin-booking-details loading-state">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error || !selectedBooking) {
    return (
      <div className="admin-booking-details error-state">
        <div className="error-box">
          <h3>Booking Not Found</h3>
          <p>{error || "The requested booking does not exist."}</p>
          <button onClick={() => navigate('/admin/bookings')} className="btn btn-outline">
            <Icons.Back /> Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => `status-badge status-${status}`;

  return (
    <div className="admin-booking-details">
      <div className="container">
        
        {/* Header */}
        <header className="page-header">
          <button onClick={() => navigate('/admin/bookings')} className="back-btn">
            <Icons.Back /> Back to Bookings
          </button>
          <div className="header-actions">
            <span className={`status-badge ${getStatusClass(selectedBooking.status)}`}>
              {selectedBooking.status}
            </span>
          </div>
        </header>

        <div className="details-grid">
          
          {/* Left Column: Main Info */}
          <div className="main-content">
            
            {/* Booking Reference */}
            <div className="card reference-card">
              <div className="card-header">
                <h2>Booking Details</h2>
                <span className="ref-number">{selectedBooking.booking_number}</span>
              </div>
            </div>

            {/* Client Information */}
            <div className="card">
              <div className="card-header">
                <Icons.User />
                <h3>Client Information</h3>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <div className="value">{selectedBooking.User?.name || 'N/A'}</div>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <div className="value flex-row">
                      <Icons.Mail /> {selectedBooking.User?.email || 'N/A'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <div className="value flex-row">
                      <Icons.Phone /> {selectedBooking.User?.phone || 'N/A'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Registered Date</label>
                    <div className="value">{selectedBooking.User?.created_at ? new Date(selectedBooking.User.created_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Package Details */}
            <div className="card">
              <div className="card-header">
                <Icons.Package />
                <h3>Tour Package</h3>
              </div>
              <div className="card-body">
                <h4 className="package-title">{selectedBooking.TourPackage?.title || 'Unknown Package'}</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Destination</label>
                    <div className="value flex-row">
                      <Icons.MapPin /> {selectedBooking.TourPackage?.destination}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Duration</label>
                    <div className="value">{selectedBooking.TourPackage?.duration_days} Days / {selectedBooking.TourPackage?.duration_nights} Nights</div>
                  </div>
                  <div className="info-item">
                    <label>Category</label>
                    <div className="value capitalize">{selectedBooking.TourPackage?.category}</div>
                  </div>
                </div>
                
                <div className="dates-box">
                  <div className="date-item">
                    <span className="label">Start Date</span>
                    <span className="value">{new Date(selectedBooking.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="date-divider"></div>
                  <div className="date-item">
                    <span className="label">End Date</span>
                    <span className="value">{new Date(selectedBooking.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers */}
            {selectedBooking.BookingPassengers && selectedBooking.BookingPassengers.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <Icons.User />
                  <h3>Passengers ({selectedBooking.BookingPassengers.length})</h3>
                </div>
                <div className="card-body">
                  <div className="passenger-list">
                    {selectedBooking.BookingPassengers.map((p, idx) => (
                      <div key={idx} className="passenger-item">
                        <div className="passenger-avatar">{p.name.charAt(0).toUpperCase()}</div>
                        <div className="passenger-info">
                          <div className="name">{p.name}</div>
                          <div className="details">
                            {p.email && <span>{p.email}</span>}
                            {p.phone && <span>• {p.phone}</span>}
                            {p.age && <span>• Age: {p.age}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            {selectedBooking.special_requests && (
              <div className="card info-card">
                <div className="card-header">
                  <Icons.Check />
                  <h3>Special Requests</h3>
                </div>
                <div className="card-body">
                  <p className="special-text">{selectedBooking.special_requests}</p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Actions & Payment */}
          <div className="sidebar">
            
            {/* Admin Actions */}
            <div className="card actions-card">
              <div className="card-header">
                <h3>Admin Actions</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Update Status</label>
                  <select 
                    value={localStatus} 
                    onChange={handleStatusChange} 
                    disabled={isUpdating}
                    className={`status-select-large status-${localStatus}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {isUpdating && <span className="helper-text">Updating...</span>}
                </div>

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <button onClick={handleCancelBooking} className="btn btn-danger btn-full">
                    Cancel Booking
                  </button>
                )}
                
                <Link to={`/admin/bookings`} className="btn btn-outline btn-full">
                  Back to List
                </Link>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="card payment-card">
              <div className="card-header">
                <Icons.Dollar />
                <h3>Payment Summary</h3>
              </div>
              <div className="card-body">
                <div className="payment-row total">
                  <span>Total Amount</span>
                  <span className="amount">KES {parseFloat(selectedBooking.total_amount).toLocaleString()}</span>
                </div>
                
                <div className="payment-row">
                  <span>Payment Status</span>
                  <span className={`status-text ${selectedBooking.payment_status}`}>
                    {selectedBooking.payment_status}
                  </span>
                </div>

                {selectedBooking.Payment && (
                  <>
                    <div className="payment-row">
                      <span>Method</span>
                      <span className="method capitalize">{selectedBooking.Payment.payment_method}</span>
                    </div>
                    {selectedBooking.Payment.transaction_id && (
                      <div className="payment-row small">
                        <span>Transaction ID</span>
                        <span className="tx-id">{selectedBooking.Payment.transaction_id}</span>
                      </div>
                    )}
                    {selectedBooking.Payment.paid_at && (
                      <div className="payment-row small">
                        <span>Paid On</span>
                        <span className="date">{new Date(selectedBooking.Payment.paid_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                )}
                
                {!selectedBooking.Payment && selectedBooking.payment_status === 'unpaid' && (
                  <div className="empty-payment">
                    <p>No payment recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}