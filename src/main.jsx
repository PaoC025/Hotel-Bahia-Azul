import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './tema';
import { ReservationProvider } from './context/ReservationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Aquí el BrowserRouter envuelve a toda la app */}
    <BrowserRouter>
      <ReservationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ReservationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
