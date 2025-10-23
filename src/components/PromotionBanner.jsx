// components/PromotionBanner.jsx (actualizado)
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import { Close, LocalOffer } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

export default function PromotionBanner() {
  const { promociones, loading } = useAppContext();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [visible, setVisible] = useState(true);

  const navigate = useNavigate();  // Usar el hook useNavigate

  // Solo mostrar si hay promociones activas
  const promocionesActivas = promociones.filter(promo => promo.activa);

  useEffect(() => {
    if (promocionesActivas.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % promocionesActivas.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promocionesActivas.length]);

  const promoActiva = promocionesActivas[currentPromo];

  if (loading || !promoActiva || !visible || promocionesActivas.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <Card sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
          color: 'white',
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
          position: 'relative'
        }}>
          <CardContent sx={{ 
            textAlign: 'center', 
            py: 2,
            px: 4,
            '&:last-child': { pb: 2 }
          }}>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={() => setVisible(false)}
              size="small"
            >
              <Close />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <LocalOffer sx={{ fontSize: 20 }} />
              <Typography variant="h6" fontWeight="bold">
                ¡Promoción Especial!
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              {promoActiva.titulo} - {promoActiva.descuento} de descuento
            </Typography>

            <Button 
              variant="contained" 
              color="secondary"
              size="small"
              sx={{ 
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
              onClick={() => navigate('/reservas')}  // Redirigir a la página de reservas
            >
              Aprovechar Oferta
            </Button>

            {promocionesActivas.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                {promocionesActivas.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: index === currentPromo ? 'white' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentPromo(index)}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
