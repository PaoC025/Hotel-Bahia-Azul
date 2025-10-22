import mongoose from "mongoose";

const testimonioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const Testimonio = mongoose.model("Testimonio", testimonioSchema);
export default Testimonio;
