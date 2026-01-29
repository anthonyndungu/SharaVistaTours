import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { formatDate } from '../utils/helpers'

export default function ReviewCard({ review, onEdit, onDelete, canEdit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxCommentLength = 150

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-gray-700 font-medium">
              {review.User?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.User?.name || 'Anonymous'}</h4>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {review.is_verified_booking && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                    Verified Booking
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-3 text-gray-600">
        {review.comment.length > maxCommentLength && !isExpanded ? (
          <>
            {review.comment.substring(0, maxCommentLength)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Read more
            </button>
          </>
        ) : (
          <>
            {review.comment}
            {review.comment.length > maxCommentLength && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                Show less
              </button>
            )}
          </>
        )}
      </p>
      
      <p className="mt-2 text-sm text-gray-500">
        {formatDate(review.created_at, 'short')}
      </p>
    </div>
  )
}