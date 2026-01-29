import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBookingById } from '../../features/bookings/bookingSlice'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner'

export default function BookingConfirmation() {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  
  const { selectedBooking, loading } = useSelector(state => state.bookings)

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== bookingId) {
      dispatch(fetchBookingById(bookingId))
    }
  }, [dispatch, bookingId, selectedBooking])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!selectedBooking) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Booking Confirmation</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Information</h3>
              <p className="text-blue-700">
                Your booking is currently pending payment confirmation. 
                Please complete your payment to secure your reservation.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Number:</span>
                  <span className="font-medium">{selectedBooking.booking_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Package:</span>
                  <span className="font-medium">{selectedBooking.TourPackage?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{selectedBooking.TourPackage?.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Dates:</span>
                  <span className="font-medium">{selectedBooking.start_date} to {selectedBooking.end_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">KES {selectedBooking.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{selectedBooking.status}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to={`/tours/${selectedBooking.package_id}/book`}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Complete Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}