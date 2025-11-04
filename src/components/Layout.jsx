import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemText, Grid, Badge, Menu, MenuItem, Avatar, Chip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import NotificationCenter from "./NotificacionCenter.jsx";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { AccountCircle, DarkMode, LightMode, Login, Logout, PersonAdd } from "@mui/icons-material";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { reservas } = useAppContext();
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // Manejo del menu de usuario
  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  // Estilos condicionales para dark mode
  const appBarStyles = {
    bgcolor: 'background.paper',
    borderBottom: '1px solid',
    borderColor: 'divider',
    background: darkMode 
      ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };

  const drawerStyles = {
    width: 280,
    background: darkMode 
      ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    color: darkMode ? '#ffffff' : 'inherit'
  };

  const footerStyles = {
    bgcolor: 'primary.dark', 
    color: 'white', 
    py: 6,
    background: darkMode
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)'
  };

  const logoGradient = darkMode 
    ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
    : 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)';

  const reservarButtonGradient = darkMode
    ? 'linear-gradient(45deg, #ec407a 30%, #f48fb1 90%)'
    : 'linear-gradient(45deg, #F59E0B 30%, #FBBF24 90%)';

  const reservarButtonHoverGradient = darkMode
    ? 'linear-gradient(45deg, #d81b60 30%, #ec407a 90%)'
    : 'linear-gradient(45deg, #D97706 30%, #F59E0B 90%)';

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      bgcolor: 'background.default',
      color: 'text.primary',
      transition: 'all 0.3s ease'
    }}>
      {/* AppBar */}
      <AppBar position="sticky" color="default" elevation={1} sx={appBarStyles}>
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
                fontWeight: "bold",
                background: logoGradient,
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
                    backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
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
            <Box sx={{ 
              width: '1px', 
              height: 24, 
              bgcolor: darkMode ? 'grey.700' : 'grey.300', 
              mx: 1 
            }} />

            {/* Dark Mode Toggle */}
            <IconButton 
              onClick={toggleDarkMode}
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                  color: 'primary.main'
                }
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* Centro de Notificaciones */}
            <NotificationCenter />

            {/* Menú de usuario o botones de auth */}
            {isAuthenticated ? (
              <>
                {/* Usuario autenticado */}
                <Button
                  onClick={handleUserMenu}
                  startIcon={
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'primary.main',
                        fontSize: '0.8rem'
                      }}
                    >
                      {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  }
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.dark' : 'primary.50'
                    }
                  }}
                >
                  {user?.nombre?.split(' ')[0] || 'Usuario'}
                  {user?.rol === 'admin' && (
                    <Chip 
                      label="Admin" 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                    />
                  )}
                </Button>

                {/* Menu de usuario */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      bgcolor: darkMode ? 'background.paper' : 'background.paper'
                    }
                  }}
                >
                  <MenuItem disabled>
                    <ListItemText 
                      primary={user?.nombre} 
                      secondary={user?.email}
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        color: darkMode ? 'text.primary' : 'text.primary'
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        color: darkMode ? 'text.secondary' : 'text.secondary'
                      }}
                    />
                  </MenuItem>
                  
                  {user?.rol === 'admin' && (
                    <MenuItem 
                      component={Link} 
                      to="/admin"
                      onClick={handleCloseUserMenu}
                      sx={{
                        color: darkMode ? 'text.primary' : 'text.primary'
                      }}
                    >
                      <AccountCircle sx={{ mr: 1 }} />
                      Panel Admin
                    </MenuItem>
                  )}
                  
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      color: darkMode ? 'text.primary' : 'text.primary'
                    }}
                  >
                    <Logout sx={{ mr: 1 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Usuario no autenticado */
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                      color: 'primary.main'
                    }
                  }}
                >
                  Ingresar
                </Button>
                
                <Button 
                  component={Link}
                  to="/register"
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  sx={{ 
                    fontWeight: 600,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                      borderColor: 'primary.dark'
                    }
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}

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
                background: reservarButtonGradient,
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  background: reservarButtonHoverGradient,
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
                backgroundColor: darkMode ? 'primary.dark' : 'primary.50'
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
        PaperProps={{ sx: drawerStyles }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header del drawer */}
          <Box sx={{ textAlign: 'center', mb: 3, pt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: logoGradient,
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
                  color: darkMode ? 'text.primary' : 'text.primary',
                  '&:hover': {
                    backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                    color: 'primary.main'
                  }
                }}
              >
                <ListItemText 
                  primary={text} 
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    textAlign: 'center',
                    color: 'inherit'
                  }}
                />
              </ListItem>
            ))}

            {/* Sección de autenticación en móvil */}
            {isAuthenticated ? (
              <>
                <ListItem 
                  button 
                  onClick={() => setOpen(false)}
                  sx={{ 
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                    color: darkMode ? 'text.primary' : 'text.primary',
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.main' : 'primary.100'
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography fontWeight="bold">
                           Hola, {user?.nombre?.split(' ')[0]}
                        </Typography>
                        {user?.rol === 'admin' && (
                          <Chip 
                            label="Admin" 
                            size="small" 
                            color="secondary" 
                            sx={{ mt: 0.5, height: 20, fontSize: '0.6rem' }}
                          />
                        )}
                      </Box>
                    } 
                  />
                </ListItem>
                
                {user?.rol === 'admin' && (
                  <ListItem 
                    button 
                    component={Link} 
                    to="/admin"
                    onClick={() => setOpen(false)}
                    sx={{ 
                      borderRadius: 2,
                      mb: 1,
                      color: darkMode ? 'text.primary' : 'text.primary',
                      '&:hover': {
                        backgroundColor: darkMode ? 'primary.dark' : 'primary.50'
                      }
                    }}
                  >
                    <ListItemText 
                      primary="Panel Admin" 
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        textAlign: 'center',
                        color: 'inherit'
                      }}
                    />
                  </ListItem>
                )}
                
                <ListItem 
                  button 
                  onClick={handleLogout}
                  sx={{ 
                    borderRadius: 2,
                    mb: 1,
                    color: darkMode ? 'text.primary' : 'text.primary',
                    '&:hover': {
                      backgroundColor: 'error.50',
                      color: 'error.main'
                    }
                  }}
                >
                  <ListItemText 
                    primary="Cerrar Sesión" 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      textAlign: 'center',
                      color: 'inherit'
                    }}
                  />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem 
                  button 
                  component={Link} 
                  to="/login"
                  onClick={() => setOpen(false)}
                  sx={{ 
                    borderRadius: 2,
                    mb: 1,
                    color: darkMode ? 'text.primary' : 'text.primary',
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.dark' : 'primary.50'
                    }
                  }}
                >
                  <ListItemText 
                    primary="Iniciar Sesión" 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      textAlign: 'center',
                      color: 'inherit'
                    }}
                  />
                </ListItem>
                
                <ListItem 
                  button 
                  component={Link} 
                  to="/register"
                  onClick={() => setOpen(false)}
                  sx={{ 
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: darkMode ? 'primary.dark' : 'primary.50',
                    color: darkMode ? 'text.primary' : 'text.primary',
                    '&:hover': {
                      backgroundColor: darkMode ? 'primary.main' : 'primary.100'
                    }
                  }}
                >
                  <ListItemText 
                    primary="📝 Registrarse" 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      textAlign: 'center',
                      color: 'inherit'
                    }}
                  />
                </ListItem>
              </>
            )}

            {/* Toggle Dark Mode en móvil */}
            <ListItem 
              button 
              onClick={() => {
                toggleDarkMode();
                setOpen(false);
              }}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                color: darkMode ? 'text.primary' : 'text.primary',
                '&:hover': {
                  backgroundColor: darkMode ? 'primary.dark' : 'primary.50'
                }
              }}
            >
              <ListItemText 
                primary={darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"} 
                primaryTypographyProps={{ 
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'inherit'
                }}
              />
            </ListItem>
            
            {/* Botón Reservar en móvil */}
            <ListItem 
              button 
              component={Link} 
              to="/contacto" 
              onClick={() => setOpen(false)}
              sx={{ 
                borderRadius: 2,
                mt: 1,
                background: reservarButtonGradient,
                color: 'white',
                '&:hover': {
                  background: reservarButtonHoverGradient,
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
      <Box sx={{ 
        flex: 1, 
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        {children}
      </Box>

      {/* FOOTER MEJORADO */}
      <Box sx={footerStyles}>
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