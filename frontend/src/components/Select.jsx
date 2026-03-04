// // src/components/Select.jsx
// import React from 'react';
// import ReactSelect from 'react-select';

// // Custom Styles to match your Admin Theme
// const customStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     minHeight: '42px',
//     borderColor: state.isFocused ? '#2563eb' : '#d1d5db', // Gray-300 to Primary
//     boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
//     '&:hover': {
//       borderColor: state.isFocused ? '#2563eb' : '#9ca3af',
//     },
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontFamily: 'inherit',
//     backgroundColor: '#fff',
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: '0 12px',
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: '#9ca3af', // Gray-400
//   }),
//   indicatorSeparator: (provided) => ({
//     ...provided,
//     display: 'none', // Remove the vertical line
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     paddingRight: '8px',
//     color: '#9ca3af',
//   }),
//   menu: (provided) => ({
//     ...provided,
//     borderRadius: '8px',
//     marginTop: '6px',
//     boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
//     border: '1px solid #e5e7eb',
//     zIndex: 1000,
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected 
//       ? '#2563eb' // Primary Blue
//       : state.isFocused 
//         ? '#eff6ff' // Primary Light
//         : '#fff',
//     color: state.isSelected ? '#fff' : '#374151',
//     padding: '10px 12px',
//     fontSize: '14px',
//     cursor: 'pointer',
//     ':active': {
//       backgroundColor: state.isSelected ? '#1d4ed8' : '#eff6ff',
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: '#374151', // Gray-700
//     fontWeight: '500',
//   }),
//   input: (provided) => ({
//     ...provided,
//     margin: '0',
//     padding: '0',
//     color: '#374151',
//   }),
//   noOptionsMessage: (provided) => ({
//     ...provided,
//     color: '#9ca3af',
//     padding: '12px',
//     textAlign: 'center',
//     fontSize: '13px',
//   }),
// };

// export default function Select({ options, value, onChange, placeholder, label, ...props }) {
//   return (
//     <div style={{ width: '100%', minWidth: '180px' }}>
//       {label && (
//         <label style={{
//           display: 'block',
//           fontSize: '12px',
//           fontWeight: '600',
//           color: '#4b5563',
//           marginBottom: '6px',
//           textTransform: 'uppercase',
//           letterSpacing: '0.5px'
//         }}>
//           {label}
//         </label>
//       )}
//       <ReactSelect
//         value={options.find(opt => opt.value === value)}
//         onChange={(selected) => onChange(selected ? selected.value : '')}
//         options={options}
//         placeholder={placeholder || "Select..."}
//         styles={customStyles}
//         components={{
//           IndicatorSeparator: () => null, // Remove separator
//           DropdownIndicator: (props) => (
//             <props.components.DropdownIndicator {...props}>
//               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </props.components.DropdownIndicator>
//           )
//         }}
//         {...props}
//       />
//     </div>
//   );
// }


// src/components/Select.jsx
import React from 'react';
import ReactSelect from 'react-select';

// Custom Styles to match your Admin Theme
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '42px',
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2563eb' : '#9ca3af',
    },
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    cursor: 'pointer',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  indicatorSeparator: () => ({
    display: 'none', // Remove the vertical line completely
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingRight: '8px',
    color: '#9ca3af',
    cursor: 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    marginTop: '6px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    zIndex: 1000,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#2563eb' 
      : state.isFocused 
        ? '#eff6ff' 
        : '#fff',
    color: state.isSelected ? '#fff' : '#374151',
    padding: '10px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    ':active': {
      backgroundColor: state.isSelected ? '#1d4ed8' : '#eff6ff',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151',
    fontWeight: '500',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    padding: '0',
    color: '#374151',
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#9ca3af',
    padding: '12px',
    textAlign: 'center',
    fontSize: '13px',
  }),
};

// Custom Dropdown Icon Component (Standalone)
const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </components.DropdownIndicator>
  );
};

export default function Select({ options, value, onChange, placeholder, label, isClearable = false, ...props }) {
  return (
    <div style={{ width: '100%', minWidth: '180px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#4b5563',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </label>
      )}
      <ReactSelect
        value={options ? options.find(opt => opt.value === value) : null}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        options={options || []}
        placeholder={placeholder || "Select..."}
        styles={customStyles}
        isClearable={isClearable}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: CustomDropdownIndicator,
        }}
        {...props}
      />
    </div>
  );
}

// Import components from react-select at the top level to avoid scope issues
import { components } from 'react-select';