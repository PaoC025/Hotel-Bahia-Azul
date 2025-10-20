import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './tema';
import { ReservationProvider } from './context/ReservationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReservationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ReservationProvider>
  </React.StrictMode>
);