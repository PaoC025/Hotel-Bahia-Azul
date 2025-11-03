import mongoose from "mongoose";

const habitacionSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  descripcion: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  precio: { 
    type: Number, 
    required: true,
    min: 0
  },
  precioOriginal: { 
    type: Number,
    min: 0 
  },
  oferta: { 
    type: Boolean, 
    default: false 
  },
  comodidades: [{ 
    type: String,
    trim: true,
    maxlength: 50
  }],
  imagenes: [{ 
    type: String 
  }],
  // 🔽 NUEVO: Campo para filtro por personas
  capacidad: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 2
  },
  // 🔽 NUEVO: Campo para disponibilidad
  disponible: {
    type: Boolean,
    default: true
  },
  // 🔽 NUEVO: Campo para destacar habitaciones
  destacado: {
    type: Boolean,
    default: false
  },
  // 🔽 NUEVO: Campos para el sistema de reviews
  personas: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 2,
    validate: {
      validator: function(value) {
        return value >= 1 && value <= 10;
      },
      message: 'La capacidad debe estar entre 1 y 10 personas'
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: function(value) {
      return Math.round(value * 10) / 10; // Redondear a 1 decimal
    }
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // 🔽 NUEVO: Campos adicionales para mejor UX
  tamaño: {
    type: String,
    enum: ['pequeña', 'mediana', 'grande', 'suite'],
    default: 'mediana'
  },
  categoria: {
    type: String,
    enum: ['económica', 'estándar', 'superior', 'suite', 'presidencial'],
    default: 'estándar'
  },
  serviciosIncluidos: [{
    type: String,
    trim: true
  }],
  politicas: {
    checkIn: {
      type: String,
      default: "14:00"
    },
    checkOut: {
      type: String,
      default: "12:00"
    },
    mascotas: {
      type: Boolean,
      default: false
    },
    fumadores: {
      type: Boolean,
      default: false
    },
    niños: {
      type: Boolean,
      default: true
    }
  },
  // 🔽 NUEVO: Campos para gestión de inventario
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  metadatos: {
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ultimaActualizacion: {
      type: Date,
      default: Date.now
    },
    tags: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🔽 VIRTUAL: Calcular descuento si hay oferta
habitacionSchema.virtual('descuento').get(function() {
  if (this.precioOriginal && this.precioOriginal > this.precio) {
    const descuento = ((this.precioOriginal - this.precio) / this.precioOriginal) * 100;
    return Math.round(descuento);
  }
  return 0;
});

// 🔽 VIRTUAL: Verificar si está en stock
habitacionSchema.virtual('enStock').get(function() {
  return this.stock > 0 && this.disponible;
});

// 🔽 VIRTUAL: Obtener reviews populares (top 3)
habitacionSchema.virtual('reviewsPopulares', {
  ref: 'Review',
  localField: 'reviews',
  foreignField: '_id',
  options: { 
    sort: { calificacion: -1 },
    limit: 3,
    match: { aprobado: true }
  }
});

// 🔽 MÉTODO DE INSTANCIA: Marcar como no disponible
habitacionSchema.methods.marcarNoDisponible = function() {
  this.disponible = false;
  return this.save();
};

// 🔽 MÉTODO DE INSTANCIA: Marcar como disponible
habitacionSchema.methods.marcarDisponible = function() {
  this.disponible = true;
  return this.save();
};

// 🔽 MÉTODO DE INSTANCIA: Actualizar stock
habitacionSchema.methods.actualizarStock = function(cantidad) {
  this.stock = Math.max(0, this.stock + cantidad);
  this.disponible = this.stock > 0;
  return this.save();
};

// 🔽 MÉTODO DE INSTANCIA: Agregar review
habitacionSchema.methods.agregarReview = function(reviewId) {
  if (!this.reviews.includes(reviewId)) {
    this.reviews.push(reviewId);
  }
  return this.save();
};

// 🔽 MÉTODO DE INSTANCIA: Remover review
habitacionSchema.methods.removerReview = function(reviewId) {
  this.reviews = this.reviews.filter(id => id.toString() !== reviewId.toString());
  return this.save();
};

// 🔽 MÉTODO ESTÁTICO: Buscar por categoría
habitacionSchema.statics.buscarPorCategoria = function(categoria) {
  return this.find({ 
    categoria: new RegExp(categoria, 'i'),
    disponible: true 
  });
};

// 🔽 MÉTODO ESTÁTICO: Buscar por rango de precio
habitacionSchema.statics.buscarPorPrecio = function(min, max) {
  return this.find({
    precio: { $gte: min, $lte: max },
    disponible: true
  }).sort({ precio: 1 });
};

// 🔽 MÉTODO ESTÁTICO: Buscar por capacidad (personas)
habitacionSchema.statics.buscarPorCapacidad = function(personas) {
  return this.find({
    capacidad: { $gte: personas },
    disponible: true
  }).sort({ capacidad: 1 });
};

// 🔽 MÉTODO ESTÁTICO: Obtener habitaciones destacadas
habitacionSchema.statics.obtenerDestacadas = function() {
  return this.find({
    destacado: true,
    disponible: true
  }).sort({ calificacionPromedio: -1 }).limit(6);
};

// 🔽 MÉTODO ESTÁTICO: Obtener en oferta
habitacionSchema.statics.obtenerEnOferta = function() {
  return this.find({
    oferta: true,
    disponible: true
  }).sort({ precio: 1 });
};

// 🔽 MÉTODO ESTÁTICO: Buscar con filtros avanzados
habitacionSchema.statics.buscarAvanzado = function(filtros = {}) {
  const {
    categoria,
    precioMin,
    precioMax,
    personas,
    comodidades,
    tamaño,
    destacado,
    oferta
  } = filtros;

  const query = { disponible: true };

  if (categoria) query.categoria = new RegExp(categoria, 'i');
  if (precioMin !== undefined || precioMax !== undefined) {
    query.precio = {};
    if (precioMin !== undefined) query.precio.$gte = Number(precioMin);
    if (precioMax !== undefined) query.precio.$lte = Number(precioMax);
  }
  if (personas) query.capacidad = { $gte: Number(personas) };
  if (comodidades && comodidades.length > 0) {
    query.comodidades = { $all: comodidades };
  }
  if (tamaño) query.tamaño = tamaño;
  if (destacado !== undefined) query.destacado = destacado;
  if (oferta !== undefined) query.oferta = oferta;

  return this.find(query).sort({ calificacionPromedio: -1, precio: 1 });
};

// 🔽 MIDDLEWARE: Actualizar fecha de última actualización antes de guardar
habitacionSchema.pre('save', function(next) {
  this.metadatos.ultimaActualizacion = Date.now();
  next();
});

// 🔽 MIDDLEWARE: Limpiar comodidades vacías antes de guardar
habitacionSchema.pre('save', function(next) {
  if (this.comodidades) {
    this.comodidades = this.comodidades.filter(comodidad => 
      comodidad && comodidad.trim() !== ''
    );
  }
  if (this.serviciosIncluidos) {
    this.serviciosIncluidos = this.serviciosIncluidos.filter(servicio => 
      servicio && servicio.trim() !== ''
    );
  }
  next();
});

// 🔽 ÍNDICES para mejor performance
habitacionSchema.index({ precio: 1 });
habitacionSchema.index({ disponible: 1 });
habitacionSchema.index({ oferta: 1 });
habitacionSchema.index({ destacado: 1 });
habitacionSchema.index({ categoria: 1 });
habitacionSchema.index({ capacidad: 1 });
habitacionSchema.index({ tamaño: 1 });
habitacionSchema.index({ calificacionPromedio: -1 });
habitacionSchema.index({ 'metadatos.tags': 1 });

// Índice compuesto para búsquedas frecuentes
habitacionSchema.index({ 
  disponible: 1, 
  categoria: 1, 
  precio: 1 
});

habitacionSchema.index({ 
  disponible: 1, 
  capacidad: 1, 
  precio: 1 
});

const Habitacion = mongoose.model("Habitacion", habitacionSchema);
export default Habitacion;