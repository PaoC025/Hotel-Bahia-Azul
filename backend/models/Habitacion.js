import mongoose from "mongoose";

const habitacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  precioOriginal: { type: Number },
  oferta: { type: Boolean, default: false },
  comodidades: [{ type: String }],
  imagenes: [{ type: String }]
});

const Habitacion = mongoose.model("Habitacion", habitacionSchema);
export default Habitacion;