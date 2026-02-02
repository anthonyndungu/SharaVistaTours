import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPackages } from '../features/packages/packageSlice'
import PackageCard from '../components/PackageCard'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Spinner from '../components/Spinner'

export default function PackageList() {
  const dispatch = useDispatch()
  const { data: packages, loading, error } = useSelector((state) => state.packages)
  console.log(packages) 

  useEffect(() => {
    dispatch(fetchPackages())
  }, [dispatch])

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Tour Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our curated collection of unforgettable travel experiences
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No packages available</h3>
            <p className="text-gray-600">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/contact" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-lg"
          >
            Can't find what you're looking for?
            <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}