import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go back home
          </Link>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Or try one of these popular pages:
          </p>
          <div className="mt-4 space-y-2">
            <Link to="/tours" className="block text-primary-600 hover:text-primary-700">
              Browse Tour Packages
            </Link>
            <Link to="/contact" className="block text-primary-600 hover:text-primary-700">
              Contact Us
            </Link>
            <Link to="/" className="block text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}