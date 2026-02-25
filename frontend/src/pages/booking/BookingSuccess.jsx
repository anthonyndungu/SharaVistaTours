import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBookingById } from '../../features/bookings/bookingSlice'
import { Link } from 'react-router-dom'

export default function BookingSuccess() {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { selectedBooking, loading } = useSelector(state => state.bookings)

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== parseInt(bookingId)) {
      dispatch(fetchBookingById(bookingId))
    }
  }, [dispatch, bookingId, selectedBooking])

  if (loading) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <p>Loading booking confirmation...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!selectedBooking) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <p>Booking not found</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="single-product travel_tour-page travel_tour">
      <section className="content-area single-woo-tour">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="item_content_tour">
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '30px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <i className="fa fa-check-circle" style={{ fontSize: '60px', color: '#28a745' }}></i>
                  </div>
                  <h2 style={{ color: '#28a745', marginBottom: '10px', fontSize: '32px' }}>Booking Confirmed!</h2>
                  <p style={{ color: '#666', fontSize: '16px' }}>Your booking has been successfully created. A confirmation email has been sent to you.</p>
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '4px', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Booking Details</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Booking Number</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{selectedBooking.booking_number}</p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Status</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745', textTransform: 'capitalize' }}>{selectedBooking.status}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Tour Package</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{selectedBooking.TourPackage?.title}</p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Destination</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{selectedBooking.TourPackage?.destination}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Travel Dates</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {new Date(selectedBooking.start_date).toLocaleDateString()} to {new Date(selectedBooking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Total Amount</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#e67e22' }}>KES {selectedBooking.total_amount?.toLocaleString('en-KE')}</p>
                    </div>
                  </div>

                  {selectedBooking.BookingPassengers && selectedBooking.BookingPassengers.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Passengers</p>
                      <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        {selectedBooking.BookingPassengers.map((passenger, idx) => (
                          <div key={idx} style={{ paddingBottom: idx < selectedBooking.BookingPassengers.length - 1 ? '15px' : '0', borderBottom: idx < selectedBooking.BookingPassengers.length - 1 ? '1px solid #eee' : 'none' }}>
                            <p style={{ fontSize: '14px', color: '#333', marginBottom: '5px' }}>
                              <strong>{passenger.name}</strong> {passenger.email && `(${passenger.email})`}
                            </p>
                            {passenger.phone && <p style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>Phone: {passenger.phone}</p>}
                            {passenger.age && <p style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>Age: {passenger.age}</p>}
                            {passenger.nationality && <p style={{ fontSize: '12px', color: '#666' }}>Nationality: {passenger.nationality}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBooking.special_requests && (
                    <div style={{ marginTop: '20px' }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Special Requests</p>
                      <p style={{ fontSize: '14px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        {selectedBooking.special_requests}
                      </p>
                    </div>
                  )}
                </div>

                {/* M-Pesa Payment Instructions */}
                <div style={{ backgroundColor: '#e8f5e9', border: '2px solid #4caf50', padding: '25px', borderRadius: '4px', marginBottom: '30px' }}>
                  <h3 style={{ color: '#2e7d32', marginTop: '0', marginBottom: '15px' }}>
                    <i className="fa fa-mobile" style={{ marginRight: '10px' }}></i>
                    M-Pesa Payment Instructions
                  </h3>
                  
                  <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ddd' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ color: '#666', fontSize: '14px' }}>Till Number:</span><br/>
                      <span style={{ fontSize: '24px', color: '#e67e22', fontWeight: 'bold', fontFamily: 'monospace' }}>7915503</span>
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ color: '#666', fontSize: '14px' }}>Amount to Send:</span><br/>
                      <span style={{ fontSize: '24px', color: '#e67e22', fontWeight: 'bold', fontFamily: 'monospace' }}>KES {selectedBooking.total_amount?.toLocaleString('en-KE')}</span>
                    </p>
                    <p style={{ marginBottom: '0' }}>
                      <span style={{ color: '#666', fontSize: '14px' }}>Reference:</span><br/>
                      <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold', fontFamily: 'monospace' }}>{selectedBooking.booking_number}</span>
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                    <p style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>Steps to Pay via M-Pesa:</p>
                    <ol style={{ margin: '0', paddingLeft: '20px', color: '#555' }}>
                      <li style={{ marginBottom: '8px' }}>Open M-Pesa app on your phone</li>
                      <li style={{ marginBottom: '8px' }}>Select <strong>"Send Money"</strong> or <strong>"Lipa Na M-Pesa Online"</strong></li>
                      <li style={{ marginBottom: '8px' }}>Enter Till Number: <strong>7915503</strong></li>
                      <li style={{ marginBottom: '8px' }}>Enter amount: <strong>KES {selectedBooking.total_amount?.toLocaleString('en-KE')}</strong></li>
                      <li style={{ marginBottom: '8px' }}>Enter your M-Pesa PIN to confirm</li>
                      <li>Your payment will be verified automatically</li>
                    </ol>
                  </div>

                  <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', padding: '12px', borderRadius: '4px', marginBottom: '0' }}>
                    <p style={{ color: '#856404', margin: '0', fontSize: '14px' }}>
                      <strong>⚠️ Important:</strong> Please include your booking number <strong>{selectedBooking.booking_number}</strong> in any communication with us about this payment.
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '4px', marginBottom: '30px', border: '1px solid #4caf50' }}>
                  <p style={{ color: '#2e7d32', fontSize: '14px', lineHeight: '1.6', marginBottom: '0' }}>
                    <strong>✓ Next Steps:</strong> A confirmation email with your booking details and payment instructions has been sent to your registered email address. 
                    Please complete your M-Pesa payment to finalize your reservation. 
                    Once payment is received, you'll get another confirmation email.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Link
                    to={`/dashboard/bookings/${bookingId}`}
                    className="btn btn-primary"
                    style={{ marginRight: '10px', display: 'inline-block' }}
                  >
                    View Full Booking Details
                  </Link>
                  <Link
                    to="/tours"
                    className="btn btn-secondary"
                    style={{ display: 'inline-block' }}
                  >
                    Browse More Tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}