import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, clearError } from '../../features/auth/authSlice';
import Spinner from '../../components/Spinner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    await dispatch(forgotPassword(email));
    setSubmitted(true);
  };

  // --- STYLES OBJECT ---
  const styles = {
    // Wrapper to center the card on the whole page
    pageWrapper: {
      minHeight: '100vh', // Takes up most of the screen height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6', // Light gray background like typical auth pages
      padding: '20px',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '450px',
      boxSizing: 'border-box',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 0.5rem 0',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      margin: 0,
    },
    successIconBox: {
      width: '80px',
      height: '80px',
      backgroundColor: '#dcfce7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem auto',
    },
    successIcon: {
      width: '40px',
      height: '40px',
      color: '#16a34a',
    },
    errorAlert: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      marginBottom: '1.5rem',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#111827',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      transition: 'all 0.2s',
      outline: 'none',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    button: {
      flex: 1,
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: '1px solid transparent',
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnSecondary: {
      backgroundColor: '#fff',
      borderColor: '#d1d5db',
      color: '#374151',
    },
    btnPrimary: {
      backgroundColor: '#2563eb', // Blue-600
      color: '#fff',
      borderColor: 'transparent',
    },
    linkButton: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.95rem',
      marginTop: '1.5rem',
      width: '100%',
    }
  };

  // --- SUCCESS VIEW ---
  if (submitted) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={styles.successIconBox}>
              <svg style={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 style={styles.title}>Check your email</h2>
            <p style={{ ...styles.subtitle, marginBottom: '1.5rem' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => navigate('/')}
              style={styles.linkButton}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Reset password</h2>
          <p style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={{ marginRight: '8px' }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                ...styles.button,
                ...styles.btnSecondary,
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...styles.btnPrimary,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              {loading ? <Spinner size="sm" /> : 'Send reset link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}