import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    { icon: "🏊", title: "Piscina Infinity", desc: "Vistas panorámicas al mar" },
    { icon: "🍽️", title: "Restaurante Gourmet", desc: "Cocina local e internacional" },
    { icon: "💆", title: "Spa & Bienestar", desc: "Tratamientos relajantes" },
    { icon: "🚗", title: "Transporte", desc: "Servicio de shuttle gratuito" }
  ];

  return (
    <Box>
      {/* Hero Section Mejorado */}
      <Box
        sx={{
          position: 'relative',
          height: '90vh',
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
        
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(30,64,175,0.7) 0%, rgba(59,130,246,0.5) 100%)',
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px' }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2
              }}
            >
              Hotel Bahía Azul
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white', 
                fontWeight: 300,
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Lujo y tranquilidad frente al mar Caribe
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                mb: 4,
                opacity: 0.9
              }}
            >
              Vive una experiencia inolvidable con confort, elegancia y el sonido de las olas como tu compañía.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/habitaciones"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Ver Habitaciones
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/contacto"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Contactar
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Sección de Características */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" color="primary.main" mb={2}>
          ¿Por qué elegirnos?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
          Descubre los servicios que hacen de tu estadía una experiencia única
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 2 }}>{feature.icon}</Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 700 }}>
            ¿Listo para tu escape perfecto?
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 4, opacity: 0.9 }}>
            Reserva ahora y obtén 10% de descuento en tu primera estadía
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/contacto"
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Reservar Oferta Especial
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}