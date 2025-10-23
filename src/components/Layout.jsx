import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemText, Grid, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import NotificationCenter from "./NotificacionCenter.jsx";
import { useAppContext } from "../context/AppContext";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { reservas } = useAppContext();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ 
        bgcolor: 'white',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid',
        borderColor: 'grey.100'
      }}>
        <Toolbar sx={{ 
          justifyContent: "space-between", 
          py: 1,
          maxWidth: 'lg',
          mx: 'auto',
          width: '100%'
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                fontWeight: "bold",
                background: 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.3rem', md: '1.8rem' }
              }}
            >
              Hotel Bahía Azul
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: "none", md: "flex" }, 
            gap: 0.5, 
            alignItems: 'center' 
          }}>
            {["Servicios", "Habitaciones", "Blog", "Contacto"].map((text) => (
              <Button 
                key={text} 
                component={Link} 
                to={`/${text.toLowerCase()}`}
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {text}
              </Button>
            ))}
            
            {/* Separador */}
            <Box sx={{ width: '1px', height: 24, bgcolor: 'grey.300', mx: 1 }} />

            {/* Centro de Notificaciones */}
            <NotificationCenter />

            {/* Botón Reservar */}
            <Button 
              variant="contained" 
              color="secondary"
              component={Link}
              to="/contacto"
              sx={{ 
                ml: 1,
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 700,
                fontSize: '0.95rem',
                background: 'linear-gradient(45deg, #F59E0B 30%, #FBBF24 90%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <Badge 
                badgeContent={reservas.length} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.6rem',
                    height: '16px',
                    minWidth: '16px',
                    transform: 'scale(0.8) translate(50%, -50%)'
                  } 
                }}
              >
                Reservar
              </Badge>
            </Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton 
            sx={{ 
              display: { md: "none" },
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.50'
              }
            }} 
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (menu móvil) */}
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header del drawer */}
          <Box sx={{ textAlign: 'center', mb: 3, pt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                background: 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hotel Bahía Azul
            </Typography>
          </Box>

          <List>
            {["Servicios", "Habitaciones", "Blog", "Contacto"].map((text) => (
              <ListItem 
                button 
                key={text} 
                component={Link} 
                to={`/${text.toLowerCase()}`} 
                onClick={() => setOpen(false)}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'primary.50',
                    color: 'primary.main'
                  }
                }}
              >
                <ListItemText 
                  primary={text} 
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                />
              </ListItem>
            ))}
            
            {/* Botón Reservar en móvil */}
            <ListItem 
              button 
              component={Link} 
              to="/contacto" 
              onClick={() => setOpen(false)}
              sx={{ 
                borderRadius: 2,
                mt: 2,
                background: 'linear-gradient(45deg, #F59E0B 30%, #FBBF24 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ListItemText 
                primary={
                  <Badge 
                    badgeContent={reservas.length} 
                    color="error"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontSize: '0.6rem',
                        height: '16px',
                        minWidth: '16px'
                      } 
                    }}
                  >
                    <Typography fontWeight="bold">
                      Reservar
                    </Typography>
                  </Badge>
                } 
                primaryTypographyProps={{ 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* FOOTER MEJORADO - Sin clima */}
      <Box sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white', 
        py: 6,
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)'
      }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                🌴 Hotel Bahía Azul
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Lujo y tranquilidad frente al mar Caribe. 
                Vive experiencias inolvidables con nosotros en la hermosa Isla de Margarita.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                📞 Contacto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                📍 Isla de Margarita, Nueva Esparta, Venezuela<br/>
                📞 +58 422 876 5439<br/>
                ✉️ info@hotelbahiaazul.com
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                🔗 Enlaces Rápidos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {["Servicios", "Habitaciones", "Blog", "Contacto"].map((text) => (
                  <Button 
                    key={text} 
                    component={Link} 
                    to={`/${text.toLowerCase()}`}
                    sx={{ 
                      justifyContent: 'flex-start',
                      color: 'white',
                      opacity: 0.8,
                      fontSize: '0.9rem',
                      px: 0,
                      '&:hover': { 
                        opacity: 1,
                        backgroundColor: 'transparent',
                        color: 'secondary.main',
                        transform: 'translateX(4px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    → {text}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.2)', 
            mt: 4, 
            pt: 3, 
            textAlign: 'center' 
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 Hotel Bahía Azul. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}