import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  habitacion: { type: String, required: true },
  fechaEntrada: { type: String, required: true },
  fechaSalida: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.model("Reserva", reservaSchema);

