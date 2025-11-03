import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Reserva from "../models/Reserva.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js"; // 🔽 IMPORTAR

dotenv.config();
const router = express.Router();

// Configuración Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔽 POST MIXTO - Usuarios autenticados y no autenticados pueden reservar
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, habitacion, fechaEntrada, fechaSalida } = req.body;

    if (!nombre || !correo || !habitacion || !fechaEntrada || !fechaSalida) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // 🔽 Si el usuario está autenticado, registrar su ID
    const user = req.user ? req.user._id : null;

    // Guardar en MongoDB
    const nuevaReserva = new Reserva({
      nombre, 
      correo, 
      habitacion, 
      fechaEntrada, 
      fechaSalida,
      usuario: user // 🔽 Referencia al usuario si está autenticado
    });
    
    await nuevaReserva.save();

    // Enviar correo
    try {
      await transporter.sendMail({
        from: `"Hotel Bahía Azul 🏖️" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Confirmación de reserva - Hotel Bahía Azul",
        html: `
          <h2>¡Hola ${nombre}!</h2>
          <p>Gracias por reservar con nosotros en <b>Hotel Bahía Azul</b>.</p>
          <p>Detalles de tu reserva:</p>
          <ul>
            <li>Habitación: ${habitacion}</li>
            <li>Entrada: ${fechaEntrada}</li>
            <li>Salida: ${fechaSalida}</li>
          </ul>
          <p>Nos pondremos en contacto contigo para coordinar el pago y más detalles.</p>
          <p>🌴 ¡Te esperamos pronto!</p>
        `
      });
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);
      // No fallar la reserva solo por error de email
    }

    console.log(`📅 Reserva creada para: ${correo} ${user ? `(Usuario: ${req.user.email})` : ''}`);
    
    res.json({ 
      message: "✅ Reserva registrada y correo enviado.", 
      reserva: nuevaReserva 
    });

  } catch (err) {
    console.error("Error creando la reserva:", err);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// 🔽 GET PROTEGIDO - Solo admin puede ver todas las reservas
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ fechaCreacion: -1 });
    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo las reservas:", error);
    res.status(500).json({ message: "Error al obtener las reservas." });
  }
});

// 🔽 GET PROTEGIDO - Usuarios pueden ver sus propias reservas
router.get("/mis-reservas", authenticateToken, async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.user._id }).sort({ fechaCreacion: -1 });
    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo las reservas del usuario:", error);
    res.status(500).json({ message: "Error al obtener las reservas." });
  }
});

// 🔽 PUT PROTEGIDO - Solo admin puede actualizar reservas
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, habitacion, fechaEntrada, fechaSalida } = req.body;

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { estado, habitacion, fechaEntrada, fechaSalida },
      { new: true, runValidators: true }
    );

    if (!reservaActualizada) {
      return res.status(404).json({ message: "Reserva no encontrada." });
    }

    console.log(`✏️ Reserva actualizada por admin: ${req.user.email}`);
    
    res.json({ 
      message: "✅ Reserva actualizada correctamente.", 
      reserva: reservaActualizada 
    });
    
  } catch (error) {
    console.error("Error actualizando reserva:", error);
    res.status(500).json({ message: "Error al actualizar la reserva." });
  }
});

// 🔽 DELETE PROTEGIDO - Solo admin puede eliminar reservas
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const reservaEliminada = await Reserva.findByIdAndDelete(id);
    
    if (!reservaEliminada) {
      return res.status(404).json({ message: "Reserva no encontrada." });
    }

    console.log(`🗑️ Reserva eliminada por admin: ${req.user.email}`);
    
    res.json({ 
      message: "✅ Reserva eliminada correctamente." 
    });
    
  } catch (error) {
    console.error("Error eliminando reserva:", error);
    res.status(500).json({ message: "Error al eliminar la reserva." });
  }
});

export default router;