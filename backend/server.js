import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas existentes
import habitacionesRoutes from "./routes/habitaciones.js";
import blogRoutes from "./routes/blog.js";
import reservasRoutes from "./routes/reservas.js";
import testimoniosRoutes from "./routes/testimonios.js";
import reviewRoutes from "./routes/reviews.js";


// Importar NUEVAS rutas
import authRoutes from "./routes/auth.js";
import adminHabitacionesRoutes from "./routes/adminHabitaciones.js"


// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hotel_bahia_azul")
  .then(() => console.log(" Conectado a MongoDB"))
  .catch((err) => console.error(" Error conectando a MongoDB:", err));

// AÑADIR JWT_SECRET si no existe
if (!process.env.JWT_SECRET) {
  console.warn(" JWT_SECRET no configurado. Usando valor por defecto.");
  process.env.JWT_SECRET = 'hotel_bahia_azul'
}

// Rutas principales
app.use("/api/habitaciones", habitacionesRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/testimonios", testimoniosRoutes);
app.use("/api/reviews", reviewRoutes);

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔽 NUEVAS Rutas de autenticación
app.use("/api/auth", authRoutes);
//Rutas protegidas para usuarios admin
app.use("/admin/habitaciones", adminHabitacionesRoutes)

// Ruta de salud para verificar que el servidor funciona
app.get("/api/health", (req, res) => {
  res.json({ 
    message: " Servidor Hotel Bahía Azul funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Ruta no encontrada" 
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error("Error no manejado:", error);
  res.status(500).json({ 
    message: "Error interno del servidor" 
  });
});

//log para comprobar rutas cargadas
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("➡️ Ruta cargada:", r.route.path);
  }
});

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`Sistema de autenticación JWT activo`);
});