import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPackageById } from '../features/packages/packageSlice'
import { StarIcon } from '@heroicons/react/24/solid'
import { calculateAverageRating, formatCurrency } from '../utils/helpers'
import Spinner from '../components/Spinner'

export default function PackageDetails() {
  const { packageId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedPackage, loading, error } = useSelector((state) => state.packages)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    dispatch(fetchPackageById(packageId))
  }, [dispatch, packageId])

  if (loading) return <Spinner />
  if (error) return <div className="container py-12 text-center text-red-500">{error}</div>
  if (!selectedPackage) return <div className="container py-12 text-center">Package not found</div>

  const averageRating = calculateAverageRating(selectedPackage.reviews || [])
  const images = selectedPackage.images || []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-primary-600"
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button 
                onClick={() => navigate('/tours')}
                className="hover:text-primary-600"
              >
                Tours
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{selectedPackage.title}</li>
          </ol>
        </nav>

        {/* Package Header */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPackage.title}</h1>
              <p className="text-gray-600 text-lg">{selectedPackage.destination}</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-2 text-lg font-medium">
                {averageRating.toFixed(1)} ({selectedPackage.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Package Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {images.length > 0 ? (
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={images[activeImageIndex]?.url || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={selectedPackage.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${selectedPackage.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Package Info */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adult:</span>
                    <span className="font-medium">{formatCurrency(selectedPackage.price_adult)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Child:</span>
                    <span className="font-medium">{formatCurrency(selectedPackage.price_child)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedPackage.duration_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{selectedPackage.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Capacity:</span>
                    <span className="font-medium">{selectedPackage.max_capacity} people</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/tours/${packageId}/book`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Book This Tour
              </button>
            </div>
          </div>
        </div>

        {/* Package Description */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {selectedPackage.description}
          </p>
        </div>

        {/* Inclusions & Exclusions */}
        {(selectedPackage.inclusions || selectedPackage.exclusions) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {selectedPackage.inclusions && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {selectedPackage.inclusions.split('\n').map((item, index) => (
                    item.trim() && (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-600">{item.trim()}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {selectedPackage.exclusions && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                <ul className="space-y-2">
                  {selectedPackage.exclusions.split('\n').map((item, index) => (
                    item.trim() && (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="text-gray-600">{item.trim()}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Itinerary */}
        {selectedPackage.itinerary && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap text-gray-600 font-sans">
                {selectedPackage.itinerary}
              </pre>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {selectedPackage.reviews && selectedPackage.reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews ({selectedPackage.reviews.length})</h2>
            <div className="space-y-6">
              {selectedPackage.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-gray-700 font-medium">
                          {review.User?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.User?.name || 'Anonymous'}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.is_verified_booking && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified Booking
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}