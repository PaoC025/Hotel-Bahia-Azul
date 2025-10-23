// pages/Contacto.jsx - CORREGIDO
import { useState, useContext } from "react";
import api from "../api/Axios";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Stack, 
  Box, 
  Paper,
  Grid
} from "@mui/material";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

export default function Contacto() {
  const [form, setForm] = useState({ 
    nombre: "", 
    correo: "",  // 🔽 CAMBIADO de 'email' a 'correo'
    telefono: "",
    fechaEntrada: "",  // 🔽 CAMBIADO de 'fechaInicio' a 'fechaEntrada'
    fechaSalida: "",   // 🔽 CAMBIADO de 'fechaFin' a 'fechaSalida'
    habitacion: "",
    personas: 1,
    mensaje: ""
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const { addReserva, addNotification } = useAppContext();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) newErrors.nombre = 'El nombre es requerido';
        else if (value.trim().length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        else delete newErrors.nombre;
        break;
        
      case 'correo':  // 🔽 CAMBIADO de 'email' a 'correo'
        if (!value) newErrors.correo = 'El correo es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.correo = 'Correo inválido';
        else delete newErrors.correo;
        break;
        
      case 'telefono':
        if (!value) newErrors.telefono = 'El teléfono es requerido';
        else if (!/^\d{10,15}$/.test(value.replace(/\D/g, ''))) newErrors.telefono = 'Teléfono inválido';
        else delete newErrors.telefono;
        break;
        
      case 'fechaEntrada':  // 🔽 CAMBIADO de 'fechaInicio' a 'fechaEntrada'
        if (value && form.fechaSalida && new Date(value) > new Date(form.fechaSalida)) {
          newErrors.fechaEntrada = 'La fecha de entrada no puede ser posterior a la de salida';
        } else {
          delete newErrors.fechaEntrada;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validar campos requeridos para el backend
    const requiredFields = ['nombre', 'correo', 'habitacion', 'fechaEntrada', 'fechaSalida'];
    const isValid = requiredFields.every(key => {
      validateField(key, form[key]);
      return form[key] && !errors[key];
    });
    
    if (!isValid) {
      addNotification('Error en el formulario', 'Por favor, completa los campos requeridos', 'error');
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    
    try {
      // 🔽 PREPARAR DATOS PARA EL BACKEND
      const reservaData = {
        nombre: form.nombre,
        correo: form.correo,
        habitacion: form.habitacion,
        fechaEntrada: form.fechaEntrada,
        fechaSalida: form.fechaSalida,
        // Campos adicionales que el backend no usa pero podemos guardar localmente
        telefono: form.telefono,
        personas: form.personas,
        mensaje: form.mensaje
      };

      console.log('📤 Enviando reserva al backend:', reservaData);

      const response = await api.post("/reservas", reservaData);
      
      console.log('✅ Respuesta del backend:', response.data);
      
      // 🔽 ACTUALIZAR CONTEXTO CON LOS DATOS CORRECTOS
      addReserva({
        ...reservaData,
        id: response.data.reserva?._id || Date.now(),
        fechaCreacion: new Date().toISOString(),
        estado: 'confirmada'
      });
      
      setSubmitStatus({ 
        type: "success", 
        message: "¡Reserva enviada exitosamente! Te hemos enviado un correo de confirmación." 
      });
      
      addNotification('¡Reserva exitosa!', 'Te hemos enviado un correo de confirmación', 'success');
      
      // Limpiar formulario
      setForm({ 
        nombre: "", 
        correo: "", 
        telefono: "",
        fechaEntrada: "", 
        fechaSalida: "", 
        personas: 1,
        mensaje: "",
        habitacion: ""
      });
      setTouched({});
      
    } catch (error) {
      console.error('❌ Error enviando reserva:', error);
      
      let errorMessage = "Error al enviar la reserva. Por favor, intenta nuevamente.";
      
      if (error.response) {
        // Error del servidor
        errorMessage = error.response.data?.message || errorMessage;
        console.error('Detalles del error:', error.response.data);
      } else if (error.request) {
        // Error de conexión
        errorMessage = "No se pudo conectar al servidor. Verifica tu conexión.";
      }
      
      setSubmitStatus({ 
        type: "error", 
        message: errorMessage 
      });
      
      addNotification('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    form.nombre && form.correo && form.habitacion && form.fechaEntrada && form.fechaSalida;

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
          {/* Mostrar estado del envío */}
          {submitStatus && (
            <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
              {submitStatus.message}
            </Alert>
          )}

          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre Completo *"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.nombre && !!errors.nombre}
                  helperText={touched.nombre && errors.nombre}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.telefono && !!errors.telefono}
                  helperText={touched.telefono && errors.telefono}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Correo Electrónico *"
              name="correo"  // 🔽 CAMBIADO de 'email' a 'correo'
              type="email"
              value={form.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.correo && !!errors.correo}
              helperText={touched.correo && errors.correo}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Entrada *"
                  type="date"
                  name="fechaEntrada"  // 🔽 CAMBIADO de 'fechaInicio' a 'fechaEntrada'
                  value={form.fechaEntrada}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fechaEntrada && !!errors.fechaEntrada}
                  helperText={touched.fechaEntrada && errors.fechaEntrada}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Salida *"
                  type="date"
                  name="fechaSalida"  // 🔽 CAMBIADO de 'fechaFin' a 'fechaSalida'
                  value={form.fechaSalida}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fechaSalida && !!errors.fechaSalida}
                  helperText={touched.fechaSalida && errors.fechaSalida}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número de Personas"
                  type="number"
                  name="personas"
                  value={form.personas}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 10 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Habitación Preferida *"
                  name="habitacion"
                  value={form.habitacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.habitacion && !!errors.habitacion}
                  helperText={touched.habitacion && errors.habitacion}
                  fullWidth
                  placeholder="Ej: Suite Presidencial"
                  required
                />
              </Grid>
            </Grid>

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
              disabled={loading || !isFormValid}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FBBF24 30%, #F59E0B 90%)',
                '&:disabled': {
                  background: 'grey.300'
                }
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