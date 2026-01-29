// Calculate average rating from reviews
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return total / reviews.length
}

// Format currency
export function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format date
export function formatDate(dateString, formatType = 'full') {
  const date = new Date(dateString)
  
  if (formatType === 'full') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (formatType === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  return date.toLocaleDateString('en-US')
}

// Calculate days between dates
export function calculateDaysBetweenDates(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
}

// Format phone number
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '')
  
  // Format as +254 712 345 678
  if (digits.startsWith('254')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
  }
  
  // Format as +254 712 345 678 if it starts with 07 or 01
  if (digits.startsWith('0')) {
    return `+254 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  
  return phoneNumber
}

// Validate Kenyan phone number
export function isValidKenyanPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '')
  
  // Check if it's a valid Kenyan number
  return /^(2547|2541|07|01)\d{7,8}$/.test(digits)
}

// Generate booking number
export function generateBookingNumber() {
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `BK${timestamp}${random}`
}

// Get category color
export function getCategoryColor(category) {
  const colors = {
    adventure: 'bg-orange-100 text-orange-800',
    cultural: 'bg-purple-100 text-purple-800',
    beach: 'bg-blue-100 text-blue-800',
    wildlife: 'bg-green-100 text-green-800',
    luxury: 'bg-yellow-100 text-yellow-800',
    budget: 'bg-gray-100 text-gray-800'
  }
  
  return colors[category] || colors.adventure
}