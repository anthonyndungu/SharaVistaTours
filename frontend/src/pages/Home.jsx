import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedPackages, fetchPackages } from '../features/packages/packageSlice'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import PackageCard from '../components/PackageCard'
import Testimonials from '../components/Testimonials'
import Stats from '../components/Stats'
import Spinner from '../components/Spinner'

export default function Home() {
  const dispatch = useDispatch()
  const { featuredPackages, loading: featuredLoading, error: featuredError } = useSelector((state) => state.packages)
  const { packages: allPackages, loading: allLoading } = useSelector((state) => state.packages)

  useEffect(() => {
    dispatch(fetchFeaturedPackages())
    dispatch(fetchPackages())
  }, [dispatch])

  const stats = [
    { id: 1, name: 'Destinations', value: '50+' },
    { id: 2, name: 'Happy Travelers', value: '10K+' },
    { id: 3, name: 'Tour Packages', value: '200+' },
    { id: 4, name: 'Years Experience', value: '10+' },
  ]

  if (featuredLoading && !featuredPackages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-900 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            
            <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-28">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Discover the World's</span>
                    <span className="block text-primary-400">Most Beautiful Destinations</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Experience unforgettable journeys with our expertly crafted tour packages. From adventure to relaxation, we have the perfect travel experience for you.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link to="/tours" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                        Explore Tours
                        <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link to="/contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" alt="Travel destinations collage" />
        </div>
      </div>
      
      {/* Stats Section */}
      <Stats stats={stats} />
      
      {/* Featured Packages */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Tour Packages
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Handpicked experiences for the most discerning travelers
            </p>
          </div>
          
          {featuredError && (
            <div className="text-center text-red-500 py-4">
              {featuredError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/tours" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-lg">
              View All Tours
              <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Popular Destinations */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Popular Destinations
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Discover our most sought-after travel destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Maasai Mara Safari', 'Malindi Beach Getaway', 'Mount Kenya Adventure', 'Lamu Island Cultural Tour'].map((destination, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={`https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80&${index}`}
                  alt={destination}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{destination}</h3>
                    <button className="mt-4 bg-white text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="container py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
              Book your next adventure today and experience the world like never before.
            </p>
            <div className="mt-8">
              <Link to="/tours" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
                Book Now
                <ArrowRightIcon className="ml-2 h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}