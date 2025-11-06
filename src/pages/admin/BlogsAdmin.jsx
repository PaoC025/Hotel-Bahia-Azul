import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import axios from '../../api/axios';

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blog');
      setBlogs(res.data);
    } catch (error) {
      console.error('Error cargando blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !contenido) return alert('Completa todos los campos');

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    if (imagen) formData.append('imagen', imagen);

    try {
      setLoading(true);
      if (editando) {
        await axios.put(`/blog/${editando}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/blog', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setTitulo('');
      setContenido('');
      setImagen(null);
      setEditando(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error guardando blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este blog?')) return;
    try {
      await axios.delete(`/blog/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error eliminando blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setTitulo(blog.titulo);
    setContenido(blog.contenido);
    setEditando(blog._id);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2} fontWeight="bold">
        📰 Administración de Blogs
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          {editando ? 'Editar Blog' : 'Nuevo Blog'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Título"
            fullWidth
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Editor
            apiKey= "j8q4qvnbcson8mdwid4km9k1p2ri1fwpu1ezrmhn39y6j2rv"
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
            }}
            value={contenido}
            onEditorChange={(newValue) => setContenido(newValue)}
          />

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Subir imagen
            <input hidden type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
          </Button>

          {imagen && (
            <Box mt={2}>
              <img src={URL.createObjectURL(imagen)} alt="preview" style={{ width: '150px', borderRadius: 8 }} />
            </Box>
          )}

          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : editando ? 'Guardar Cambios' : 'Publicar Blog'}
            </Button>
            {editando && (
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditando(null);
                  setTitulo('');
                  setContenido('');
                  setImagen(null);
                }}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      <Typography variant="h6" mb={2}>
        📚 Lista de blogs
      </Typography>

      <Grid container spacing={2}>
        {blogs.map((blog) => (
          <Grid item xs={12} md={6} lg={4} key={blog._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{blog.titulo}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {blog.contenido.replace(/<[^>]+>/g, '').substring(0, 100)}...
              </Typography>
              <Box mt={2}>
                <Button size="small" variant="contained" color="primary" onClick={() => handleEdit(blog)}>
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => handleDelete(blog._id)}
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
};

export default BlogsAdmin;
