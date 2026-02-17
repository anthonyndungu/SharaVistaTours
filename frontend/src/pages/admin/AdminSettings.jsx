// src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import Spinner from '../../components/Spinner';

const COLORS = {
  primary: '#1976d2',
  text: '#000',
  textSecondary: '#555',
  background: '#fff',
  border: '#e0e0e0',
  cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Mock settings state
  const [settings, setSettings] = useState({
    siteName: 'SharaVista Tours',
    siteEmail: 'info@sharavistatours.com',
    contactPhone: '+254 769 859 091',
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    allowBookings: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'admin@sharavistatours.com'
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saved settings:', settings);
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'email', name: 'Email' },
    { id: 'payment', name: 'Payment' },
    { id: 'security', name: 'Security' }
  ];

  return (
    <div>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: '24px'
      }}>
        System Settings
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.border}`,
        marginBottom: '24px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? COLORS.primary : COLORS.textSecondary,
              fontWeight: activeTab === tab.id ? '700' : 'normal',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {tab.name}
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute',
                bottom: '-1px',
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: COLORS.primary
              }}></div>
            )}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div style={{
        backgroundColor: COLORS.background,
        borderRadius: '8px',
        boxShadow: COLORS.cardShadow,
        padding: '24px'
      }}>
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                Contact Email
              </label>
              <input
                type="email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                Default Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: '600', color: COLORS.text }}>
                <input
                  type="checkbox"
                  name="allowBookings"
                  checked={settings.allowBookings}
                  onChange={handleInputChange}
                  style={{ marginRight: '10px' }}
                />
                Allow New Bookings
              </label>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                SMTP Host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUser"
                value={settings.smtpUser}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COLORS.text }}>
                SMTP Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.textSecondary }}>
            Payment gateway settings will be available soon.
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.textSecondary }}>
            Security settings will be available soon.
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              backgroundColor: COLORS.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.8 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}