import { useState, useEffect } from 'react'
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Chip
} from '@mui/material'
import { motion } from 'framer-motion'
import { CalendarToday, AccessTime } from '@mui/icons-material'

export default function Blog() {
  const [posts, setPosts] = useState([])

  const blogPosts = [
    {
      id: 1,
      titulo: "Playas Secretas de Margarita",
      excerpt: "Descubre las calas y playas vírgenes que solo los locales conocen en la Perla del Caribe.",
      fecha: "15 Ene 2024",
      categoria: "Playas",
      tiempoLectura: "6 min",
      icon: "🏝️"
    },
    {
      id: 2,
      titulo: "Gastronomía Margariteña",
      excerpt: "Deléitate con los sabores auténticos: empanadas, pescado frito y mucho más.",
      fecha: "12 Ene 2024",
      categoria: "Gastronomía",
      tiempoLectura: "5 min",
      icon: "🍤"
    },
    {
      id: 3,
      titulo: "Fortín de La Galera",
      excerpt: "Historia y vistas panorámicas desde este emblemático fuerte español en Juangriego.",
      fecha: "8 Ene 2024",
      categoria: "Historia",
      tiempoLectura: "4 min",
      icon: "🏰"
    },
    {
      id: 4,
      titulo: "Temporada de Tortugas 2024",
      excerpt: "Guía para el avistamiento responsable de tortugas marinas en playa Parguito.",
      fecha: "5 Ene 2024",
      categoria: "Naturaleza",
      tiempoLectura: "7 min",
      icon: "🐢"
    },
    {
      id: 5,
      titulo: "Carnaval de Margarita",
      excerpt: "Todo sobre las festividades más coloridas del Caribe venezolano.",
      fecha: "2 Ene 2024",
      categoria: "Cultura",
      tiempoLectura: "5 min",
      icon: "🎉"
    },
    {
      id: 6,
      titulo: "Ruta de los Pueblos",
      excerpt: "Recorrido por Santa Ana, El Valle y otros pueblos llenos de tradición.",
      fecha: "28 Dic 2023",
      categoria: "Turismo",
      tiempoLectura: "8 min",
      icon: "🛵"
    },
    {
      id: 7,
      titulo: "Deportes Acuáticos",
      excerpt: "Kitesurf, windsurf y snorkel en los mejores spots de la isla.",
      fecha: "25 Dic 2023",
      categoria: "Aventura",
      tiempoLectura: "6 min",
      icon: "🏄"
    },
    {
      id: 8,
      titulo: "Artesanía Local",
      excerpt: "El arte de las tejedoras de hamacas y los creadores de sombreros de cogollo.",
      fecha: "22 Dic 2023",
      categoria: "Artesanía",
      tiempoLectura: "4 min",
      icon: "🧵"
    }
  ]

  useEffect(() => {
    setPosts(blogPosts)
  }, [])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header con identidad margariteña */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          color="primary.main" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Blog Turístico Margarita
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          La Perla del Caribe Venezolano
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          Descubre los secretos, playas y cultura de nuestra hermosa isla
        </Typography>
      </Box>

      {/* Lista de posts sobre Margarita */}
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              sx={{ 
                mb: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'grey.100',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  borderColor: 'primary.light',
                  transform: 'translateX(4px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Icono con colores venezolanos */}
                <Box 
                  sx={{ 
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    border: '2px solid',
                    borderColor: 'primary.light'
                  }}
                >
                  {post.icon}
                </Box>

                {/* Contenido */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Categoría y fecha */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={post.categoria}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        height: '22px', 
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {post.fecha}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Título */}
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      lineHeight: 1.3,
                      mb: 1,
                      color: 'primary.main',
                      fontSize: '1rem'
                    }}
                  >
                    {post.titulo}
                  </Typography>

                  {/* Descripción */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.5,
                      mb: 1.5,
                      fontSize: '0.9rem'
                    }}
                  >
                    {post.excerpt}
                  </Typography>

                  {/* Footer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {post.tiempoLectura} de lectura
                      </Typography>
                    </Box>
                    
                    <Button 
                      variant="text" 
                      color="primary"
                      size="small"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        p: 0,
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'primary.50'
                        }
                      }}
                    >
                      Descubrir más →
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Newsletter con temática margariteña */}
      <Box 
        sx={{ 
          mt: 6,
          p: 4,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          ¿Amas Margarita tanto como nosotros?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Suscríbete y recibe guías exclusivas de la isla en tu correo
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="large"
          sx={{ 
            fontWeight: 700,
            px: 4,
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
          }}
        >
          Unirme a la Comunidad Margariteña
        </Button>
      </Box>

      {/* Sección de información adicional */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          🌴 Blog oficial del Hotel Bahía Azul - Margarita, Venezuela 🌊
        </Typography>
      </Box>
    </Container>
  )
}