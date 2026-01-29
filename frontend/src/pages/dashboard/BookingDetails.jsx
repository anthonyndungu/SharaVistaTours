import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBookingById } from '../../features/bookings/bookingSlice'
import { cancelBooking } from '../../features/bookings/bookingSlice'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Spinner from '../../components/Spinner'

export default function BookingDetails() {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  
  const { selectedBooking, loading, error } = useSelector(state => state.bookings)

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== bookingId) {
      dispatch(fetchBookingById(bookingId))
    }
  }, [dispatch, bookingId, selectedBooking])

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      await dispatch(cancelBooking(bookingId))
      // Refresh booking details
      dispatch(fetchBookingById(bookingId))
    }
  }

  if (loading) return <div className="py-12"><Spinner /></div>
  if (error) return <div className="py-12 text-red-500 text-center">{error}</div>
  if (!selectedBooking) return <div className="py-12 text-center">Booking not found</div>

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link
          to="/dashboard/bookings"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to My Bookings
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Booking Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600 mt-1">Booking #{selectedBooking.booking_number}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                selectedBooking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedBooking.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tour Package Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tour Package</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedBooking.TourPackage?.title}</h3>
              <p className="text-gray-600">{selectedBooking.TourPackage?.destination}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  {selectedBooking.TourPackage?.duration_days} days
                </span>
                <span className="text-sm text-gray-500">
                  {selectedBooking.TourPackage?.category}
                </span>
              </div>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-lg font-medium text-gray-900">{selectedBooking.start_date}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-lg font-medium text-gray-900">{selectedBooking.end_date}</p>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Passengers ({selectedBooking.BookingPassengers?.length || 0})</h2>
            <div className="space-y-3">
              {selectedBooking.BookingPassengers?.map((passenger, index) => (
                <div key={passenger.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{passenger.name}</h3>
                      <p className="text-sm text-gray-600">{passenger.email}</p>
                      <p className="text-sm text-gray-600">{passenger.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Age: {passenger.age}</p>
                      {passenger.passport_number && (
                        <p className="text-sm text-gray-600">Passport: {passenger.passport_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          {selectedBooking.special_requests && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">{selectedBooking.special_requests}</p>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-gray-900">KES {selectedBooking.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${
                  selectedBooking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {selectedBooking.payment_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {selectedBooking.Payment && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium text-gray-900 capitalize">{selectedBooking.Payment.payment_method}</span>
                </div>
                {selectedBooking.Payment.transaction_id && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-900">{selectedBooking.Payment.transaction_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {selectedBooking.status === 'pending' && (
              <button
                onClick={handleCancelBooking}
                className="flex-1 px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}
            
            {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
              <Link
                to={`/tours/${selectedBooking.package_id}/book`}
                className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Modify Booking
              </Link>
            )}
            
            <Link
              to="/contact"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}