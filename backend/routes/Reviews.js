import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Reviews.js';
import Habitacion from '../models/Habitacion.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'; // 🔽 USANDO TU MIDDLEWARE

const router = express.Router();

// 🔹 MIDDLEWARE DE AUTENTICACIÓN PARA USUARIOS REGULARES
const requireAuth = authenticateToken;

// 🔹 GET - Obtener reviews de una habitación (PÚBLICO - sin autenticación)
router.get('/habitacion/:habitacionId', async (req, res) => {
  try {
    const { habitacionId } = req.params;
    const { limit = 10, page = 1, rating } = req.query;

    console.log(`📥 Solicitando reviews para habitación: ${habitacionId}`);

    // Validar que la habitación existe
    const habitacion = await Habitacion.findById(habitacionId);
    if (!habitacion) {
      console.log('❌ Habitación no encontrada');
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    // Construir filtro
    const filter = { 
      habitacion: habitacionId, 
      estado: 'aprobado' 
    };

    if (rating) {
      filter.calificacion = parseInt(rating);
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('🔍 Buscando reviews con filtro:', filter);
    
    const reviews = await Review.find(filter)
      .populate('usuario', 'nombre email') // 🔽 POPULATE PARA OBTENER DATOS DEL USUARIO
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Review.countDocuments(filter);

    // Calcular estadísticas
    const stats = await Review.aggregate([
      { $match: { habitacion: new mongoose.Types.ObjectId(habitacionId), estado: 'aprobado' } },
      {
        $group: {
          _id: '$habitacion',
          promedio: { $avg: '$calificacion' },
          totalReviews: { $sum: 1 },
          distribucion: {
            $push: '$calificacion'
          }
        }
      }
    ]);

    const estadisticas = stats[0] ? {
      promedio: Math.round(stats[0].promedio * 10) / 10,
      totalReviews: stats[0].totalReviews,
      distribucion: [1, 2, 3, 4, 5].map(star => ({
        estrellas: star,
        cantidad: stats[0].distribucion.filter(r => r === star).length,
        porcentaje: Math.round((stats[0].distribucion.filter(r => r === star).length / stats[0].totalReviews) * 100)
      }))
    } : {
      promedio: 0,
      totalReviews: 0,
      distribucion: [1, 2, 3, 4, 5].map(star => ({
        estrellas: star,
        cantidad: 0,
        porcentaje: 0
      }))
    };

    console.log(`✅ Enviando ${reviews.length} reviews para habitación ${habitacionId}`);

    res.json({
      reviews,
      estadisticas,
      paginacion: {
        pagina: parseInt(page),
        totalPaginas: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNext: (parseInt(page) * parseInt(limit)) < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo reviews:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 POST - Crear nueva review (REQUIERE AUTENTICACIÓN)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { habitacion, calificacion, comentario } = req.body;
    const usuarioId = req.user._id; // 🔽 OBTENIDO DE TU MIDDLEWARE
    const usuarioNombre = req.user.nombre; // 🔽 NOMBRE DEL USUARIO AUTENTICADO

    console.log('📥 Recibiendo nueva review de usuario autenticado:', {
      usuarioId,
      usuarioNombre,
      habitacion,
      calificacion,
      comentario: comentario?.substring(0, 50) + '...'
    });

    // Validaciones básicas
    if (!habitacion || !calificacion || !comentario) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos: habitacion, calificacion, comentario' 
      });
    }

    if (calificacion < 1 || calificacion > 5) {
      console.log('❌ Calificación inválida:', calificacion);
      return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
    }

    if (comentario.length < 10) {
      console.log('❌ Comentario muy corto');
      return res.status(400).json({ error: 'El comentario debe tener al menos 10 caracteres' });
    }

    if (comentario.length > 500) {
      console.log('❌ Comentario muy largo');
      return res.status(400).json({ error: 'El comentario no puede exceder los 500 caracteres' });
    }

    // Validar que la habitación existe
    const habitacionExiste = await Habitacion.findById(habitacion);
    if (!habitacionExiste) {
      console.log('❌ Habitación no encontrada:', habitacion);
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    console.log('✅ Habitación encontrada:', habitacionExiste.nombre);

    // Verificar si el usuario ya hizo una review para esta habitación
    const reviewExistente = await Review.findOne({
      habitacion,
      usuario: usuarioId
    });

    if (reviewExistente) {
      console.log('❌ Usuario ya tiene una review para esta habitación');
      return res.status(400).json({ 
        error: 'Ya has enviado una reseña para esta habitación. Puedes editar tu reseña existente.' 
      });
    }

    // Crear nueva review
    const nuevaReview = new Review({
      habitacion,
      usuario: usuarioId,
      calificacion: parseInt(calificacion),
      comentario: comentario.trim(),
      estado: 'aprobado'
    });

    await nuevaReview.save();
    console.log('✅ Review guardada en la base de datos');

    // Popular para respuesta
    const reviewGuardada = await Review.findById(nuevaReview._id)
      .populate('habitacion', 'nombre')
      .populate('usuario', 'nombre email');

    res.status(201).json({
      message: '¡Gracias por tu reseña! Tu opinión ayuda a otros viajeros.',
      review: {
        _id: reviewGuardada._id,
        usuario: reviewGuardada.usuario.nombre, // 🔽 NOMBRE DEL USUARIO
        calificacion: reviewGuardada.calificacion,
        comentario: reviewGuardada.comentario,
        fecha: reviewGuardada.fecha,
        habitacion: reviewGuardada.habitacion.nombre
      }
    });

  } catch (error) {
    console.error('❌ Error creando review:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de habitación inválido' });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 PUT - Actualizar review del usuario (REQUIERE AUTENTICACIÓN)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;
    const usuarioId = req.user._id;

    console.log('✏️ Actualizando review:', { id, usuarioId });

    // Buscar la review y verificar que pertenece al usuario
    const review = await Review.findOne({ _id: id, usuario: usuarioId })
      .populate('usuario', 'nombre');

    if (!review) {
      console.log('❌ Review no encontrada o no pertenece al usuario');
      return res.status(404).json({ 
        error: 'Review no encontrada o no tienes permisos para editarla' 
      });
    }

    // Actualizar solo los campos permitidos
    if (calificacion !== undefined) {
      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
      }
      review.calificacion = calificacion;
    }

    if (comentario !== undefined) {
      if (comentario.length < 10) {
        return res.status(400).json({ error: 'El comentario debe tener al menos 10 caracteres' });
      }
      if (comentario.length > 500) {
        return res.status(400).json({ error: 'El comentario no puede exceder los 500 caracteres' });
      }
      review.comentario = comentario.trim();
    }

    review.fecha = new Date(); // Actualizar fecha de modificación

    await review.save();

    console.log('✅ Review actualizada exitosamente');

    res.json({
      message: 'Review actualizada exitosamente',
      review: {
        _id: review._id,
        usuario: review.usuario.nombre,
        calificacion: review.calificacion,
        comentario: review.comentario,
        fecha: review.fecha
      }
    });

  } catch (error) {
    console.error('Error actualizando review:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 DELETE - Eliminar review del usuario (REQUIERE AUTENTICACIÓN)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user._id;

    console.log('🗑️ Eliminando review:', { id, usuarioId });

    const review = await Review.findOneAndDelete({ _id: id, usuario: usuarioId });

    if (!review) {
      console.log('❌ Review no encontrada o no pertenece al usuario');
      return res.status(404).json({ 
        error: 'Review no encontrada o no tienes permisos para eliminarla' 
      });
    }

    console.log('✅ Review eliminada exitosamente');

    res.json({ message: 'Review eliminada exitosamente' });

  } catch (error) {
    console.error('Error eliminando review:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 GET - Obtener reviews del usuario autenticado
router.get('/mis-reviews', requireAuth, async (req, res) => {
  try {
    const usuarioId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    console.log('📋 Obteniendo reviews del usuario:', usuarioId);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find({ usuario: usuarioId })
      .populate('habitacion', 'nombre categoria imagenes')
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ usuario: usuarioId });

    res.json({
      reviews,
      paginacion: {
        pagina: parseInt(page),
        totalPaginas: Math.ceil(total / parseInt(limit)),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Error obteniendo reviews del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 GET - Obtener todas las reviews (para administración - requiere rol admin)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    console.log('👮 Admin obteniendo todas las reviews');

    const { page = 1, limit = 10, estado } = req.query;
    
    const filter = {};
    if (estado) {
      filter.estado = estado;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find(filter)
      .populate('habitacion', 'nombre categoria')
      .populate('usuario', 'nombre email')
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      paginacion: {
        pagina: parseInt(page),
        totalPaginas: Math.ceil(total / parseInt(limit)),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Error obteniendo todas las reviews:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 GET - Obtener estadísticas generales de reviews
router.get('/estadisticas/generales', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas generales');

    const stats = await Review.aggregate([
      { $match: { estado: 'aprobado' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          promedioGeneral: { $avg: '$calificacion' },
          habitacionesReview: { $addToSet: '$habitacion' }
        }
      }
    ]);

    const estadisticas = stats[0] ? {
      totalReviews: stats[0].totalReviews,
      promedioGeneral: Math.round(stats[0].promedioGeneral * 10) / 10,
      totalHabitaciones: stats[0].habitacionesReview.length
    } : {
      totalReviews: 0,
      promedioGeneral: 0,
      totalHabitaciones: 0
    };

    res.json(estadisticas);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 PUT - Actualizar estado de una review (para administración)
router.put('/:id/estado', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    console.log('👮 Admin actualizando estado de review:', { id, estado });

    if (!['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    )
    .populate('habitacion', 'nombre')
    .populate('usuario', 'nombre email');

    if (!review) {
      return res.status(404).json({ error: 'Review no encontrada' });
    }

    res.json({
      message: `Review ${estado} exitosamente`,
      review
    });

  } catch (error) {
    console.error('Error actualizando review:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;