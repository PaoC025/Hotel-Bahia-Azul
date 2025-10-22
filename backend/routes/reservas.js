import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Reserva from "../models/Reserva.js";

dotenv.config();
const router = express.Router();

// Configuracion Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Metodo POST /api/reservas
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, habitacion, fechaEntrada, fechaSalida } = req.body;

    if (!nombre || !correo || !habitacion || !fechaEntrada || !fechaSalida) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Guardar en MongoDB
    const nuevaReserva = new Reserva({
      nombre, correo, habitacion, fechaEntrada, fechaSalida
    });
    await nuevaReserva.save();

    // Enviar correo
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

    res.json({ message: "✅ Reserva registrada y correo enviado.", reserva: nuevaReserva });

  } catch (err) {
    console.error("Error creando la reserva:", err);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// Metodo GET /api/reservas -- Listamos las reservas
router.get("/", async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ fechaCreacion: -1 });
    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo las reservas:", error);
    res.status(500).json({ message: "Error al obtener las reservas." });
  }
});

export default router;


