import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating
} from '@mui/material';
import { 
  FormatQuote, 
  ExpandMore, 
  ExpandLess,
  Person,
  RateReview,
  MoreVert,
  Edit,
  Delete,
  Star
} from '@mui/icons-material';
import EstrellasCalificacion from './EstrellasCalificacion';
import FormularioReview from './FormularioReview';
import { useAuth } from '../context/AuthContext';
import api from '../api/Axios';

const ListaReviews = ({ habitacionId }) => {
  const [reviews, setReviews] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstrellas, setFiltroEstrellas] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // 🔽 NUEVOS ESTADOS PARA EDITAR/ELIMINAR
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [reviewSeleccionada, setReviewSeleccionada] = useState(null);
  const [dialogEditar, setDialogEditar] = useState(false);
  const [dialogEliminar, setDialogEliminar] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [formEditar, setFormEditar] = useState({
    calificacion: 0,
    comentario: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    cargarReviews();
  }, [habitacionId, filtroEstrellas]);

  const cargarReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: mostrarTodas ? 50 : 5
      });

      if (filtroEstrellas) {
        params.append('rating', filtroEstrellas);
      }

      const response = await api.get(`/reviews/habitacion/${habitacionId}?${params}`);
      
      setReviews(response.data.reviews);
      setEstadisticas(response.data.estadisticas);
      setError(null);
    } catch (err) {
      console.error('Error cargando reviews:', err);
      setError('Error al cargar las reseñas');
      
      // Datos mock para desarrollo
      setEstadisticas({
        promedio: 4.5,
        totalReviews: 12,
        distribucion: [
          { estrellas: 5, cantidad: 8, porcentaje: 67 },
          { estrellas: 4, cantidad: 3, porcentaje: 25 },
          { estrellas: 3, cantidad: 1, porcentaje: 8 },
          { estrellas: 2, cantidad: 0, porcentaje: 0 },
          { estrellas: 1, cantidad: 0, porcentaje: 0 }
        ]
      });
      
      setReviews([
        {
          _id: '1',
          usuario: { _id: 'user1', nombre: 'María González' },
          calificacion: 5,
          comentario: 'Excelente habitación, muy cómoda y con una vista espectacular. El servicio impecable.',
          fecha: new Date('2024-01-15')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔽 NUEVO: Verificar si el usuario es el dueño de la review
  const esMiReview = (review) => {
    if (!user || !review.usuario) return false;
    
    const usuarioId = typeof review.usuario === 'object' 
      ? review.usuario._id 
      : review.usuario;
    
    return usuarioId === user.id;
  };

  // 🔽 NUEVO: Abrir menú de opciones
  const abrirMenu = (event, review) => {
    setMenuAnchor(event.currentTarget);
    setReviewSeleccionada(review);
  };

  // 🔽 NUEVO: Cerrar menú
  const cerrarMenu = () => {
    setMenuAnchor(null);
    setReviewSeleccionada(null);
  };

  // 🔽 NUEVO: Preparar edición
  const prepararEdicion = (review) => {
    setFormEditar({
      calificacion: review.calificacion,
      comentario: review.comentario
    });
    setDialogEditar(true);
    cerrarMenu();
  };

  // 🔽 NUEVO: Editar review
  const editarReview = async () => {
    if (!reviewSeleccionada) return;

    try {
      setEditando(true);
      
      const response = await api.put(`/reviews/${reviewSeleccionada._id}`, formEditar);
      
      console.log('✅ Review editada:', response.data);
      
      // Actualizar la lista
      cargarReviews();
      setDialogEditar(false);
      setReviewSeleccionada(null);
      
    } catch (error) {
      console.error('❌ Error editando review:', error);
      alert(error.response?.data?.error || 'Error al editar la reseña');
    } finally {
      setEditando(false);
    }
  };

  // 🔽 NUEVO: Eliminar review
  const eliminarReview = async () => {
    if (!reviewSeleccionada) return;

    try {
      setEliminando(true);
      
      await api.delete(`/reviews/${reviewSeleccionada._id}`);
      
      console.log('✅ Review eliminada');
      
      // Actualizar la lista
      cargarReviews();
      setDialogEliminar(false);
      setReviewSeleccionada(null);
      
    } catch (error) {
      console.error('❌ Error eliminando review:', error);
      alert(error.response?.data?.error || 'Error al eliminar la reseña');
    } finally {
      setEliminando(false);
    }
  };

  const manejarReviewAgregada = () => {
    cargarReviews();
  };

  const manejarFiltroEstrellas = (estrellas) => {
    setFiltroEstrellas(filtroEstrellas === estrellas ? null : estrellas);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerIniciales = (usuario) => {
    const nombre = typeof usuario === 'object' ? usuario.nombre : usuario;
    
    if (!nombre || typeof nombre !== 'string') {
      return 'US';
    }
    
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const obtenerNombreUsuario = (usuario) => {
    return typeof usuario === 'object' ? usuario.nombre : usuario;
  };

  if (loading && !reviews.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header con botón de escribir reseña */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">
          Reseñas de Huéspedes
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<RateReview />}
          onClick={() => setMostrarFormulario(true)}
          sx={{
            background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
            }
          }}
        >
          Escribir Reseña
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas y Filtros */}
      {estadisticas && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="700" color="primary.main">
                  {estadisticas.promedio.toFixed(1)}
                </Typography>
                <EstrellasCalificacion 
                  calificacion={estadisticas.promedio} 
                  tamaño="medium" 
                  readonly 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {estadisticas.totalReviews} {estadisticas.totalReviews === 1 ? 'reseña' : 'reseñas'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box>
                {[5, 4, 3, 2, 1].map(estrellas => {
                  const datos = estadisticas.distribucion.find(d => d.estrellas === estrellas);
                  return (
                    <Box 
                      key={estrellas}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        cursor: 'pointer',
                        opacity: filtroEstrellas && filtroEstrellas !== estrellas ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => manejarFiltroEstrellas(estrellas)}
                    >
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        {estrellas} estrella{estrellas !== 1 ? 's' : ''}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={datos?.porcentaje || 0}
                        sx={{ 
                          flexGrow: 1, 
                          mx: 2, 
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#FBBF24'
                          }
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                        {datos?.cantidad || 0}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                {filtroEstrellas && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Filtrado por:
                    </Typography>
                    <Chip
                      label={`${filtroEstrellas} estrella${filtroEstrellas !== 1 ? 's' : ''}`}
                      onDelete={() => setFiltroEstrellas(null)}
                      color="primary"
                      variant="outlined"
                    />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* 🔽 ACTUALIZADO: Lista de Reviews con opciones */}
      <Box sx={{ mb: 3 }}>
        {(reviews.slice(0, mostrarTodas ? reviews.length : 3)).map((review, index) => (
          <Card key={review._id || index} sx={{ mb: 2, position: 'relative' }}>
            <CardContent sx={{ position: 'relative' }}>
              <FormatQuote 
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 40,
                  color: 'primary.50',
                  transform: 'scaleX(-1)'
                }} 
              />
              
              {/* 🔽 NUEVO: Botón de opciones si es mi review */}
              {esMiReview(review) && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'background.paper'
                  }}
                  onClick={(e) => abrirMenu(e, review)}
                >
                  <MoreVert />
                </IconButton>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  {obtenerIniciales(review.usuario)}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {obtenerNombreUsuario(review.usuario)}
                      </Typography>
                      {esMiReview(review) && (
                        <Chip 
                          label="Tu reseña" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                    <EstrellasCalificacion 
                      calificacion={review.calificacion} 
                      tamaño="small" 
                      readonly 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {formatearFecha(review.fecha)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {review.comentario}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Menú de opciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={cerrarMenu}
      >
        <MenuItem onClick={() => prepararEdicion(reviewSeleccionada)}>
          <Edit sx={{ mr: 1 }} />
          Editar reseña
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setDialogEliminar(true);
            cerrarMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Eliminar reseña
        </MenuItem>
      </Menu>

      {/* Dialog de Editar */}
      <Dialog open={dialogEditar} onClose={() => setDialogEditar(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Reseña</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Calificación</Typography>
            <Rating
              value={formEditar.calificacion}
              onChange={(e, value) => setFormEditar({...formEditar, calificacion: value})}
              size="large"
              icon={<Star sx={{ fontSize: 32 }} />}
              emptyIcon={<Star sx={{ fontSize: 32 }} />}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tu reseña"
              value={formEditar.comentario}
              onChange={(e) => setFormEditar({...formEditar, comentario: e.target.value})}
              sx={{ mt: 2 }}
              placeholder="Comparte tu experiencia..."
              helperText={`${formEditar.comentario.length}/500 caracteres (mínimo 10)`}
              inputProps={{ maxLength: 500 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogEditar(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={editarReview}
            disabled={editando || formEditar.calificacion === 0 || formEditar.comentario.length < 10}
            startIcon={editando ? <CircularProgress size={20} /> : <Edit />}
          >
            {editando ? 'Editando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Eliminar */}
      <Dialog open={dialogEliminar} onClose={() => setDialogEliminar(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogEliminar(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={eliminarReview}
            disabled={eliminando}
            startIcon={eliminando ? <CircularProgress size={20} /> : <Delete />}
          >
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botón Ver Más/Menos */}
      {reviews.length > 3 && (
        <Box sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setMostrarTodas(!mostrarTodas)}
            endIcon={mostrarTodas ? <ExpandLess /> : <ExpandMore />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.50',
                borderColor: 'primary.dark'
              }
            }}
          >
            {mostrarTodas ? 'Ver menos' : `Ver todas las ${reviews.length} reseñas`}
          </Button>
        </Box>
      )}

      {/* Sin resultados */}
      {!loading && reviews.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, mb: 3 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {filtroEstrellas ? 'No hay reseñas con esta calificación' : 'Aún no hay reseñas'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filtroEstrellas ? 'Intenta con otra calificación' : 'Sé el primero en dejar una reseña'}
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<RateReview />}
            onClick={() => setMostrarFormulario(true)}
            sx={{
              background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
              }
            }}
          >
            Escribir la Primera Reseña
          </Button>
        </Box>
      )}

      {/* Formulario de Review */}
      <FormularioReview 
        habitacionId={habitacionId}
        open={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        onReviewAgregada={manejarReviewAgregada}
      />
    </Box>
  );
};

export default ListaReviews;