import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  contenido: { 
    type: String, 
    required: true 
  },
  imagen: { 
    type: String, 
    default: "" 
  },
  autor: { 
    type: String, 
    default: "Administrador" 
  },
  autorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  resumen: {
    type: String,
    maxlength: 300
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  publicado: {
    type: Boolean,
    default: true
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Índices para mejor performance
blogSchema.index({ fecha: -1 });
blogSchema.index({ autorId: 1 });
blogSchema.index({ publicado: 1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;