import express from "express";
import Habitacion from "../models/Habitacion.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import fs from "fs";
import path from "path";

const router = express.Router();

/* 
  Todas las rutas de aca están protegidas por adminAuth
  Solo los usuarios con rol 'admin' tendran acceso 
*/

// post para Crear nueva habitación
router.post("/", adminAuth, uploadSingle, async (req, res) => {
  try {
    const { nombre, descripcion, capacidad, precio, comodidades } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevaHabitacion = new Habitacion({
      nombre,
      descripcion,
      capacidad,
      precio,
      comodidades: comodidades?.split(",") || [],
      imagen
    });

    await nuevaHabitacion.save();
    res.status(201).json({
      message: "✅ Habitación creada exitosamente",
      habitacion: nuevaHabitacion
    });
  } catch (error) {
    console.error("❌ Error creando habitación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// get para Obtener todas las habitaciones
router.get("/", adminAuth, async (req, res) => {
  try {
    const habitaciones = await Habitacion.find().sort({ createdAt: -1 });
    res.json(habitaciones);
  } catch (error) {
    console.error("❌ Error listando habitaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// put para Editar habitación
router.put("/:id", adminAuth, uploadSingle, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, capacidad, precio, comodidades } = req.body;

    const habitacion = await Habitacion.findById(id);
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    // Si se sube una nueva imagen, eliminar la anterior
    if (req.file && habitacion.imagen) {
      const oldPath = path.join("backend", habitacion.imagen);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      habitacion.imagen = `/uploads/${req.file.filename}`;
    }

    habitacion.nombre = nombre || habitacion.nombre;
    habitacion.descripcion = descripcion || habitacion.descripcion;
    habitacion.capacidad = capacidad || habitacion.capacidad;
    habitacion.precio = precio || habitacion.precio;
    habitacion.comodidades = comodidades
      ? comodidades.split(",")
      : habitacion.comodidades;

    await habitacion.save();
    res.json({ message: "✅ Habitación actualizada", habitacion });
  } catch (error) {
    console.error("❌ Error actualizando habitación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// delete para Eliminar habitación
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const habitacion = await Habitacion.findById(id);

    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    // Eliminar imagen asociada
    if (habitacion.imagen) {
      const imagePath = path.join("backend", habitacion.imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await habitacion.deleteOne();
    res.json({ message: "✅ Habitación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando habitación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
