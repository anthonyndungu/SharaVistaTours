import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPackageById, createPackage, updatePackage, clearSelectedPackage } from '../../features/packages/packageSlice'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import Spinner from '../../components/Spinner'

export default function PackageForm() {
  const { packageId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { selectedPackage, loading, error, successMessage } = useSelector((state) => state.packages)
  const isEditing = !!packageId

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration_days: 1,
    category: 'adventure',
    price_adult: 0,
    price_child: 0,
    max_capacity: 20,
    is_featured: false,
    status: 'published',
    inclusions: '',
    exclusions: '',
    itinerary: ''
  })
  
  const [images, setImages] = useState([
    { url: '', is_primary: true, caption: '' }
  ])

  useEffect(() => {
    if (isEditing && (!selectedPackage || selectedPackage.id !== packageId)) {
      dispatch(fetchPackageById(packageId))
    }
    
    return () => {
      if (isEditing) {
        dispatch(clearSelectedPackage())
      }
    }
  }, [dispatch, packageId, selectedPackage, isEditing])

  useEffect(() => {
    if (selectedPackage && isEditing) {
      setFormData({
        title: selectedPackage.title || '',
        description: selectedPackage.description || '',
        destination: selectedPackage.destination || '',
        duration_days: selectedPackage.duration_days || 1,
        category: selectedPackage.category || 'adventure',
        price_adult: selectedPackage.price_adult || 0,
        price_child: selectedPackage.price_child || 0,
        max_capacity: selectedPackage.max_capacity || 20,
        is_featured: selectedPackage.is_featured || false,
        status: selectedPackage.status || 'published',
        inclusions: selectedPackage.inclusions || '',
        exclusions: selectedPackage.exclusions || '',
        itinerary: selectedPackage.itinerary || ''
      })
      
      if (selectedPackage.images && selectedPackage.images.length > 0) {
        setImages(selectedPackage.images.map(img => ({
          url: img.url,
          is_primary: img.is_primary,
          caption: img.caption || ''
        })))
      }
    }
  }, [selectedPackage, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (index, field, value) => {
    const newImages = [...images]
    newImages[index][field] = value
    setImages(newImages)
  }

  const addImage = () => {
    setImages([...images, { url: '', is_primary: false, caption: '' }])
  }

  const removeImage = (index) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index)
      // Ensure at least one primary image
      if (newImages.length > 0 && !newImages.some(img => img.is_primary)) {
        newImages[0].is_primary = true
      }
      setImages(newImages)
    }
  }

  const setPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }))
    setImages(newImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const packageData = {
      ...formData,
      price_adult: parseFloat(formData.price_adult),
      price_child: parseFloat(formData.price_child),
      duration_days: parseInt(formData.duration_days),
      max_capacity: parseInt(formData.max_capacity)
    }
    
    if (images.some(img => img.url.trim())) {
      packageData.images = images.filter(img => img.url.trim()).map(img => ({
        url: img.url.trim(),
        is_primary: img.is_primary,
        caption: img.caption.trim()
      }))
    }
    
    if (isEditing) {
      await dispatch(updatePackage({ id: packageId, packageData }))
    } else {
      await dispatch(createPackage(packageData))
    }
    
    navigate('/admin/packages')
  }

  if (isEditing && loading && !selectedPackage) {
    return <div className="py-12"><Spinner /></div>
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {isEditing ? 'Edit Tour Package' : 'Create New Tour Package'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Package Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination *
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  min="1"
                  max="365"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="beach">Beach</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="luxury">Luxury</option>
                  <option value="budget">Budget</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price_adult" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Adult) *
                </label>
                <input
                  type="number"
                  id="price_adult"
                  name="price_adult"
                  min="0"
                  step="0.01"
                  value={formData.price_adult}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="price_child" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Child)
                </label>
                <input
                  type="number"
                  id="price_child"
                  name="price_child"
                  min="0"
                  step="0.01"
                  value={formData.price_child}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Capacity
                </label>
                <input
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  min="1"
                  max="100"
                  value={formData.max_capacity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Featured Package
              </label>
            </div>
          </div>

          {/* Right Column - Images and Details */}
          <div className="space-y-6">
            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Package Images
                </label>
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Image
                </button>
              </div>
              
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={image.is_primary}
                        onChange={() => setPrimaryImage(index)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Primary Image</label>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Image Caption"
                        value={image.caption}
                        onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <label htmlFor="inclusions" className="block text-sm font-medium text-gray-700 mb-1">
                What's Included
              </label>
              <textarea
                id="inclusions"
                name="inclusions"
                rows="3"
                value={formData.inclusions}
                onChange={handleChange}
                placeholder="List items separated by line breaks..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Exclusions */}
            <div>
              <label htmlFor="exclusions" className="block text-sm font-medium text-gray-700 mb-1">
                What's Not Included
              </label>
              <textarea
                id="exclusions"
                name="exclusions"
                rows="3"
                value={formData.exclusions}
                onChange={handleChange}
                placeholder="List items separated by line breaks..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Itinerary */}
            <div>
              <label htmlFor="itinerary" className="block text-sm font-medium text-gray-700 mb-1">
                Itinerary
              </label>
              <textarea
                id="itinerary"
                name="itinerary"
                rows="4"
                value={formData.itinerary}
                onChange={handleChange}
                placeholder="Day-by-day itinerary..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/packages')}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            {isEditing ? 'Update Package' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  )
}