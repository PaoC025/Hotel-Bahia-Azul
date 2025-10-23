import { Snackbar, Alert, Box, Typography, Chip } from '@mui/material';
import { Wifi, WifiOff, CloudSync } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);
  const { isOnline } = useAppContext();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setOpen(true);
    };

    const handleOffline = () => {
      setOnline(false);
      setOpen(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Badge en esquina */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Chip
          icon={online ? <Wifi /> : <WifiOff />}
          label={online ? 'En línea' : 'Sin conexión'}
          color={online ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Notificación */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleClose}
          severity={online ? 'success' : 'warning'}
          icon={online ? <CloudSync /> : <WifiOff />}
        >
          {online ? 'Conexión restaurada - Sincronizando datos' : 'Sin conexión - Modo offline'}
        </Alert>
      </Snackbar>
    </>
  );
}