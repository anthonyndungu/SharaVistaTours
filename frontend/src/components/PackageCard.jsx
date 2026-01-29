import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import { calculateAverageRating } from '../utils/helpers'

export default function PackageCard({ pkg }) {
  const [isHovered, setHovered] = useState(false)
  const averageRating = calculateAverageRating(pkg.reviews || [])

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-56 overflow-hidden">
        {pkg.images && pkg.images.length > 0 ? (
          <img
            src={pkg.images.find(img => img.is_primary)?.url || pkg.images[0].url}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        
        {pkg.is_featured && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)} ({pkg.reviews?.length || 0})
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-2xl font-bold text-primary-600">KES {pkg.price_adult.toLocaleString()}</p>
            <span className="text-xs text-gray-500">per adult</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Duration</span>
            <p className="font-semibold text-gray-900">{pkg.duration_days} days</p>
            <span className="text-xs text-gray-500">{pkg.category}</span>
          </div>
        </div>
        
        <Link
          to={`/tours/${pkg.id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span>View Details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  )
}