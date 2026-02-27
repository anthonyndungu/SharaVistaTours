import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

import { store } from './app/store.js'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';


// Create a cache with a higher precedence key (e.g., 'mui')
const cache = createCache({
  key: 'mui',
  prepend: true, // This forces MUI styles to be injected BEFORE global CSS
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CacheProvider value={cache}>
            <CssBaseline /> {/* Resets browser defaults */}
            <Router>
              <App />
            </Router>
          </CacheProvider>
        </ThemeProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)