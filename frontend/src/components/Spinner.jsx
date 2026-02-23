// import { ClipLoader } from 'react-spinners'

// export default function Spinner({ size = 'md' }) {
//   const sizeMap = {
//     sm: 20,
//     md: 40,
//     lg: 60
//   }
  
//   return (
//     <div className="flex justify-center items-center">
//       <ClipLoader
//         size={sizeMap[size]}
//         color="#2563eb"
//         loading={true}
//       />
//     </div>
//   )
// }



import React from 'react';

/**
 * Reusable Spinner Component
 * @param {string} size - 'sm', 'md', 'lg' (default: 'md')
 * @param {string} color - Any valid CSS color (default: '#1976d2')
 * @param {string} className - Additional CSS classes
 */
export default function Spinner({ size = 'md', color = '#1976d2', className = '' }) {
  
  // Define sizes in pixels
  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: size === 'lg' ? '300px' : 'auto', // Add vertical space for large spinners
  };

  const spinnerStyle = {
    width: currentSize,
    height: currentSize,
    border: `${parseInt(currentSize) / 8}px solid rgba(0, 0, 0, 0.1)`, // Light gray track
    borderTop: `${parseInt(currentSize) / 8}px solid ${color}`, // Colored active part
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Inline Keyframes for simplicity */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={spinnerStyle} />
    </div>
  );
}