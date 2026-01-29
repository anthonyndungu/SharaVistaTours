import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchPackageReviews } from '../features/reviews/reviewSlice'
import ReviewCard from '../components/ReviewCard'
import Spinner from '../components/Spinner'

export default function PackageReviews() {
  const { packageId } = useParams()
  const dispatch = useDispatch()
  const { reviews, loading, error } = useSelector((state) => state.reviews)

  useEffect(() => {
    dispatch(fetchPackageReviews(packageId))
  }, [dispatch, packageId])

  if (loading) return <Spinner />

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to review this package!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}