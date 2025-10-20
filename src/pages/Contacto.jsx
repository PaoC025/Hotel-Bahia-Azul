import { useState } from "react";
import api from "../api/Axios";
import { Container, TextField, Button, Typography, Alert, Stack, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function Contacto() {
  const [form, setForm] = useState({ 
    nombre: "", 
    email: "", 
    telefono: "",
    fechaInicio: "", 
    fechaFin: "", 
    personas: 1,
    mensaje: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email || !form.telefono) {
      setStatus({ type: "error", message: "Por favor, complete los campos requeridos." });
      return;
    }

    setLoading(true);
    
    try {
      await api.post("/reservas", form);
      setStatus({ 
        type: "success", 
        message: "¡Reserva enviada exitosamente! Nos contactaremos contigo pronto." 
      });
      setForm({ 
        nombre: "", 
        email: "", 
        telefono: "",
        fechaInicio: "", 
        fechaFin: "", 
        personas: 1,
        mensaje: ""
      });
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: "Error al enviar la reserva. Por favor, intenta nuevamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" color="primary.main" mb={2} textAlign="center">
          Reservas & Contacto
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4} textAlign="center">
          Completa el formulario y nos pondremos en contacto contigo
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            {status && (
              <Alert severity={status.type} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Nombre Completo *"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Teléfono *"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Correo Electrónico *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Fecha de Check-in"
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha de Check-out"
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Número de Personas"
                type="number"
                name="personas"
                value={form.personas}
                onChange={handleChange}
                inputProps={{ min: 1, max: 10 }}
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              label="Mensaje Adicional"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              placeholder="Comentarios especiales, requerimientos específicos..."
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)'
              }}
            >
              {loading ? "Enviando..." : "Enviar Reserva"}
            </Button>
          </Stack>
        </Paper>

        {/* Información de contacto */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            ¿Prefieres contactarnos directamente?
          </Typography>
          <Typography color="text.secondary">
            📞 +58 422 876 5439 | ✉️ info@hotelbahiaazul.com<br/>
            📍 Isla de Margarita, Nueva Esparta, Venezuela
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
}