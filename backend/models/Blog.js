import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  imagen: { type: String, default: "" },
  autor: { type: String, default: "Administrador" },
  fecha: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;