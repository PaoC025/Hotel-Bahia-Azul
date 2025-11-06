import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Grid,
} from "@mui/material";

function TestimoniosAdmin() {
  const [testimonios, setTestimonios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [contenido, setContenido] = useState("");
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar testimonios existentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/testimonios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTestimonios(res.data);
      } catch (err) {
        console.error("Error cargando testimonios:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Crear o editar testimonio
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      if (editando) {
        await axios.put(
          `/api/testimonios/${editando}`,
          { nombre, contenido },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/testimonios",
          { nombre, contenido },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNombre("");
      setContenido("");
      setEditando(null);
      const res = await axios.get("/api/testimonios");
      setTestimonios(res.data);
    } catch (error) {
      console.error("Error guardando testimonio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que deseas eliminar este testimonio?")) return;

    try {
      await axios.delete(`/api/testimonios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestimonios(testimonios.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error eliminando testimonio:", error);
    }
  };

  const handleEdit = (t) => {
    setNombre(t.nombre);
    setContenido(t.contenido);
    setEditando(t._id);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={3}>
        Gestión de Testimonios
      </Typography>

      {/* Formulario */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre del Cliente"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          {/* 🔹 Editor TinyMCE */}
          <Editor
            apiKey= "j8q4qvnbcson8mdwid4km9k1p2ri1fwpu1ezrmhn39y6j2rv"
            value={contenido}
            init={{
              height: 300,
              menubar: false,
              plugins:
                "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
              toolbar:
                "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={(content) => setContenido(content)}
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {editando ? "Actualizar Testimonio" : "Agregar Testimonio"}
            </Button>
            {editando && (
              <Button
                onClick={() => {
                  setEditando(null);
                  setNombre("");
                  setContenido("");
                }}
                sx={{ ml: 2 }}
                color="secondary"
                variant="outlined"
              >
                Cancelar
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Lista de testimonios */}
      <Grid container spacing={2}>
        {testimonios.map((t) => (
          <Grid item xs={12} md={6} key={t._id}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{t.nombre}</Typography>
              <div
                dangerouslySetInnerHTML={{ __html: t.contenido }}
                style={{ marginTop: 10 }}
              />
              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(t)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(t._id)}
                >
                  Eliminar
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TestimoniosAdmin;

