// Generate unique booking number
export const generateBookingNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear().toString().slice(-2);
  return `BK${year}${timestamp}${random}`;
};

// Format currency
export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate days between dates
export const calculateDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Validate Kenyan phone number
export const isValidKenyanPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  const digits = phoneNumber.replace(/\D/g, '');
  return /^(2547|2541|07|01)\d{7,8}$/.test(digits);
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.startsWith('254')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  
  if (digits.startsWith('0')) {
    return `+254 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  
  return phoneNumber;
};

// Calculate package price
export const calculatePackagePrice = (packageData, startDate, endDate, passengers) => {
  const days = calculateDaysBetweenDates(startDate, endDate);
  const adultCount = passengers.filter(p => p.age >= 18).length;
  const childCount = passengers.filter(p => p.age < 18).length;
  
  return (adultCount * packageData.price_adult + childCount * packageData.price_child) * days;
};