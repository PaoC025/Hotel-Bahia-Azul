import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemText, Grid } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" color="default" elevation={2} sx={{ bgcolor: 'white' }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                fontWeight: "bold",
                fontSize: '1.5rem'
              }}
            >
              Hotel Bahía Azul
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {["Servicios", "Habitaciones", "Blog", "Contacto"].map((text) => (
              <Button 
                key={text} 
                component={Link} 
                to={`/${text.toLowerCase()}`}
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {text}
              </Button>
            ))}
            <Button 
              variant="contained" 
              color="secondary"
              component={Link}
              to="/contacto"
              sx={{ ml: 1 }}
            >
              Reservar
            </Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton sx={{ display: { md: "none" } }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (menu móvil) */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {["Servicios", "Habitaciones", "Blog", "Contacto"].map((text) => (
            <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}`} onClick={() => setOpen(false)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <ListItem button component={Link} to="/contacto" onClick={() => setOpen(false)}>
            <ListItemText primary="Reservar" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
          </ListItem>
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* FOOTER MEJORADO */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 6, mt: 'auto' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Hotel Bahía Azul
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Lujo y tranquilidad frente al mar Caribe. 
                Vive experiencias inolvidables con nosotros.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Contacto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                📍 Isla de Margarita, Nueva Esparta, Venezuela<br/>
                📞 +58 422 876 5439<br/>
                ✉️ info@hotelbahiaazul.com
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Enlaces Rápidos
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
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 Hotel Bahía Azul. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}