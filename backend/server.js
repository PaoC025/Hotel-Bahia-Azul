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

dotenv.config({path: './backend/.env'});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/habitaciones", habitacionesRoutes);
app.use("/blog", blogRoutes);
app.use("/reservas", reservasRoutes);
app.use("/testimonios", testimoniosRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
