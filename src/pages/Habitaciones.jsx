import { useEffect, useState } from "react";
import api from "../api/Axios";
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  Button, CardActions, Box, Chip, Alert, AlertTitle,
  Paper, Stack, Slider, FormGroup, FormControlLabel, Checkbox,
  TextField, Divider, IconButton, InputAdornment, Drawer,
  Skeleton, CircularProgress, Backdrop, Fade, useMediaQuery, useTheme
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  FilterList, ExpandMore, Search, Clear,
  Tune, Close, Star, Wifi, AcUnit, Tv, 
  Bathtub, LocalParking, FitnessCenter, Pool, 
  Kitchen, Balcony, KingBed, People,
  CheckCircle, Error, Info, Hotel
} from "@mui/icons-material";

// 🔽 COMPONENTE SKELETON PARA CARGA
const HabitacionSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      {/* Skeleton para imagen */}
      <Skeleton 
        variant="rectangular" 
        height={220} 
        animation="wave"
        sx={{ 
          bgcolor: 'grey.200',
          transform: 'none'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Skeleton para título */}
        <Skeleton 
          variant="text" 
          height={32} 
          width="80%" 
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />
        
        {/* Skeleton para descripción */}
        <Skeleton 
          variant="text" 
          height={20} 
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />
        <Skeleton 
          variant="text" 
          height={20} 
          width="90%" 
          animation="wave"
          sx={{ mb: 2, bgcolor: 'grey.200' }}
        />
        
        {/* Skeleton para comodidades */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Skeleton variant="rectangular" width={60} height={24} animation="wave" sx={{ borderRadius: 2, bgcolor: 'grey.200' }} />
          <Skeleton variant="rectangular" width={70} height={24} animation="wave" sx={{ borderRadius: 2, bgcolor: 'grey.200' }} />
          <Skeleton variant="rectangular" width={50} height={24} animation="wave" sx={{ borderRadius: 2, bgcolor: 'grey.200' }} />
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Skeleton variant="rectangular" width={120} height={36} animation="wave" sx={{ borderRadius: 2, bgcolor: 'grey.200' }} />
        <Skeleton variant="rectangular" width={100} height={36} animation="wave" sx={{ borderRadius: 2, bgcolor: 'grey.200' }} />
      </CardActions>
    </Card>
  </motion.div>
);

// 🔽 COMPONENTE DE FILTROS MODERNOS (igual que antes)
const FiltrosModernos = ({ habitaciones, onFiltrar, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [filtros, setFiltros] = useState({
    precioMin: 0,
    precioMax: 1000,
    categorias: [],
    comodidades: [],
    personas: 1,
    disponible: true
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Extraer opciones únicas
  const categoriasUnicas = [...new Set(habitaciones.map(h => h.categoria).filter(Boolean))];
  const todasComodidades = habitaciones.flatMap(h => h.comodidades || []);
  const comodidadesUnicas = [...new Set(todasComodidades)].sort();

  // Precios reales
  const precios = habitaciones.map(h => h.precio);
  const precioMinReal = Math.min(...precios);
  const precioMaxReal = Math.max(...precios);

  const handlePrecioChange = (event, newValue) => {
    setFiltros(prev => ({
      ...prev,
      precioMin: newValue[0],
      precioMax: newValue[1]
    }));
  };

  const aplicarFiltros = () => {
    onFiltrar(filtros);
    setDrawerOpen(false);
  };

  const limpiarFiltros = () => {
    const filtrosLimpiados = {
      precioMin: precioMinReal,
      precioMax: precioMaxReal,
      categorias: [],
      comodidades: [],
      personas: 1,
      disponible: true
    };
    setFiltros(filtrosLimpiados);
    onFiltrar(filtrosLimpiados);
  };

  const getComodidadIcon = (comodidad) => {
    const iconMap = {
      'wifi': <Wifi sx={{ fontSize: 20 }} />,
      'aire acondicionado': <AcUnit sx={{ fontSize: 20 }} />,
      'tv': <Tv sx={{ fontSize: 20 }} />,
      'jacuzzi': <Bathtub sx={{ fontSize: 20 }} />,
      'estacionamiento': <LocalParking sx={{ fontSize: 20 }} />,
      'gimnasio': <FitnessCenter sx={{ fontSize: 20 }} />,
      'piscina': <Pool sx={{ fontSize: 20 }} />,
      'cocina': <Kitchen sx={{ fontSize: 20 }} />,
      'balcón': <Balcony sx={{ fontSize: 20 }} />,
      'cama king': <KingBed sx={{ fontSize: 20 }} />,
    };
    return iconMap[comodidad.toLowerCase()] || <Star sx={{ fontSize: 20 }} />;
  };

  // Filtros activos para mostrar en chips
  const filtrosActivos = [
    filtros.precioMin > precioMinReal && `Desde $${filtros.precioMin}`,
    filtros.precioMax < precioMaxReal && `Hasta $${filtros.precioMax}`,
    filtros.categorias.length > 0 && `${filtros.categorias.length} categorías`,
    filtros.comodidades.length > 0 && `${filtros.comodidades.length} comodidades`,
    filtros.personas > 1 && `${filtros.personas} personas`
  ].filter(Boolean);

  return (
    <>
      {/* BARRA SUPERIOR MODIFICADA - RESPONSIVE */}
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: { xs: 60, md: 80 },
        zIndex: 100
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2 
        }}>
          {/* Información de resultados */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, width: { xs: '100%', md: 'auto' } }}>
            <Typography variant="h6" fontWeight="700" color="primary.main">
              {habitaciones.length} Habitaciones Disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Star sx={{ fontSize: 16, color: '#FBBF24' }} />
              Encuentra tu espacio ideal entre nuestras opciones
            </Typography>
          </Box>

          {/* Filtros activos como chips */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            flex: 1, 
            mx: { xs: 0, md: 2 }, 
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' },
            order: { xs: 2, md: 1 }
          }}>
            {filtrosActivos.map((filtro, index) => (
              <Chip
                key={index}
                label={filtro}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={limpiarFiltros}
                sx={{ 
                  fontWeight: 600,
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
              />
            ))}
            {filtrosActivos.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList sx={{ fontSize: 16 }} />
                Usa los filtros para refinar tu búsqueda
              </Typography>
            )}
          </Box>

          {/* Botón de filtros mejorado */}
          <Button
            variant="contained"
            startIcon={<Tune />}
            endIcon={!isMobile && <FilterList />}
            onClick={() => setDrawerOpen(true)}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.2,
              background: 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1E3A8A 30%, #2563EB 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
              },
              transition: 'all 0.3s ease',
              minWidth: { xs: '100%', md: '140px' },
              order: { xs: 1, md: 2 }
            }}
          >
            Filtros {filtrosActivos.length > 0 && `(${filtrosActivos.length})`}
          </Button>
        </Box>
      </Box>

      {/* DRAWER DE FILTROS - RESPONSIVE */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header del Drawer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h5" fontWeight="800" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: '#FBBF24' }} />
              Filtros
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Stack spacing={4}>
              {/* Precio */}
              <Box>
                <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  💰 Rango de Precio
                </Typography>
                <Slider
                  value={[filtros.precioMin, filtros.precioMax]}
                  onChange={handlePrecioChange}
                  valueLabelDisplay="auto"
                  min={precioMinReal}
                  max={precioMaxReal}
                  step={10}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{ 
                    color: 'primary.main',
                    mb: 2,
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`$${filtros.precioMin}`} 
                    variant="filled"
                    sx={{ background: 'primary.main', color: 'white', fontWeight: 700 }}
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    hasta
                  </Typography>
                  <Chip 
                    label={`$${filtros.precioMax}`} 
                    variant="filled"
                    sx={{ background: 'primary.main', color: 'white', fontWeight: 700 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />

              {/* Personas */}
              <Box>
                <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  👥 Huéspedes
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <People color="primary" />
                  <Slider
                    value={filtros.personas}
                    onChange={(e, value) => setFiltros(prev => ({ ...prev, personas: value }))}
                    min={1}
                    max={8}
                    step={1}
                    sx={{ flex: 1, color: 'primary.main' }}
                  />
                  <Chip 
                    label={`${filtros.personas} ${filtros.personas === 1 ? 'persona' : 'personas'}`}
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 700, minWidth: 80 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />

              {/* Categorías */}
              {categoriasUnicas.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🏷️ Categorías
                  </Typography>
                  <Stack spacing={1}>
                    {categoriasUnicas.map(categoria => (
                      <FormControlLabel
                        key={categoria}
                        control={
                          <Checkbox
                            checked={filtros.categorias.includes(categoria)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFiltros(prev => ({
                                  ...prev,
                                  categorias: [...prev.categorias, categoria]
                                }));
                              } else {
                                setFiltros(prev => ({
                                  ...prev,
                                  categorias: prev.categorias.filter(c => c !== categoria)
                                }));
                              }
                            }}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1" fontWeight="600">
                            {categoria}
                          </Typography>
                        }
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.04)'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />

              {/* Comodidades */}
              {comodidadesUnicas.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    ⭐ Comodidades
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                    gap: 1.5 
                  }}>
                    {comodidadesUnicas.map(comodidad => (
                      <Chip
                        key={comodidad}
                        icon={getComodidadIcon(comodidad)}
                        label={comodidad}
                        variant={filtros.comodidades.includes(comodidad) ? "filled" : "outlined"}
                        onClick={() => {
                          if (filtros.comodidades.includes(comodidad)) {
                            setFiltros(prev => ({
                              ...prev,
                              comodidades: prev.comodidades.filter(c => c !== comodidad)
                            }));
                          } else {
                            setFiltros(prev => ({
                              ...prev,
                              comodidades: [...prev.comodidades, comodidad]
                            }));
                          }
                        }}
                        color={filtros.comodidades.includes(comodidad) ? "primary" : "default"}
                        sx={{ 
                          justifyContent: 'flex-start',
                          textTransform: 'capitalize',
                          borderRadius: 2,
                          py: 2,
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Footer del Drawer */}
          <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={aplicarFiltros}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #F59E0B 30%, #FBBF24 90%)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    Aplicando...
                  </Box>
                ) : (
                  'Ver Habitaciones'
                )}
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={limpiarFiltros}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  borderColor: 'text.secondary',
                  color: 'text.secondary'
                }}
              >
                Limpiar Filtros
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

// 🔽 COMPONENTE CARD MEJORADO
const HabitacionCard = ({ room }) => {
  const handleReservar = (room) => {
    const params = new URLSearchParams({
      habitacion: room.nombre,
      precio: room.precio
    });
    window.location.href = `/contacto?${params.toString()}`;
  };

  const getComodidadIcon = (comodidad) => {
    const iconMap = {
      'wifi': <Wifi sx={{ fontSize: 16 }} />,
      'aire acondicionado': <AcUnit sx={{ fontSize: 16 }} />,
      'tv': <Tv sx={{ fontSize: 16 }} />,
      'jacuzzi': <Bathtub sx={{ fontSize: 16 }} />,
      'estacionamiento': <LocalParking sx={{ fontSize: 16 }} />,
      'gimnasio': <FitnessCenter sx={{ fontSize: 16 }} />,
      'piscina': <Pool sx={{ fontSize: 16 }} />,
      'cocina': <Kitchen sx={{ fontSize: 16 }} />,
      'balcón': <Balcony sx={{ fontSize: 16 }} />
    };
    return iconMap[comodidad.toLowerCase()] || <Star sx={{ fontSize: 16 }} />;
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderColor: 'primary.light'
        }
      }}>
        {/* Imagen con Badges */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia 
            component="img" 
            height="220" 
            image={room.imagenes?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'} 
            alt={room.nombre}
            sx={{ objectFit: 'cover' }}
          />
          
          {/* Badges superpuestos */}
          <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
            {room.oferta && (
              <Chip 
                label="🔥 Oferta" 
                color="secondary" 
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              />
            )}
            <Chip 
              label={room.categoria || 'Standard'} 
              color="primary" 
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.7rem', background: 'rgba(255,255,255,0.9)' }}
            />
          </Box>

          {/* RATING MEJORADO */}
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Chip 
              icon={<Star sx={{ fontSize: 16, color: '#FBBF24', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />}
              label="4.8"
              size="small"
              sx={{ 
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom sx={{ lineHeight: 1.2 }}>
              {room.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
              {room.descripcion}
            </Typography>
          </Box>

          {/* Comodidades */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" fontWeight="600" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 14, color: '#FBBF24' }} />
              COMODIDADES INCLUIDAS:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {room.comodidades?.slice(0, 4).map((comodidad, index) => (
                <Chip 
                  key={index}
                  icon={getComodidadIcon(comodidad)}
                  label={comodidad}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    borderRadius: 2
                  }}
                />
              ))}
              {room.comodidades?.length > 4 && (
                <Chip 
                  label={`+${room.comodidades.length - 4}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '24px', borderRadius: 2 }}
                />
              )}
            </Box>
          </Box>

          {/* Capacidad */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Hasta {room.capacidad || 2} personas
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ 
          justifyContent: "space-between", 
          px: 3, 
          pb: 3,
          pt: 0 
        }}>
          {/* Precio */}
          <Box>
            {room.precioOriginal && room.precioOriginal > room.precio && (
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: 'text.secondary',
                  fontSize: '0.9rem'
                }}
              >
                ${room.precioOriginal}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography fontWeight="bold" color="primary" variant="h5">
                ${room.precio}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                /noche
              </Typography>
            </Box>
          </Box>
          
          {/* Botones */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              size="small"
              component={Link}
              to={`/habitacion/${room._id}`}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.50',
                  borderColor: 'primary.dark'
                }
              }}
            >
              Detalles
            </Button>
            
            <Button 
              variant="contained" 
              size="small"
              onClick={() => handleReservar(room)}
              sx={{
                borderRadius: 2,
                px: 2,
                background: 'linear-gradient(45deg, #F59E0B 30%, #FBBF24 90%)',
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                }
              }}
            >
              Reservar
            </Button>
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

// 🔽 COMPONENTE PRINCIPAL CON MEJORAS DE UX
export default function Habitaciones() {
  const [rooms, setRooms] = useState([]);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtrosLoading, setFiltrosLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setLoading(true);
        const response = await api.get("/habitaciones");
        setRooms(response.data);
        setHabitacionesFiltradas(response.data);
        setSuccess('Habitaciones cargadas correctamente');
        
        // Auto-ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error obteniendo habitaciones:', error);
        setError('Error cargando las habitaciones. Mostrando datos de ejemplo.');
        
        // Datos de ejemplo
        const mockRooms = [
          {
            _id: "1",
            nombre: "Suite Ejecutiva",
            descripcion: "Elegante suite con vista al mar, cama king y jacuzzi privado. Ideal para parejas.",
            precio: 300,
            precioOriginal: 350,
            oferta: true,
            imagenes: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600"],
            comodidades: ["Wifi", "TV 55\"", "Jacuzzi", "Aire Acondicionado", "Balcón"],
            categoria: "Ejecutiva",
            capacidad: 2,
            disponible: true
          },
          {
            _id: "2",
            nombre: "Habitación Deluxe",
            descripcion: "Amplia habitación con vista al jardín y todas las comodidades modernas.",
            precio: 200,
            imagenes: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"],
            comodidades: ["Wifi", "TV", "Aire Acondicionado", "Balcón"],
            categoria: "Deluxe",
            capacidad: 3,
            disponible: true
          },
          {
            _id: "3",
            nombre: "Suite Familiar",
            descripcion: "Espaciosa suite perfecta para familias, con áreas separadas y comodidades extras.",
            precio: 450,
            imagenes: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600"],
            comodidades: ["Wifi", "TV", "Aire Acondicionado", "Cocina", "Estacionamiento"],
            categoria: "Familiar",
            capacidad: 5,
            disponible: true
          }
        ];
        setRooms(mockRooms);
        setHabitacionesFiltradas(mockRooms);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitaciones();
  }, []);

  const handleFiltrar = (filtros) => {
    setFiltrosLoading(true);
    setTimeout(() => {
      const filtradas = rooms.filter(habitacion => {
        if (habitacion.precio < filtros.precioMin || habitacion.precio > filtros.precioMax) return false;
        if (filtros.categorias.length > 0 && !filtros.categorias.includes(habitacion.categoria)) return false;
        if (filtros.comodidades.length > 0) {
          const tieneTodasComodidades = filtros.comodidades.every(comodidad => 
            habitacion.comodidades?.includes(comodidad)
          );
          if (!tieneTodasComodidades) return false;
        }
        if (habitacion.capacidad < filtros.personas) return false;
        if (filtros.disponible && !habitacion.disponible) return false;
        return true;
      });
      setHabitacionesFiltradas(filtradas);
      setFiltrosLoading(false);
      
      // Mostrar mensaje de resultados
      if (filtradas.length === 0) {
        setError('No se encontraron habitaciones con los filtros seleccionados');
      } else {
        setSuccess(`Se encontraron ${filtradas.length} habitaciones`);
        setTimeout(() => setSuccess(''), 3000);
      }
    }, 800); // Simular carga de filtros
  };

  // 🔽 LOADER PRINCIPAL MEJORADO
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header con skeleton */}
        <Box textAlign="center" mb={4}>
          <Skeleton variant="text" height={60} width="60%" sx={{ mx: 'auto', mb: 2, bgcolor: 'grey.200' }} />
          <Skeleton variant="text" height={30} width="80%" sx={{ mx: 'auto', bgcolor: 'grey.200' }} />
        </Box>

        {/* Skeleton de filtros */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rounded" height={100} sx={{ bgcolor: 'grey.200', borderRadius: 3 }} />
        </Box>

        {/* Grid de skeletons */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} xl={4} key={item}>
              <HabitacionSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* 🔽 MENSAJES DE ALERTA MEJORADOS */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="warning" 
              sx={{ mb: 3, borderRadius: 3 }}
              onClose={() => setError(null)}
            >
              <AlertTitle>Información importante</AlertTitle>
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 3 }}
              onClose={() => setSuccess('')}
            >
              <AlertTitle>¡Éxito!</AlertTitle>
              {success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔽 BACKDROP PARA CARGA DE FILTROS */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={filtrosLoading}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: '#FBBF24',
                mb: 2
              }} 
            />
            <Typography variant="h6" color="white" fontWeight="600">
              Aplicando filtros...
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Buscando las mejores opciones para ti
            </Typography>
          </Box>
        </motion.div>
      </Backdrop>

      {/* HEADER MEJORADO */}
      <Box textAlign="center" mb={4} sx={{ position: 'relative' }}>
        {/* Elementos decorativos de estrellas */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          left: { xs: '5%', md: '10%' },
          animation: 'twinkle 3s ease-in-out infinite',
          '@keyframes twinkle': {
            '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.1)' }
          }
        }}>
          <Star sx={{ fontSize: { xs: 20, md: 24 }, color: '#FBBF24', filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))' }} />
        </Box>
        
        <Box sx={{
          position: 'absolute',
          top: 10,
          right: { xs: '10%', md: '15%' },
          animation: 'twinkle 4s ease-in-out infinite 1s',
        }}>
          <Star sx={{ fontSize: { xs: 16, md: 18 }, color: '#FBBF24', filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.6))' }} />
        </Box>

        <Typography 
          variant="h3" 
          color="primary.main" 
          gutterBottom
          sx={{ 
            fontWeight: 800, 
            position: 'relative',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Nuestras Habitaciones
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            maxWidth: '600px', 
            mx: 'auto', 
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Descubre nuestro exclusivo alojamiento diseñado para tu máxima comodidad y relax
        </Typography>
      </Box>

      {/* FILTROS MODERNOS */}
      <FiltrosModernos 
        habitaciones={rooms}
        onFiltrar={handleFiltrar}
        loading={filtrosLoading}
      />

      {/* 🔽 LOADER DURANTE FILTRADO */}
      {filtrosLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress 
            size={40} 
            sx={{ color: 'primary.main', mb: 2 }} 
          />
          <Typography variant="body1" color="text.secondary">
            Aplicando filtros...
          </Typography>
        </Box>
      )}

      {/* Grid de habitaciones */}
      <AnimatePresence mode="wait">
        <motion.div
          key={habitacionesFiltradas.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Grid container spacing={3}>
            {habitacionesFiltradas.map((room) => (
              <Grid item xs={12} sm={6} lg={4} key={room._id || room.id}>
                <HabitacionCard room={room} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>

      {/* 🔽 ESTADO VACÍO MEJORADO */}
      {!filtrosLoading && habitacionesFiltradas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            mt: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'divider'
          }}>
            <Hotel sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
              No se encontraron habitaciones
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Lo sentimos, no hay habitaciones que coincidan con tus criterios de búsqueda actuales.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #3B82F6 30%, #1E40AF 90%)',
                fontWeight: 600
              }}
            >
              Ver Todas las Habitaciones
            </Button>
          </Box>
        </motion.div>
      )}
    </Container>
  );
}