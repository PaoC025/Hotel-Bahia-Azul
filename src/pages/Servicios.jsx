import { Container, Grid, Card, CardContent, Typography, Box, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import { 
  Pool, 
  Restaurant, 
  Spa, 
  DirectionsCar,
  FitnessCenter,
  LocalBar,
  CheckCircle
} from "@mui/icons-material";

export default function Servicios() {
  const serviciosCompletos = [
    {
      id: 1,
      titulo: "Piscina Infinity",
      descripcion: "Disfruta de nuestra espectacular piscina infinita con vista directa al mar Caribe.",
      icon: <Pool sx={{ fontSize: 32 }} />, // 🔽 Reducido de 40 a 32
      imagen: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80", // 🔽 Imagen más pequeña
      categoria: "Recreación",
      caracteristicas: ["Vista panorámica", "Climatizada", "Servicio de bar", "Horario extendido"],
      horario: "7:00 AM - 10:00 PM"
    },
    {
      id: 2,
      titulo: "Restaurante Gourmet",
      descripcion: "Saborea nuestra cocina de autor que fusiona sabores caribeños con técnicas internacionales.",
      icon: <Restaurant sx={{ fontSize: 32 }} />,
      imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
      categoria: "Gastronomía",
      caracteristicas: ["Desayuno buffet", "Mariscos frescos", "Opción vegetariana", "Postres artesanales"],
      horario: "6:30 AM - 11:00 PM"
    },
    {
      id: 3,
      titulo: "Spa & Bienestar",
      descripcion: "Relájate en nuestro oasis de bienestar con tratamientos premium y productos naturales.",
      icon: <Spa sx={{ fontSize: 32 }} />,
      imagen: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
      categoria: "Bienestar",
      caracteristicas: ["Masajes terapéuticos", "Tratamientos faciales", "Circuito de aguas", "Yoga matutino"],
      horario: "9:00 AM - 9:00 PM"
    },
    {
      id: 4,
      titulo: "Transporte Privado",
      descripcion: "Servicio de transporte exclusivo para tu comodidad. Traslados al aeropuerto incluidos.",
      icon: <DirectionsCar sx={{ fontSize: 32 }} />,
      imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
      categoria: "Transporte",
      caracteristicas: ["Shuttle gratuito", "Vehículos de lujo", "Choferes profesionales", "Servicio 24/7"],
      horario: "24 horas"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}> {/* 🔽 Reducido py de 8 a 6 */}
      {/* Header */}
      <Box textAlign="center" mb={4}> {/* 🔽 Reducido mb de 6 a 4 */}
        <Typography 
          variant="h4"  // 🔽 Cambiado de h3 a h4
          color="primary.main" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Nuestros Servicios
        </Typography>
        <Typography 
          variant="body1" // 🔽 Cambiado de h6 a body1
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto' }}
        >
          Descubre todos los servicios premium para tu comodidad
        </Typography>
      </Box>

      {/* Grid de Servicios - Más compacto */}
      <Grid container spacing={3}> {/* 🔽 Reducido spacing de 4 a 3 */}
        {serviciosCompletos.map((servicio, index) => (
          <Grid item xs={12} key={servicio.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} // 🔽 Reducido y de 30 a 20
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, // 🔽 Reducido de 3 a 2
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', // 🔽 Sombras más sutiles
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Grid container>
                  {/* Columna de Imagen - Más pequeña */}
                  <Grid item xs={12} md={3}> {/* 🔽 Reducido de md={4} a md={3} */}
                    <Box 
                      sx={{ 
                        height: { xs: '180px', md: '100%' }, // 🔽 Reducido altura
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={servicio.imagen}
                        alt={servicio.titulo}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Columna de Contenido - Más compacta */}
                  <Grid item xs={12} md={9}> {/* 🔽 Ajustado de md={8} a md={9} */}
                    <CardContent sx={{ p: 3 }}> {/* 🔽 Reducido p de 4 a 3 */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {servicio.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" fontWeight={700} color="primary.main"> {/* 🔽 h5 a h6 */}
                              {servicio.titulo}
                            </Typography>
                            <Chip 
                              label={servicio.categoria}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> {/* 🔽 body1 a body2 */}
                            {servicio.descripcion}
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2}> {/* 🔽 Reducido spacing de 3 a 2 */}
                        {/* Características */}
                        <Grid item xs={12} md={7}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}> {/* 🔽 h6 a subtitle2 */}
                            Características
                          </Typography>
                          <List dense sx={{ py: 0 }}>
                            {servicio.caracteristicas.map((caracteristica, idx) => (
                              <ListItem key={idx} sx={{ py: 0.25 }}> {/* 🔽 Reducido py */}
                                <ListItemIcon sx={{ minWidth: 30 }}> {/* 🔽 Reducido minWidth */}
                                  <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} /> {/* 🔽 Reducido fontSize */}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}> {/* 🔽 Texto más pequeño */}
                                      {caracteristica}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>

                        {/* Información Adicional */}
                        <Grid item xs={12} md={5}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Información
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                              Horario:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                              {servicio.horario}
                            </Typography>
                          </Box>
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.8rem' }} // 🔽 Botón más pequeño
                          >
                            Reservar
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action - Más compacto */}
      <Box 
        sx={{ 
          mt: 6, // 🔽 Reducido de 8 a 6
          p: 3,  // 🔽 Reducido de 4 a 3
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}> {/* 🔽 h4 a h5 */}
          ¿Necesitas un servicio personalizado?
        </Typography>
        <Typography sx={{ mb: 2, opacity: 0.9, fontSize: '0.9rem' }}> {/* 🔽 Texto más pequeño */}
          Nuestro equipo está listo para crear experiencias a tu medida
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="medium" // 🔽 large a medium
          sx={{ fontWeight: 600 }}
        >
          Contactar para Servicios Especiales
        </Button>
      </Box>
    </Container>
  );
}