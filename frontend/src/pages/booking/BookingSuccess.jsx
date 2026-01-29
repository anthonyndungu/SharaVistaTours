import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBookingById } from '../../features/bookings/bookingSlice'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner'

export default function BookingSuccess() {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
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
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
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
          
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to your registered email address. 
            Please check your inbox for important travel information.
          </p>
          
          <div className="space-y-4">
            <Link
              to={`/dashboard/bookings/${bookingId}`}
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Booking Details
            </Link>
            
            <Link
              to="/tours"
              className="block w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Browse More Tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}