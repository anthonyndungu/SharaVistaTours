import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Introduction</h2>
            <p className="text-gray-600">
              Welcome to TravelEase! These terms and conditions outline the rules and regulations for the use of TravelEase's Website and Services.
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use TravelEase if you do not agree to all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Intellectual Property</h2>
            <p className="text-gray-600">
              Unless otherwise stated, TravelEase and/or its licensors own the intellectual property rights for all material on TravelEase. 
              All intellectual property rights are reserved. You may access this from TravelEase for your own personal use subjected to restrictions set in these terms and conditions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Booking and Payments</h2>
            <p className="text-gray-600">
              All bookings are subject to availability and confirmation. Prices are subject to change without notice. 
              Full payment is required at the time of booking unless otherwise specified. Cancellation policies vary by tour package and will be clearly stated during the booking process.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Cancellation Policy</h2>
            <p className="text-gray-600">
              <strong>Cancellations made more than 30 days before departure:</strong> Full refund minus a 10% administrative fee.<br/>
              <strong>Cancellations made 15-30 days before departure:</strong> 50% refund.<br/>
              <strong>Cancellations made less than 15 days before departure:</strong> No refund.<br/>
              <strong>No-shows:</strong> No refund.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">5. User Responsibilities</h2>
            <p className="text-gray-600">
              You agree to provide accurate and complete information when making a booking. You are responsible for ensuring you have all necessary travel documents, visas, and vaccinations required for your destination. 
              TravelEase is not responsible for any expenses, losses, or damages incurred due to lack of proper documentation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Limitation of Liability</h2>
            <p className="text-gray-600">
              TravelEase shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses, resulting from your use of our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Changes to Terms</h2>
            <p className="text-gray-600">
              TravelEase reserves the right to modify these terms at any time. We will always post the most current version on our website. 
              By continuing to use the website after any modifications, you agree to be bound by the modified terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Governing Law</h2>
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">9. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: <Link to="mailto:info@travelease.com" className="text-primary-600 hover:text-primary-800">info@travelease.com</Link><br/>
              Phone: <Link to="tel:+254712345678" className="text-primary-600 hover:text-primary-800">+254 712 345 678</Link>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}