import express from "express";

const router = express.Router();

// Ejemplo temporal — luego conectaremos con tu base de datos
router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      nombre: "Habitación Deluxe",
      descripcion: "Amplia habitación con vista al mar",
      precio: 80,
      imagenes: ["/habitacion1.jpg"],
      comodidades: ["WiFi", "A/C", "TV"],
    },
  ]);
});

export default router;

