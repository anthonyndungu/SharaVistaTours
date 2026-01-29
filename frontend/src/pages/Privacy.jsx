import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Introduction</h2>
            <p className="text-gray-600">
              TravelEase ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Information We Collect</h2>
            <p className="text-gray-600">
              <strong>Personal Information:</strong> When you create an account or make a booking, we collect personal information including your name, email address, phone number, date of birth, passport information, and payment details.
            </p>
            <p className="text-gray-600">
              <strong>Booking Information:</strong> Details about your travel preferences, tour selections, special requests, and travel companions.
            </p>
            <p className="text-gray-600">
              <strong>Technical Information:</strong> IP address, browser type, operating system, pages visited, and other technical data collected through cookies and similar technologies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">3. How We Use Your Information</h2>
            <p className="text-gray-600">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Process and manage your bookings and payments</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Send booking confirmations, updates, and travel information</li>
              <li>Improve our services and website functionality</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-600">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Service Providers:</strong> Payment processors, email service providers, and other third-party vendors who help us operate our business</li>
              <li><strong>Tour Operators:</strong> Local guides, accommodation providers, and transportation companies necessary to fulfill your booking</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights, safety, or property</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Your Rights</h2>
            <p className="text-gray-600">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent (where processing is based on consent)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Cookies and Tracking</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser, but disabling cookies may affect website functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">9. Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated revision date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">11. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: <Link to="mailto:privacy@travelease.com" className="text-primary-600 hover:text-primary-800">privacy@travelease.com</Link><br/>
              Phone: <Link to="tel:+254712345678" className="text-primary-600 hover:text-primary-800">+254 712 345 678</Link><br/>
              Address: Nairobi, Kenya
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              By using our services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}