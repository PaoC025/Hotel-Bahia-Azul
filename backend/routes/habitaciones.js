import express from "express";
import Habitacion from "../models/Habitacion.js";

const router = express.Router();

// Metodo GET /api/habitaciones para listar habitaciones
router.get("/", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    res.json(habitaciones);
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    res.status(500).json({ message: "Error al obtener habitaciones." });
  }
});

// metodo POST /api/habitaciones para crear nueva habitación
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, precio, precioOriginal, oferta, comodidades, imagenes } = req.body;
    if (!nombre || !descripcion || !precio) {
      return res.status(400).json({ message: "Nombre, descripción y precio son obligatorios." });
    }

    const nuevaHabitacion = new Habitacion({
      nombre,
      descripcion,
      precio,
      precioOriginal,
      oferta,
      comodidades,
      imagenes
    });

    await nuevaHabitacion.save();
    res.json({ message: "✅ Habitación creada correctamente.", habitacion: nuevaHabitacion });
  } catch (error) {
    console.error("Error al crear habitación:", error);
    res.status(500).json({ message: "Error al crear la habitación." });
  }
});

export default router;

