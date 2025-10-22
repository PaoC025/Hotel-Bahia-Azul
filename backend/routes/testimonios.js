import express from "express";
import Testimonio from "../models/Testimonio.js";

const router = express.Router();

// 🧾 GET /api/testimonios → Listar todos
router.get("/", async (req, res) => {
  try {
    const testimonios = await Testimonio.find().sort({ fecha: -1 });
    res.json(testimonios);
  } catch (error) {
    console.error("Error al obtener los testimonios:", error);
    res.status(500).json({ message: "Error al obtener los testimonios." });
  }
});

// ✍️ POST /api/testimonios → Crear nuevo testimonio
router.post("/", async (req, res) => {
  try {
    const { nombre, comentario } = req.body;
    if (!nombre || !comentario) {
      return res.status(400).json({ message: "Nombre y comentario son obligatorios." });
    }

    const nuevoTestimonio = new Testimonio({ nombre, comentario });
    await nuevoTestimonio.save();

    res.json({ message: "✅ Testimonio guardado correctamente.", testimonio: nuevoTestimonio });
  } catch (error) {
    console.error("Error al crear testimonio:", error);
    res.status(500).json({ message: "Error al crear el testimonio." });
  }
});

export default router;
