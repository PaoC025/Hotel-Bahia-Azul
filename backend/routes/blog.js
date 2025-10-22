import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Metodo GET /api/blog para listar artículos
router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find().sort({ fecha: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error obteniendo los posts:", error);
    res.status(500).json({ message: "Error al obtener los posts." });
  }
});

// metodo POST /api/blog para crear nuevo artículo
router.post("/", async (req, res) => {
  try {
    const { titulo, contenido, imagen, autor } = req.body;
    if (!titulo || !contenido) {
      return res.status(400).json({ message: "Título y contenido son obligatorios." });
    }

    const nuevoPost = new Blog({ titulo, contenido, imagen, autor });
    await nuevoPost.save();

    res.json({ message: "✅ Post creado correctamente.", post: nuevoPost });
  } catch (error) {
    console.error("Error creando post:", error);
    res.status(500).json({ message: "Error al crear el post." });
  }
});

export default router;

