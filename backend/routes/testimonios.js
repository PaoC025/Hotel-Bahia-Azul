import express from "express";
import Testimonio from "../models/Testimonio.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js"; // 🔽 IMPORTAR

const router = express.Router();

// 🔽 GET PÚBLICO - Cualquiera puede ver testimonios
router.get("/", async (req, res) => {
  try {
    const testimonios = await Testimonio.find().sort({ fecha: -1 });
    res.json(testimonios);
  } catch (error) {
    console.error("Error al obtener los testimonios:", error);
    res.status(500).json({ message: "Error al obtener los testimonios." });
  }
});

// 🔽 POST MIXTO - Usuarios autenticados pueden crear, admin puede crear sin restricciones
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { nombre, comentario } = req.body;
    
    if (!nombre || !comentario) {
      return res.status(400).json({ message: "Nombre y comentario son obligatorios." });
    }

    // 🔽 Si es cliente, puede usar su nombre real o un alias
    const nombreParaTestimonio = req.user.rol === 'admin' ? nombre : req.user.nombre;

    const nuevoTestimonio = new Testimonio({ 
      nombre: nombreParaTestimonio, 
      comentario 
    });
    
    await nuevoTestimonio.save();

    console.log(`Testimonio creado por: ${req.user.email}`);
    
    res.json({ 
      message: "Testimonio guardado correctamente.", 
      testimonio: nuevoTestimonio 
    });
    
  } catch (error) {
    console.error("Error al crear testimonio:", error);
    res.status(500).json({ message: "Error al crear el testimonio." });
  }
});

// 🔽 DELETE PROTEGIDO - Solo admin puede eliminar testimonios
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const testimonioEliminado = await Testimonio.findByIdAndDelete(id);
    
    if (!testimonioEliminado) {
      return res.status(404).json({ message: "Testimonio no encontrado." });
    }

    console.log(`Testimonio eliminado por admin: ${req.user.email}`);
    
    res.json({ 
      message: "Testimonio eliminado correctamente." 
    });
    
  } catch (error) {
    console.error("Error al eliminar testimonio:", error);
    res.status(500).json({ message: "Error al eliminar el testimonio." });
  }
});

export default router;