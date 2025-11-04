// components/ConnectionStatus.jsx - VERSIÓN MEJORADA
import { Snackbar, Alert, Box, Typography, Chip, LinearProgress, Button } from '@mui/material';
import { Wifi, WifiOff, CloudSync, Refresh, SignalWifiOff } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { isOnline, refreshData, lastSync } = useAppContext();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setOpen(true);
      setRetryCount(0);
      // Intentar sincronizar automáticamente
      setTimeout(() => {
        refreshData();
      }, 1000);
    };

    const handleOffline = () => {
      setOnline(false);
      setOpen(true);
      setRetryCount(prev => prev + 1);
    };

    // Verificar conexión periódicamente
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        if (!response.ok) throw new Error('Server error');
        setOnline(true);
      } catch (error) {
        setOnline(false);
        setOpen(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [refreshData]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleRetry = () => {
    refreshData();
    setOpen(false);
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const getSyncStatus = () => {
    if (!lastSync) return 'Nunca';
    const now = new Date();
    const last = new Date(lastSync);
    const diffMinutes = Math.floor((now - last) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hace unos segundos';
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    return `Hace ${Math.floor(diffMinutes / 60)} h`;
  };

  return (
    <>
      {/* Badge en esquina con más información */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1
        }}
      >
        {/* Estado de conexión */}
        <Chip
          icon={online ? <Wifi /> : <WifiOff />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">
                {online ? 'En línea' : 'Sin conexión'}
              </Typography>
              {!online && retryCount > 0 && (
                <Typography variant="caption" color="error">
                  ({retryCount})
                </Typography>
              )}
            </Box>
          }
          color={online ? 'success' : 'error'}
          variant="outlined"
          size="small"
          onClick={handleShowDetails}
          clickable
        />

        {/* Progreso de sincronización cuando está online */}
        {online && (
          <Chip
            icon={<CloudSync />}
            label={getSyncStatus()}
            color="primary"
            variant="outlined"
            size="small"
            onClick={handleRetry}
            clickable
          />
        )}
      </Box>

      {/* Notificación principal */}
      <Snackbar
        open={open}
        autoHideDuration={online ? 4000 : 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleClose}
          severity={online ? 'success' : 'warning'}
          icon={online ? <CloudSync /> : <SignalWifiOff />}
          action={
            !online ? (
              <Button color="inherit" size="small" onClick={handleRetry}>
                Reintentar
              </Button>
            ) : null
          }
          sx={{ 
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {online ? 'Conexión restaurada' : 'Sin conexión a internet'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
              {online ? 'Sincronizando datos...' : 'Algunas funciones pueden no estar disponibles'}
            </Typography>
            
            {/* Barra de progreso para reconexión */}
            {!online && retryCount > 2 && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(retryCount % 5) * 20} 
                  color="warning"
                />
              </Box>
            )}
          </Box>
        </Alert>
      </Snackbar>

      {/* Panel de detalles (expandible) */}
      <Snackbar
        open={showDetails}
        autoHideDuration={null}
        onClose={() => setShowDetails(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: 80 }}
      >
        <Alert 
          severity="info"
          onClose={() => setShowDetails(false)}
          sx={{ width: 300 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Estado del Sistema
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Conexión:</Typography>
              <Chip 
                label={online ? 'En línea' : 'Offline'} 
                size="small" 
                color={online ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Última sync:</Typography>
              <Typography variant="caption" fontWeight="medium">
                {getSyncStatus()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Reintentos:</Typography>
              <Typography variant="caption" fontWeight="medium">
                {retryCount}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              startIcon={<Refresh />}
              onClick={handleRetry}
              disabled={!online}
            >
              Sincronizar
            </Button>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}