import { useEffect, useState } from "react";
import api from "../api/Axios";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";

export default function Habitaciones() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/habitaciones")
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleReservar = (room) => {
    // Aquí puedes redirigir al formulario de contacto con los datos de la habitación
    console.log('Reservar habitación:', room);
    // O implementar un modal de reserva
    window.location.href = `/contacto?habitacion=${room.nombre}`;
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Cargando habitaciones...</Typography>
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
          <Grid item xs={12} sm={6} md={4} key={room.id}>
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
                    {room.precioOriginal && (
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