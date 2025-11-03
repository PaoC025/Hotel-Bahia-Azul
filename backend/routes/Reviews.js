import express from "express";
import Review from "../models/Reviews.js";
import Habitacion from "../models/Habitacion.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET - Obtener reviews aprobadas de una habitación (público)
router.get("/habitacion/:habitacionId", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      habitacion: req.params.habitacionId, 
      aprobado: true 
    })
    .populate('usuario', 'nombre')
    .sort({ createdAt: -1 });
    
    res.json({
      message: "Reviews obtenidas correctamente.",
      reviews
    });
  } catch (error) {
    console.error("Error obteniendo reviews:", error);
    res.status(500).json({ message: "Error al obtener las reviews." });
  }
});

// GET - Obtener mis reviews (usuario autenticado)
router.get("/mis-reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ usuario: req.user._id })
                              .populate('habitacion', 'nombre')
                              .sort({ createdAt: -1 });
    res.json({
      message: "✅ Tus reviews obtenidas correctamente.",
      reviews
    });
  } catch (error) {
    console.error("Error obteniendo mis reviews:", error);
    res.status(500).json({ message: "Error al obtener las reviews." });
  }
});

// POST - Crear review (usuario autenticado)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { habitacion, calificacion, comentario, titulo, fechaEstadia } = req.body;
    
    // Validaciones
    if (!habitacion || !calificacion || !comentario || !titulo || !fechaEstadia) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el usuario ya reviewó esta habitación
    const reviewExistente = await Review.findOne({ 
      habitacion, 
      usuario: req.user._id 
    });
    
    if (reviewExistente) {
      return res.status(400).json({ message: "Ya has reviewado esta habitación." });
    }

    const nuevaReview = new Review({
      habitacion,
      usuario: req.user._id,
      calificacion: Number(calificacion),
      comentario,
      titulo,
      fechaEstadia: new Date(fechaEstadia),
      aprobado: false
    });

    await nuevaReview.save();

    // Agregar review a la habitación
    await Habitacion.findByIdAndUpdate(
      habitacion,
      { $push: { reviews: nuevaReview._id } }
    );

    res.status(201).json({
      message: "Review creada correctamente. Esperando aprobación del administrador.",
      review: nuevaReview
    });

  } catch (error) {
    console.error("Error creando review:", error);
    res.status(500).json({ message: "Error al crear la review." });
  }
});

// PUT - Aprobar/desaprobar review (solo admin)
router.put("/:id/aprobar", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { aprobado } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { aprobado },
      { new: true }
    ).populate('habitacion usuario');

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada." });
    }

    const estado = aprobado ? 'aprobada' : 'rechazada';
    console.log(`Review ${estado} por admin: ${req.user.email}`);
    
    res.json({
      message: `Review ${estado} correctamente.`,
      review
    });

  } catch (error) {
    console.error("Error actualizando review:", error);
    res.status(500).json({ message: "Error al actualizar la review." });
  }
});

// DELETE - Eliminar review (solo admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ message: "Review no encontrada." });
    }

    // Remover review de la habitación
    await Habitacion.findByIdAndUpdate(
      review.habitacion,
      { $pull: { reviews: review._id } }
    );

    console.log(`Review eliminada por admin: ${req.user.email}`);
    
    res.json({ 
      message: "Review eliminada correctamente." 
    });

  } catch (error) {
    console.error("Error eliminando review:", error);
    res.status(500).json({ message: "Error al eliminar la review." });
  }
});

export default router;