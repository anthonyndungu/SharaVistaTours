// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#f44336' },
    background: { default: '#f5f5f5', paper: '#fff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    body1: {
      fontSize: '0.95rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    // Make all TextFields have consistent responsive behavior
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    // Make all Grid containers responsive by default
    MuiGrid: {
      defaultProps: {
        container: false,
        item: false,
      },
    },
    // Style buttons for mobile-first
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          minWidth: '120px',
          '@media (max-width:600px)': {
            width: '100%',
            minWidth: 'auto',
          },
        },
      },
    },
    // Card styling for consistency
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (min-width:600px)': {
            padding: '24px',
          },
        },
      },
    },
  },
});

export default theme;