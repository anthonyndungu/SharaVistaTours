import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPackageById } from '../../features/packages/packageSlice'
import { createBooking } from '../../features/bookings/bookingSlice'
import { createMPESAPayment } from '../../features/payments/paymentSlice'
import { format } from 'date-fns'
import Spinner from '../../components/Spinner'

export default function BookingForm() {
  const { packageId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { selectedPackage, loading: pkgLoading } = useSelector(state => state.packages)
  const { creating: bookingCreating, error: bookingError } = useSelector(state => state.bookings)
  const { creating: paymentCreating } = useSelector(state => state.payments)
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    passengers: [{ name: '', email: '', phone: '', age: '', passportNumber: '', nationality: 'Kenyan' }],
    specialRequests: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')
  
  useEffect(() => {
    if (!selectedPackage || selectedPackage.id !== packageId) {
     dispatch(fetchPackageById(packageId))
    }
  }, [dispatch, packageId, selectedPackage])

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...formData.passengers]
    newPassengers[index][field] = value
    setFormData(prev => ({ ...prev, passengers: newPassengers }))
  }

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      passengers: [...prev.passengers, { name: '', email: '', phone: '', age: '', passportNumber: '', nationality: 'Kenyan' }]
    }))
  }

  const removePassenger = (index) => {
    if (formData.passengers.length > 1) {
      const newPassengers = formData.passengers.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, passengers: newPassengers }))
    }
  }

  const calculateTotal = () => {
    if (!selectedPackage || !formData.startDate || !formData.endDate) return 0
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    
    const adultCount = formData.passengers.filter(p => p.age >= 18).length
    const childCount = formData.passengers.filter(p => p.age < 18).length
    
    return (adultCount * selectedPackage.price_adult + childCount * selectedPackage.price_child) * days
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (paymentMethod === 'mpesa' && !/^(07|01|2547|2541)\d{7,8}$/.test(mpesaPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid Kenyan phone number')
      return
    }
    
    const bookingData = {
      package_id: packageId,
      start_date: formData.startDate,
      end_date: formData.endDate,
      passengers: formData.passengers.map(p => ({
        name: p.name,
        email: p.email,
        phone: p.phone,
        age: parseInt(p.age) || 0,
        passport_number: p.passportNumber,
        nationality: p.nationality
      })),
      special_requests: formData.specialRequests,
      total_amount: calculateTotal()
    }
    
    try {
      const bookingResult = await dispatch(createBooking(bookingData))
      
      if (createBooking.fulfilled.match(bookingResult)) {
        const bookingId = bookingResult.payload.data.booking.id
        const bookingNumber = bookingResult.payload.data.booking.booking_number
        
        if (paymentMethod === 'mpesa') {
          const paymentResult = await dispatch(createMPESAPayment({
            booking_id: bookingId,
            phone_number: mpesaPhone,
            amount: calculateTotal(),
            account_reference: bookingNumber
          }))
          
          if (createMPESAPayment.fulfilled.match(paymentResult)) {
            navigate(`/booking/${bookingId}/success`)
          }
        } else {
          navigate(`/booking/${bookingId}/success`)
        }
      }
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  if (pkgLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!selectedPackage) return <div className="min-h-screen flex items-center justify-center">Package not found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3">
              <img 
                className="h-56 w-full object-cover md:h-full md:w-full" 
                src={selectedPackage.images?.find(img => img.is_primary)?.url || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                alt={selectedPackage.title}
              />
            </div>
            <div className="p-8 md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPackage.title}</h2>
              <p className="mt-2 text-gray-600">{selectedPackage.destination} • {selectedPackage.duration_days} days</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-primary-600">KES {selectedPackage.price_adult.toLocaleString()}</span>
                <span className="ml-2 text-gray-600">/ adult per day</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Passenger Details</h4>
                <button
                  type="button"
                  onClick={addPassenger}
                  className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                >
                  + Add Passenger
                </button>
              </div>
              
              {formData.passengers.map((passenger, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                  {formData.passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={passenger.passportNumber}
                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="Kenyan"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Dietary requirements, accessibility needs, etc."
              />
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-primary-600"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">MPESA Mobile Money</div>
                    <div className="text-sm text-gray-600">Pay with your Safaricom MPESA account</div>
                  </div>
                </label>
                
                {paymentMethod === 'mpesa' && (
                  <div className="ml-8 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MPESA Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        +254
                      </span>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="712345678"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Enter your Safaricom number without the leading zero</p>
                  </div>
                )}
                
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-primary-600"
                    disabled
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, American Express (Coming soon)</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary-600">KES {calculateTotal().toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Price includes all taxes and fees. No hidden charges.
              </p>
            </div>
            
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {bookingError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={bookingCreating || paymentCreating}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {bookingCreating || paymentCreating ? (
                <>
                  <Spinner size="sm" />
                  Processing Payment...
                </>
              ) : (
                'Confirm Booking & Pay'
              )}
            </button>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              By confirming your booking, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-800">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-800">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}