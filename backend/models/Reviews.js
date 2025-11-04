import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  habitacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitacion',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'La calificación debe ser un número entero'
    }
  },
  comentario: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'aprobado'
  }
}, {
  timestamps: true
});

// Índice para evitar reviews duplicadas
reviewSchema.index({ habitacion: 1, usuario: 1 }, { unique: true });

// Índices para búsquedas eficientes
reviewSchema.index({ habitacion: 1, fecha: -1 });
reviewSchema.index({ calificacion: 1 });
reviewSchema.index({ estado: 1 });
reviewSchema.index({ usuario: 1 });

// Método para formatear la respuesta
reviewSchema.methods.toJSON = function() {
  const review = this.toObject();
  delete review.__v;
  return review;
};

export default mongoose.model('Review', reviewSchema);