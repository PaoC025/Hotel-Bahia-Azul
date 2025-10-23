import { Box, Button, Container, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WeatherWidget from '../components/Weather.jsx'; // 👈 Importado

export default function Landing() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🏊", title: "Piscina Infinity", desc: "Vistas panorámicas al mar Caribe" },
    { icon: "🍽️", title: "Restaurante Gourmet", desc: "Cocina local e internacional" },
    { icon: "💆", title: "Spa & Bienestar", desc: "Tratamientos relajantes profesionales" },
    { icon: "🚗", title: "Transporte Privado", desc: "Shuttle gratuito y traslados" }
  ];

  const stats = [
    { number: "50+", label: "Habitaciones de Lujo" },
    { number: "5★", label: "Calificación" },
    { number: "24/7", label: "Servicio al Cliente" },
    { number: "100%", label: "Clientes Satisfechos" }
  ];

  return (
    <Box>
      {/* Hero Section Mejorado */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          overflow: 'hidden',
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        ))}
        
        {/* Overlay con gradiente */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(30,64,175,0.8) 0%, rgba(59,130,246,0.6) 100%)',
          }}
        />

        <Container sx={{ 
          position: 'relative', 
          zIndex: 1, 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          pt: { xs: 8, md: 0 }
        }}>
          <Box sx={{ maxWidth: '800px', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Clima integrado en el header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 800,
                    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.1,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Hotel Bahía Azul
                </Typography>
                
                {/* Clima compacto (Escritorio) - USANDO WIDGET DINÁMICO */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <WeatherWidget variant="compact" /> 
                </Box>
              </Box>

              <Typography 
                variant="h3" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 300,
                  mb: 3,
                  fontSize: { xs: '1.3rem', md: '1.8rem' },
                  opacity: 0.95
                }}
              >
                Lujo y tranquilidad frente al mar Caribe
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px',
                  lineHeight: 1.6
                }}
              >
                Vive una experiencia inolvidable con confort, elegancia y el sonido 
                de las olas como tu compañía en la hermosa Isla de Margarita.
              </Typography>

              {/* Botones con clima integrado */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', mb: 6 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={Link}
                    to="/habitaciones"
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(245, 158, 11, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🏨 Ver Habitaciones
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/contacto"
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📞 Contactar
                  </Button>
                </Box>

                {/* Clima compacto (Móvil) - USANDO WIDGET DINÁMICO */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <WeatherWidget variant="compact" /> 
                </Box>
              </Box>

              {/* Estadísticas */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {stats.map((stat, index) => (
                  <Box key={index} textAlign="left">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: 'secondary.main', 
                        fontWeight: 800,
                        mb: 0.5
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.9,
                        fontSize: '0.9rem'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>

        {/* Indicadores de imagen */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1
        }}>
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: currentImage === index ? 'white' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </Box>
      </Box>

      {/* Sección de Características */}
      <Container sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography variant="h2" textAlign="center" color="primary.main" mb={2} sx={{ fontWeight: 800 }}>
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="h5" textAlign="center" color="text.secondary" mb={6} sx={{ fontWeight: 300 }}>
            Descubre los servicios exclusivos que hacen de tu estadía una experiencia única
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ 
                    textAlign: 'center', 
                    p: 4, 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'grey.100',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 48px rgba(59, 130, 246, 0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h1" sx={{ mb: 2, fontSize: '3.5rem' }}>
                        {feature.icon}
                      </Typography>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Call to Action */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 10,
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'
      }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
              ¿Listo para tu escape perfecto?
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
              Reserva ahora y obtén 10% de descuento en tu primera estadía
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/contacto"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🏝️ Reservar Oferta Especial
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}