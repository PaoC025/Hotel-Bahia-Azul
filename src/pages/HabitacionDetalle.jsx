import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Button, Chip, 
  Paper, Divider, List, ListItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Alert, Snackbar, IconButton, Tabs, Tab, CircularProgress
} from '@mui/material';
import { 
  KingBed, Bathtub, Wifi, AcUnit, Tv, Coffee, 
  LocalParking, FitnessCenter, Pool, BeachAccess,
  ArrowBack, Share, Favorite, Person,
  Check, FavoriteBorder, Favorite as FavoriteFilled,
  RateReview
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/Axios';
import ListaReviews from '../components/ListaReviews';
import EstrellasCalificacion from "../components/EstrellasCalificacion";

const HabitacionDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReserva } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReserva, setOpenReserva] = useState(false);
  const [fechas, setFechas] = useState({
    checkIn: '',
    checkOut: '',
    huespedes: 2
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [imagenActual, setImagenActual] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Cargar datos de la habitación desde el backend
  useEffect(() => {
    const cargarHabitacion = async () => {
      try {
        setLoading(true);
        console.log(`🔄 Cargando habitación con ID: ${id}`);
        
        const response = await api.get(`/habitaciones/${id}`);
        console.log('✅ Datos de habitación recibidos:', response.data);
        setHabitacion(response.data);
        
      } catch (err) {
        console.error('❌ Error cargando habitación:', err);
        setError('Error al cargar la habitación');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarHabitacion();
    }
  }, [id]);

  const handleReservar = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setOpenReserva(true);
  };

  const handleConfirmarReserva = () => {
    const noches = fechas.checkIn && fechas.checkOut ? 
      Math.ceil((new Date(fechas.checkOut) - new Date(fechas.checkIn)) / (1000 * 60 * 60 * 24)) : 1;

    const nuevaReserva = {
      id: Date.now(),
      habitacionId: habitacion._id,
      habitacion: habitacion.nombre,
      precio: habitacion.precio,
      checkIn: fechas.checkIn,
      checkOut: fechas.checkOut,
      huespedes: fechas.huespedes,
      noches: noches,
      total: habitacion.precio * noches,
      imagen: habitacion.imagenes?.[0] || ''
    };
    
    addReserva(nuevaReserva);
    setOpenReserva(false);
    setSnackbar({ open: true, message: '¡Reserva agregada a tu carrito!' });
  };

  const calcularTotal = () => {
    if (!fechas.checkIn || !fechas.checkOut) return habitacion.precio;
    const noches = Math.ceil((new Date(fechas.checkOut) - new Date(fechas.checkIn)) / (1000 * 60 * 60 * 24));
    return habitacion.precio * noches;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para mapear amenities basado en los datos reales
  const getAmenityIcon = (amenityName) => {
    const amenityMap = {
      'wifi': <Wifi />,
      'wi-fi': <Wifi />,
      'internet': <Wifi />,
      'aire acondicionado': <AcUnit />,
      'ac': <AcUnit />,
      'tv': <Tv />,
      'televisor': <Tv />,
      'jacuzzi': <Bathtub />,
      'bañera': <Bathtub />,
      'cafetera': <Coffee />,
      'café': <Coffee />,
      'estacionamiento': <LocalParking />,
      'parking': <LocalParking />,
      'gimnasio': <FitnessCenter />,
      'gym': <FitnessCenter />,
      'piscina': <Pool />,
      'pool': <Pool />,
      'playa': <BeachAccess />,
      'beach': <BeachAccess />,
      'cama king': <KingBed />,
      'king bed': <KingBed />
    };
    
    const normalizedAmenity = amenityName.toLowerCase().trim();
    return amenityMap[normalizedAmenity] || <Check />;
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando habitación...
        </Typography>
      </Container>
    );
  }

  if (error || !habitacion) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          {error || 'Habitación no encontrada'}
        </Typography>
        <Button component={Link} to="/habitaciones" variant="contained" sx={{ mt: 2 }}>
          Volver a habitaciones
        </Button>
      </Container>
    );
  }

  // Usar imágenes de la base de datos o una por defecto
  const imagenes = habitacion.imagenes && habitacion.imagenes.length > 0 
    ? habitacion.imagenes 
    : ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'];

  // Preparar datos desde la estructura real del backend
  const amenities = habitacion.comodidades || [];
  const serviciosIncluidos = habitacion.serviciosIncluidos || [
    'Desayuno buffet incluido',
    'Limpieza diaria', 
    'Toallas de playa',
    'Wi-Fi gratuito'
  ];
  
  const politicas = [
    `Check-in: ${habitacion.politicas?.checkIn || '15:00'} - Check-out: ${habitacion.politicas?.checkOut || '12:00'}`,
    habitacion.politicas?.fumadores ? 'Se permite fumar' : 'No smoking',
    habitacion.politicas?.mascotas ? 'Mascotas permitidas' : 'No se permiten mascotas',
    habitacion.politicas?.niños ? 'Apto para niños' : 'No apto para niños',
    'Cancelación gratuita hasta 48h antes'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header y Navegación */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          component={Link}
          to="/habitaciones"
          sx={{ mb: 2 }}
        >
          Volver a Habitaciones
        </Button>
        
        {/* 🔽 NUEVO: Header con rating y botón de reseña */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Chip 
              label={habitacion.categoria || 'Standard'} 
              color="primary" 
              sx={{ mb: 2 }}
            />
            <Typography variant="h3" color="primary.main" gutterBottom>
              {habitacion.nombre}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {habitacion.categoria} • {habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'} • {habitacion.tamaño}
            </Typography>
            
            {/* 🔽 NUEVO: Rating general de la habitación */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EstrellasCalificacion 
                calificacion={4.5} 
                tamaño="medium" 
                readonly 
              />
              <Typography variant="body1" color="text.secondary">
                (24 reseñas)
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              {habitacion.oferta && habitacion.precioOriginal && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: 'text.secondary',
                    mb: 1
                  }}
                >
                  ${habitacion.precioOriginal}
                </Typography>
              )}
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                ${habitacion.precio}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                por noche
              </Typography>
              {habitacion.oferta && (
                <Chip 
                  label="Oferta Especial" 
                  color="secondary" 
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Galería de Imágenes */}
            <Paper sx={{ mb: 3, overflow: 'hidden', position: 'relative' }}>
              <Box sx={{ position: 'relative', height: 400 }}>
                <img 
                  src={imagenes[imagenActual]} 
                  alt={habitacion.nombre}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
                
                {/* Botón favorito */}
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      backgroundColor: 'white'
                    }
                  }}
                  onClick={() => setFavorito(!favorito)}
                >
                  {favorito ? <FavoriteFilled color="error" /> : <FavoriteBorder />}
                </IconButton>

                {/* Contador de imágenes */}
                {imagenes.length > 1 && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.8rem'
                  }}>
                    {imagenActual + 1} / {imagenes.length}
                  </Box>
                )}
              </Box>
              
              {/* Miniaturas */}
              {imagenes.length > 1 && (
                <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {imagenes.map((img, index) => (
                    <Box 
                      key={index}
                      onClick={() => setImagenActual(index)}
                      sx={{
                        minWidth: 80,
                        height: 60,
                        cursor: 'pointer',
                        border: imagenActual === index ? '3px solid' : '1px solid',
                        borderColor: imagenActual === index ? 'primary.main' : 'grey.300',
                        borderRadius: 1,
                        overflow: 'hidden',
                        opacity: imagenActual === index ? 1 : 0.7,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`Vista ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Información Principal */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                {habitacion.descripcion}
              </Typography>

              {/* Especificaciones */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <KingBed sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {habitacion.tipoCama || 'Cama King Size'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Camas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      Hasta {habitacion.capacidad || 2} personas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Capacidad</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Bathtub sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {habitacion.tamaño || '30 m²'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Tamaño</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <RateReview sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {habitacion.categoria || 'Standard'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Categoría</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* 🔽 NUEVO: SECCIÓN DE REVIEWS */}
            <ListaReviews habitacionId={id} />

            {/* Tabs para más información */}
            <Paper sx={{ mb: 4, mt: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Comodidades" />
                <Tab label="Servicios Incluidos" />
                <Tab label="Políticas" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <Grid container spacing={2}>
                    {amenities.map((amenity, index) => (
                      <Grid item xs={6} md={4} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {getAmenityIcon(amenity)}
                          </Box>
                          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                            {amenity}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {tabValue === 1 && (
                  <List>
                    {serviciosIncluidos.map((servicio, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Check color="success" />
                        </ListItemIcon>
                        <ListItemText primary={servicio} />
                      </ListItem>
                    ))}
                  </List>
                )}

                {tabValue === 2 && (
                  <List>
                    {politicas.map((politica, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Box sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            bgcolor: 'text.secondary' 
                          }} />
                        </ListItemIcon>
                        <ListItemText primary={politica} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar - Reserva */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Reservar Habitación
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Precio por noche
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    ${habitacion.precio}
                  </Typography>
                  {habitacion.precioOriginal && habitacion.precioOriginal > habitacion.precio && (
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textDecoration: 'line-through', 
                        color: 'text.secondary' 
                      }}
                    >
                      ${habitacion.precioOriginal}
                    </Typography>
                  )}
                </Box>
                {habitacion.oferta && (
                  <Chip 
                    label="Oferta Especial" 
                    color="secondary" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estado
                </Typography>
                <Chip 
                  label={habitacion.disponible ? "Disponible" : "No Disponible"} 
                  color={habitacion.disponible ? "success" : "error"} 
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleReservar}
                disabled={!habitacion.disponible}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
                  }
                }}
              >
                {habitacion.disponible ? "Reservar Ahora" : "No Disponible"}
              </Button>

              <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={favorito ? <FavoriteFilled /> : <FavoriteBorder />}
                  onClick={() => setFavorito(!favorito)}
                  color={favorito ? "error" : "primary"}
                >
                  Favorito
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Share />}
                >
                  Compartir
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Información adicional */}
              {habitacion.oferta && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'secondary.50', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom fontWeight="bold">
                    🎉 Oferta Especial
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ahorra ${habitacion.precioOriginal - habitacion.precio} por noche
                  </Typography>
                </Box>
              )}

              {/* Información de contacto */}
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  ¿Tienes dudas?
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Llámanos: +58 422 876 5439
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de Reserva */}
      <Dialog open={openReserva} onClose={() => setOpenReserva(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Reservar {habitacion.nombre}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Complete los datos para su reserva
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                value={fechas.checkIn}
                onChange={(e) => setFechas({...fechas, checkIn: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                value={fechas.checkOut}
                onChange={(e) => setFechas({...fechas, checkOut: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Huéspedes"
                type="number"
                value={fechas.huespedes}
                onChange={(e) => setFechas({...fechas, huespedes: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 1, max: habitacion.capacidad || 4 } }}
              />
            </Grid>

            {/* Resumen de precio */}
            {fechas.checkIn && fechas.checkOut && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Resumen de Precio
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>
                      {Math.ceil((new Date(fechas.checkOut) - new Date(fechas.checkIn)) / (1000 * 60 * 60 * 24))} noches
                    </Typography>
                    <Typography fontWeight="bold">
                      ${calcularTotal()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Impuestos y cargos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Incluidos
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReserva(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmarReserva}
            disabled={!fechas.checkIn || !fechas.checkOut}
          >
            Agregar al Carrito
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HabitacionDetalle;