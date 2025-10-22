import express from "express";
const router = express.Router();

// Ruta temporal de prueba
router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      titulo: "Los mejores lugares turísticos cerca del Hotel Bahía Azul",
      autor: "Equipo Bahía Azul",
      fecha: "2025-10-20",
      contenido: "Explora los rincones más encantadores del estado...",
    },
  ]);
});

export default router;
