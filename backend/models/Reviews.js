import mongoose from "mongoose";

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
    max: 5
  },
  comentario: {
    type: String,
    required: true,
    maxlength: 500
  },
  titulo: {
    type: String,
    required: true,
    maxlength: 100
  },
  fechaEstadia: {
    type: Date,
    required: true
  },
  aprobado: {
    type: Boolean,
    default: false
  },
  respuestaAdmin: {
    texto: String,
    fecha: Date,
    administrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar reviews duplicadas
reviewSchema.index({ habitacion: 1, usuario: 1 }, { unique: true });

// Índice para búsquedas
reviewSchema.index({ habitacion: 1, aprobado: 1 });
reviewSchema.index({ calificacion: 1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;