import express from "express";
import Habitacion from "../models/Habitacion.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { uploadMultiple, getImageUrl } from "../middleware/uploadMiddleware.js";
import fs from "fs";

const router = express.Router();

// 🔽 GET PÚBLICO - Cualquiera puede ver habitaciones
router.get("/", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    res.json(habitaciones);
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    res.status(500).json({ message: "Error al obtener habitaciones." });
  }
});

// 🔽 GET por ID - Obtener una habitación específica
router.get("/:id", async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id);
    
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada." });
    }
    
    res.json(habitacion);
  } catch (error) {
    console.error("Error al obtener habitación:", error);
    res.status(500).json({ message: "Error al obtener la habitación." });
  }
});

// 🔽 POST PROTEGIDO - Solo admin puede crear habitaciones CON IMÁGENES
router.post("/", adminAuth, uploadMultiple, async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      precio, 
      precioOriginal, 
      oferta, 
      comodidades, 
      capacidad, 
      personas,
      disponible, 
      destacado,
      tamaño,
      categoria,
      stock,
      serviciosIncluidos,
      politicas
    } = req.body;
    
    // Validaciones
    if (!nombre || !descripcion || !precio) {
      // Limpiar archivos subidos si hay error de validación
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error("Error limpiando archivos:", unlinkError);
          }
        });
      }
      return res.status(400).json({ message: "Nombre, descripción y precio son obligatorios." });
    }

    // Procesar imágenes subidas
    let imagenes = [];
    if (req.files && req.files.length > 0) {
      imagenes = req.files.map(file => getImageUrl(file.filename));
      console.log(`🖼️ ${imagenes.length} imágenes subidas para habitación: ${nombre}`);
    }

    // Procesar comodidades (puede venir como string o array)
    let comodidadesArray = [];
    if (comodidades) {
      comodidadesArray = Array.isArray(comodidades) 
        ? comodidades 
        : comodidades.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar servicios incluidos
    let serviciosArray = [];
    if (serviciosIncluidos) {
      serviciosArray = Array.isArray(serviciosIncluidos) 
        ? serviciosIncluidos 
        : serviciosIncluidos.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar políticas
    let politicasObj = {};
    if (politicas) {
      try {
        politicasObj = typeof politicas === 'string' ? JSON.parse(politicas) : politicas;
      } catch (e) {
        console.warn("Error parseando políticas, usando valores por defecto");
      }
    }

    // Procesar booleanos
    const esOferta = oferta === 'true' || oferta === true;
    const estaDisponible = disponible === undefined ? true : (disponible === 'true' || disponible === true);
    const esDestacado = destacado === 'true' || destacado === true;

    const nuevaHabitacion = new Habitacion({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      precioOriginal: precioOriginal ? Number(precioOriginal) : null,
      oferta: esOferta,
      comodidades: comodidadesArray,
      imagenes: imagenes,
      capacidad: capacidad ? Number(capacidad) : 2,
      personas: personas ? Number(personas) : (capacidad ? Number(capacidad) : 2),
      disponible: estaDisponible,
      destacado: esDestacado,
      tamaño: tamaño || 'mediana',
      categoria: categoria || 'estándar',
      stock: stock ? Number(stock) : 1,
      serviciosIncluidos: serviciosArray,
      politicas: {
        checkIn: politicasObj.checkIn || "14:00",
        checkOut: politicasObj.checkOut || "12:00",
        mascotas: politicasObj.mascotas !== undefined ? (politicasObj.mascotas === 'true' || politicasObj.mascotas === true) : false,
        fumadores: politicasObj.fumadores !== undefined ? (politicasObj.fumadores === 'true' || politicasObj.fumadores === true) : false,
        niños: politicasObj.niños !== undefined ? (politicasObj.niños === 'true' || politicasObj.niños === true) : true
      },
      metadatos: {
        creadoPor: req.user._id
      }
    });

    await nuevaHabitacion.save();
    
    console.log(`🏨 Habitación "${nombre}" creada por admin: ${req.user.email} con ${imagenes.length} imágenes`);
    
    res.status(201).json({ 
      message: "✅ Habitación creada correctamente.", 
      habitacion: nuevaHabitacion 
    });
    
  } catch (error) {
    console.error("❌ Error al crear habitación:", error);
    
    // Limpiar archivos subidos si hay error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error("Error limpiando archivos después del error:", unlinkError);
        }
      });
    }
    
    res.status(500).json({ 
      message: "Error al crear la habitación.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 🔽 PUT PROTEGIDO - Actualizar habitación CON IMÁGENES
router.put("/:id", adminAuth, uploadMultiple, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      precio, 
      precioOriginal, 
      oferta, 
      comodidades, 
      capacidad, 
      personas,
      disponible, 
      destacado, 
      imagenesExistentes,
      tamaño,
      categoria,
      stock,
      serviciosIncluidos,
      politicas
    } = req.body;

    // Buscar habitación existente
    const habitacionExistente = await Habitacion.findById(id);
    if (!habitacionExistente) {
      // Limpiar archivos nuevos si la habitación no existe
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error("Error limpiando archivos:", unlinkError);
          }
        });
      }
      return res.status(404).json({ message: "Habitación no encontrada." });
    }

    // Procesar nuevas imágenes subidas
    let nuevasImagenes = [];
    if (req.files && req.files.length > 0) {
      nuevasImagenes = req.files.map(file => getImageUrl(file.filename));
      console.log(`🖼️ ${nuevasImagenes.length} nuevas imágenes subidas para habitación: ${nombre || habitacionExistente.nombre}`);
    }

    // Combinar imágenes existentes con nuevas
    let imagenesCombinadas = [];
    if (imagenesExistentes) {
      const imagenesExistentesArray = Array.isArray(imagenesExistentes) 
        ? imagenesExistentes 
        : JSON.parse(imagenesExistentes);
      imagenesCombinadas = [...imagenesExistentesArray, ...nuevasImagenes];
    } else {
      imagenesCombinadas = [...habitacionExistente.imagenes, ...nuevasImagenes];
    }

    // Procesar comodidades
    let comodidadesArray = habitacionExistente.comodidades;
    if (comodidades) {
      comodidadesArray = Array.isArray(comodidades) 
        ? comodidades 
        : comodidades.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar servicios incluidos
    let serviciosArray = habitacionExistente.serviciosIncluidos;
    if (serviciosIncluidos) {
      serviciosArray = Array.isArray(serviciosIncluidos) 
        ? serviciosIncluidos 
        : serviciosIncluidos.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar políticas
    let politicasObj = habitacionExistente.politicas;
    if (politicas) {
      try {
        const nuevasPoliticas = typeof politicas === 'string' ? JSON.parse(politicas) : politicas;
        politicasObj = { ...politicasObj, ...nuevasPoliticas };
      } catch (e) {
        console.warn("Error parseando políticas, manteniendo las existentes");
      }
    }

    // Procesar booleanos
    const esOferta = oferta !== undefined ? (oferta === 'true' || oferta === true) : habitacionExistente.oferta;
    const estaDisponible = disponible !== undefined ? (disponible === 'true' || disponible === true) : habitacionExistente.disponible;
    const esDestacado = destacado !== undefined ? (destacado === 'true' || destacado === true) : habitacionExistente.destacado;

    const habitacionActualizada = await Habitacion.findByIdAndUpdate(
      id,
      {
        nombre: nombre ? nombre.trim() : habitacionExistente.nombre,
        descripcion: descripcion ? descripcion.trim() : habitacionExistente.descripcion,
        precio: precio ? Number(precio) : habitacionExistente.precio,
        precioOriginal: precioOriginal !== undefined ? (precioOriginal ? Number(precioOriginal) : null) : habitacionExistente.precioOriginal,
        oferta: esOferta,
        comodidades: comodidadesArray,
        imagenes: imagenesCombinadas,
        capacidad: capacidad ? Number(capacidad) : habitacionExistente.capacidad,
        personas: personas ? Number(personas) : habitacionExistente.personas,
        disponible: estaDisponible,
        destacado: esDestacado,
        tamaño: tamaño || habitacionExistente.tamaño,
        categoria: categoria || habitacionExistente.categoria,
        stock: stock !== undefined ? Number(stock) : habitacionExistente.stock,
        serviciosIncluidos: serviciosArray,
        politicas: politicasObj,
        'metadatos.ultimaActualizacion': Date.now()
      },
      { new: true, runValidators: true }
    );

    console.log(`✏️ Habitación "${habitacionActualizada.nombre}" actualizada por admin: ${req.user.email}`);
    
    res.json({ 
      message: "✅ Habitación actualizada correctamente.", 
      habitacion: habitacionActualizada 
    });
    
  } catch (error) {
    console.error("❌ Error actualizando habitación:", error);
    
    // Limpiar archivos nuevos si hay error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error("Error limpiando archivos después del error:", unlinkError);
        }
      });
    }
    
    res.status(500).json({ 
      message: "Error al actualizar la habitación.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 🔽 DELETE PROTEGIDO - Eliminar habitación
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const habitacionEliminada = await Habitacion.findByIdAndDelete(id);
    
    if (!habitacionEliminada) {
      return res.status(404).json({ message: "Habitación no encontrada." });
    }

    console.log(`🗑️ Habitación "${habitacionEliminada.nombre}" eliminada por admin: ${req.user.email}`);
    
    res.json({ 
      message: "✅ Habitación eliminada correctamente." 
    });
    
  } catch (error) {
    console.error("❌ Error eliminando habitación:", error);
    res.status(500).json({ message: "Error al eliminar la habitación." });
  }
});

// 🔽 GET - Filtrar habitaciones por cantidad de personas
router.get("/filtro/personas", async (req, res) => {
  try {
    const { personas } = req.query;
    
    if (!personas) {
      return res.status(400).json({ message: "El parámetro 'personas' es requerido." });
    }

    const numPersonas = parseInt(personas);
    if (isNaN(numPersonas) || numPersonas < 1) {
      return res.status(400).json({ message: "El número de personas debe ser un número válido mayor a 0." });
    }

    const habitaciones = await Habitacion.find({
      capacidad: { $gte: numPersonas },
      disponible: true
    });

    res.json({
      message: `✅ Habitaciones para ${numPersonas} persona(s) encontradas.`,
      total: habitaciones.length,
      habitaciones
    });

  } catch (error) {
    console.error("Error filtrando habitaciones:", error);
    res.status(500).json({ message: "Error al filtrar las habitaciones." });
  }
});

// 🔽 GET - Buscar por categoría
router.get("/categoria/:categoria", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find({ 
      categoria: new RegExp(req.params.categoria, 'i'),
      disponible: true 
    }).sort({ precio: 1 });
    
    res.json({
      message: `✅ Habitaciones de categoría '${req.params.categoria}' encontradas.`,
      total: habitaciones.length,
      habitaciones
    });
  } catch (error) {
    console.error("Error buscando por categoría:", error);
    res.status(500).json({ message: "Error al buscar habitaciones." });
  }
});

// 🔽 GET - Obtener habitaciones destacadas
router.get("/destacadas", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find({ 
      destacado: true,
      disponible: true 
    }).sort({ calificacionPromedio: -1 }).limit(6);
    
    res.json({
      message: "✅ Habitaciones destacadas encontradas.",
      total: habitaciones.length,
      habitaciones
    });
  } catch (error) {
    console.error("Error obteniendo destacadas:", error);
    res.status(500).json({ message: "Error al obtener habitaciones destacadas." });
  }
});

// 🔽 GET - Búsqueda avanzada
router.get("/buscar/avanzado", async (req, res) => {
  try {
    const { categoria, precioMin, precioMax, personas, comodidades, tamaño, destacado, oferta } = req.query;
    
    const query = { disponible: true };

    if (categoria) query.categoria = new RegExp(categoria, 'i');
    if (precioMin || precioMax) {
      query.precio = {};
      if (precioMin) query.precio.$gte = Number(precioMin);
      if (precioMax) query.precio.$lte = Number(precioMax);
    }
    if (personas) query.capacidad = { $gte: Number(personas) };
    if (comodidades) {
      const comodidadesArray = Array.isArray(comodidades) ? comodidades : [comodidades];
      query.comodidades = { $in: comodidadesArray };
    }
    if (tamaño) query.tamaño = tamaño;
    if (destacado !== undefined) query.destacado = destacado === 'true';
    if (oferta !== undefined) query.oferta = oferta === 'true';

    const habitaciones = await Habitacion.find(query).sort({ precio: 1 });
    
    res.json({
      message: `✅ ${habitaciones.length} habitación(es) encontrada(s).`,
      total: habitaciones.length,
      habitaciones
    });

  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    res.status(500).json({ message: "Error en búsqueda avanzada." });
  }
});

// 🔽 PUT - Actualizar stock
router.put("/:id/stock", adminAuth, async (req, res) => {
  try {
    const { cantidad } = req.body;
    const habitacion = await Habitacion.findById(req.params.id);
    
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada." });
    }

    habitacion.stock = Math.max(0, habitacion.stock + Number(cantidad));
    habitacion.disponible = habitacion.stock > 0;
    await habitacion.save();
    
    console.log(`Stock de habitación "${habitacion.nombre}" actualizado por admin: ${req.user.email}`);
    
    res.json({
      message: "Stock actualizado correctamente.",
      habitacion
    });

  } catch (error) {
    console.error("Error actualizando stock:", error);
    res.status(500).json({ message: "Error al actualizar stock." });
  }
});

// PUT - Actualizar disponibilidad
router.put("/:id/disponibilidad", adminAuth, async (req, res) => {
  try {
    const { disponible } = req.body;
    const habitacion = await Habitacion.findByIdAndUpdate(
      req.params.id,
      { disponible },
      { new: true }
    );
    
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada." });
    }

    const estado = disponible ? 'disponible' : 'no disponible';
    
    res.json({
      message: `Habitación marcada como ${estado}.`,
      habitacion
    });

  } catch (error) {
    console.error("Error actualizando disponibilidad:", error);
    res.status(500).json({ message: "Error al actualizar disponibilidad." });
  }
});

// GET - Obtener habitaciones en oferta
router.get("/ofertas", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find({ 
      oferta: true,
      disponible: true 
    }).sort({ precio: 1 });
    
    res.json({
      message: "Habitaciones en oferta encontradas.",
      total: habitaciones.length,
      habitaciones
    });
  } catch (error) {
    console.error("Error obteniendo ofertas:", error);
    res.status(500).json({ message: "Error al obtener habitaciones en oferta." });
  }
});

export default router;