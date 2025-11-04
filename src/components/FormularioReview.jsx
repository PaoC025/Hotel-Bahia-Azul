import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, Star, Login } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/Axios';

const FormularioReview = ({ habitacionId, open, onClose, onReviewAgregada }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    calificacion: 0,
    comentario: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🔽 RESETEAR ESTADOS CUANDO SE ABRE/CIERRA EL MODAL
  useEffect(() => {
    if (open) {
      setFormData({
        calificacion: 0,
        comentario: ''
      });
      setError('');
      setSuccess('');
    }
  }, [open]);

  const manejarCambio = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const manejarEnviar = async () => {
    // 🔽 VERIFICACIÓN MÁS ROBUSTA DE AUTENTICACIÓN
    if (!isAuthenticated || !user) {
      console.log('❌ Usuario no autenticado, redirigiendo a login...');
      onClose(); // Cerrar modal primero
      navigate('/login', { 
        state: { from: 'review', habitacionId } 
      });
      return;
    }

    // Validaciones
    if (!formData.comentario.trim()) {
      setError('El comentario es obligatorio');
      return;
    }

    if (formData.calificacion === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (formData.comentario.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    if (formData.comentario.length > 500) {
      setError('El comentario no puede exceder los 500 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const reviewData = {
        habitacion: habitacionId,
        calificacion: formData.calificacion,
        comentario: formData.comentario.trim()
      };

      console.log('📤 Enviando review:', reviewData);
      
      const response = await api.post('/reviews', reviewData);
      console.log('✅ Review enviada exitosamente:', response.data);

      setSuccess('¡Gracias por tu reseña! Tu opinión ayuda a otros viajeros.');
      
      // Limpiar formulario
      setFormData({
        calificacion: 0,
        comentario: ''
      });

      // Notificar al componente padre
      if (onReviewAgregada) {
        onReviewAgregada();
      }

      // Cerrar modal después de éxito
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (err) {
      console.error('❌ Error enviando review:', err);
      
      // 🔽 MANEJO MEJORADO DE ERRORES
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        setTimeout(() => {
          onClose();
          navigate('/login');
        }, 3000);
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Error en los datos enviados');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Error de conexión. Por favor verifica tu internet.');
      } else {
        setError('Error al enviar la reseña. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">
          {isAuthenticated ? 'Escribe tu Reseña' : 'Inicia Sesión para Reseñar'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!isAuthenticated ? (
          // 🔽 MEJORADO: Mensaje para usuarios no autenticados
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Login sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Inicia Sesión para Reseñar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Debes tener una cuenta para poder dejar una reseña sobre esta habitación.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onClose(); // 🔽 CERRAR PRIMERO EL MODAL
                navigate('/login', { 
                  state: { from: 'review', habitacionId } 
                });
              }}
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
                fontWeight: 600
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        ) : (
          // 🔽 FORMULARIO PARA USUARIOS AUTENTICADOS
          <Box sx={{ mt: 2 }}>
            {/* Información del usuario */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Reseñando como:
              </Typography>
              <Typography variant="body1">
                {user.nombre || user.email}
              </Typography>
            </Box>

            {/* Calificación con Estrellas */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Tu Calificación *
              </Typography>
              <Rating
                value={formData.calificacion}
                onChange={(event, newValue) => {
                  manejarCambio('calificacion', newValue);
                }}
                size="large"
                icon={<Star sx={{ fontSize: 32 }} />}
                emptyIcon={<Star sx={{ fontSize: 32 }} />}
                disabled={loading}
              />
              {formData.calificacion > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {formData.calificacion} estrella{formData.calificacion !== 1 ? 's' : ''}
                </Typography>
              )}
            </Box>

            {/* Campo de comentario */}
            <TextField
              fullWidth
              label="Tu Reseña *"
              multiline
              rows={4}
              value={formData.comentario}
              onChange={(e) => manejarCambio('comentario', e.target.value)}
              placeholder="Comparte tu experiencia con esta habitación..."
              disabled={loading}
              error={!!error && error.includes('comentario')}
              helperText={`${formData.comentario.length}/500 caracteres`}
              inputProps={{ maxLength: 500 }}
            />
            
            {/* Indicadores de validación */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Mínimo 10 caracteres • Máximo 500 caracteres
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {isAuthenticated && (
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={manejarEnviar}
            disabled={loading || formData.calificacion === 0 || !formData.comentario.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{
              background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
              fontWeight: 600,
              minWidth: 120
            }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormularioReview;