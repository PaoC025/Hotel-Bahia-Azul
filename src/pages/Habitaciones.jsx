// pages/Habitaciones.jsx - ACTUALIZADO
import { useEffect, useState } from "react";
import api from "../api/Axios";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, Box, Chip, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

export default function Habitaciones() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        console.log('🔄 Obteniendo habitaciones del backend...');
        const response = await api.get("/habitaciones");
        console.log('✅ Habitaciones recibidas:', response.data);
        setRooms(response.data);
      } catch (error) {
        console.error('❌ Error obteniendo habitaciones:', error);
        setError('Error cargando las habitaciones');
        // Datos de ejemplo como fallback
        setRooms([
          {
            _id: "1",
            nombre: "Suite Presidencial",
            descripcion: "Lujosa suite con vista al mar y jacuzzi privado",
            precio: 350,
            precioOriginal: 400,
            oferta: true,
            imagenes: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
            comodidades: ["WiFi", "AC", "TV", "Jacuzzi", "Mini Bar"]
          },
          {
            _id: "2", 
            nombre: "Habitación Deluxe",
            descripcion: "Amplia habitación con balcón y vista al jardín",
            precio: 180,
            precioOriginal: 200,
            oferta: true,
            imagenes: ["https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
            comodidades: ["WiFi", "AC", "TV", "Balcón", "Caja fuerte"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitaciones();
  }, []);

  const handleReservar = (room) => {
    // 🔽 PASAR LOS DATOS CORRECTOS A LA URL
    const params = new URLSearchParams({
      habitacion: room.nombre,
      precio: room.precio
    });
    
    window.location.href = `/contacto?${params.toString()}`;
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Cargando habitaciones...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" color="primary.main" mb={2} textAlign="center">
        Nuestras Habitaciones
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={6} textAlign="center">
        Descubre nuestro exclusivo alojamiento diseñado para tu comodidad
      </Typography>

      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room._id || room.id}>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia 
                  component="img" 
                  height="200" 
                  image={room.imagenes?.[0]} 
                  alt={room.nombre}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {room.nombre}
                    </Typography>
                    {room.oferta && (
                      <Chip label="Oferta" color="secondary" size="small" />
                    )}
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {room.descripcion}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {room.comodidades?.slice(0, 3).map((comodidad, index) => (
                      <Chip 
                        key={index} 
                        label={comodidad} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Box>
                    {room.precioOriginal && room.precioOriginal > room.precio && (
                      <Typography 
                        variant="body2" 
                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                      >
                        ${room.precioOriginal}
                      </Typography>
                    )}
                    <Typography fontWeight="bold" color="primary" variant="h6">
                      ${room.precio} / noche
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleReservar(room)}
                    sx={{
                      background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
                      fontWeight: 600
                    }}
                  >
                    Reservar
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}