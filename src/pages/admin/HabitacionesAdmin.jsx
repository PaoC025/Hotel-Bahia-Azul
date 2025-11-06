import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const HabitacionesAdmin = () => {
  const { token } = useAuth();
  const [habitaciones, setHabitaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Cargar habitaciones
  useEffect(() => {
    axios
      .get("/habitaciones")
      .then((res) => setHabitaciones(res.data))
      .catch((err) => console.error("Error cargando habitaciones:", err));
  }, []);

  // Previsualizar imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Abrir modal para crear o editar
  const handleOpenDialog = (habitacion = null) => {
    if (habitacion) {
      setEditando(habitacion);
      setNombre(habitacion.nombre);
      setDescripcion(habitacion.descripcion);
      setPrecio(habitacion.precio);
      setPreview(habitacion.imagenes?.[0] ? `${apiUrl}${habitacion.imagenes[0]}` : null);
    } else {
      setEditando(null);
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen(null);
      setPreview(null);
    }
    setOpen(true);
  };

  // Guardar habitación (crear o editar)
  const handleSubmit = async () => {
    if (!nombre || !descripcion || !precio) {
      setAlert({ open: true, message: "Todos los campos son obligatorios.", severity: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    if (imagen) formData.append("imagenes", imagen);

    try {
      let res;
      if (editando) {
        res = await axios.put(`/habitaciones/${editando._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setHabitaciones((prev) =>
          prev.map((h) => (h._id === editando._id ? res.data.habitacion : h))
        );
      } else {
        res = await axios.post("/habitaciones", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setHabitaciones((prev) => [...prev, res.data.habitacion]);
      }

      setAlert({
        open: true,
        message: editando ? "✅ Habitación actualizada." : "✅ Habitación agregada.",
        severity: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar habitación:", error);
      setAlert({
        open: true,
        message: "❌ Error al guardar habitación. Revisa el servidor o token.",
        severity: "error",
      });
    }
  };

  // Eliminar habitación
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta habitación?")) return;
    try {
      await axios.delete(`/habitaciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitaciones((prev) => prev.filter((h) => h._id !== id));
      setAlert({ open: true, message: "🗑️ Habitación eliminada.", severity: "info" });
    } catch (error) {
      console.error("Error eliminando habitación:", error);
      setAlert({ open: true, message: "❌ Error eliminando habitación.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h4" gutterBottom>
        Administración de Habitaciones
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Nueva Habitación
      </Button>

      {/* Listado */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {habitaciones.map((hab) => (
          <Grid item xs={12} sm={6} md={4} key={hab._id}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, position: "relative" }}>
              {hab.imagenes?.length > 0 && (
                <img
                  src={`${apiUrl}${hab.imagenes[0]}`}
                  alt={hab.nombre}
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 6,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
              )}
              <Typography variant="h6">{hab.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                {hab.descripcion.slice(0, 70)}...
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                💰 ${hab.precio}
              </Typography>

              <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton color="primary" onClick={() => handleOpenDialog(hab)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(hab._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editando ? "Editar Habitación" : "Nueva Habitación"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            label="Precio"
            fullWidth
            margin="dense"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              {editando ? "Cambiar imagen" : "Subir imagen"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ marginTop: 10, width: "100%", borderRadius: "6px" }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editando ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HabitacionesAdmin;

