import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitacionesRoutes from "./routes/habitaciones.js";
import blogRoutes from "./routes/blog.js";
import reservasRoutes from "./routes/reservas.js";
import testimoniosRoutes from "./routes/testimonios.js";
import mongoose from "mongoose";

//Conexion a bd
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/habitaciones", habitacionesRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/testimonios", testimoniosRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
