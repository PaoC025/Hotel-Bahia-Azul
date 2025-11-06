import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Box, Typography, Grid, Paper } from "@mui/material";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // limpia token si existe
    navigate("/"); // regresa al sitio principal
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Panel de Administración
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
        >
          Salir al sitio
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gestión de Habitaciones</Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              component={Link}
              to="/admin/habitaciones"
            >
              Ir a Habitaciones
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gestión de Blogs</Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              component={Link}
              to="/admin/blogs"
            >
              Ir a Blogs
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gestión de Testimonios</Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              component={Link}
              to="/admin/testimonios"
            >
              Ir a Testimonios
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gestión de Usuarios</Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              component={Link}
              to="/admin/usuarios"
            >
              Ir a Usuarios
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;

