import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/usuarios.js"; 
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// 📝 REGISTRO de usuario - CORREGIDO
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    console.log('📝 Intentando registrar usuario:', { nombre, email });

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: "Nombre, email y password son obligatorios." 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 6 caracteres." 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email ya registrado:', email);
      return res.status(400).json({ 
        message: "El email ya está registrado." 
      });
    }

    // Determinar rol (primer usuario = admin)
    const userCount = await User.countDocuments();
    const rol = userCount === 0 ? 'admin' : 'cliente';

    console.log(`👥 Total usuarios en DB: ${userCount}, Rol asignado: ${rol}`);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      email,
      password,
      telefono,
      rol: rol
    });

    await newUser.save();
    console.log('✅ Usuario guardado en DB con ID:', newUser._id);

    // Generar token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "✅ Usuario registrado exitosamente.",
      token,
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
        telefono: newUser.telefono
      }
    });

  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 🔐 LOGIN de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intentando login para:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email y password son obligatorios." 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email, activo: true });
    if (!user) {
      console.log('❌ Usuario no encontrado o inactivo:', email);
      return res.status(401).json({ 
        message: "Credenciales inválidas." 
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Password incorrecto para:', email);
      return res.status(401).json({ 
        message: "Credenciales inválidas." 
      });
    }

    // Generar token
    const token = generateToken(user._id);

    console.log('✅ Login exitoso para:', email, 'Rol:', user.rol);

    res.json({
      message: "✅ Login exitoso.",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 👤 Obtener perfil del usuario actual
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 🔄 Actualizar perfil de usuario
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const updates = {};

    if (nombre) updates.nombre = nombre;
    if (telefono) updates.telefono = telefono;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: "✅ Perfil actualizado exitosamente.",
      user
    });

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 🔄 Cambiar contraseña
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "La contraseña actual y la nueva contraseña son obligatorias." 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "La nueva contraseña debe tener al menos 6 caracteres." 
      });
    }

    // Verificar contraseña actual
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: "La contraseña actual es incorrecta." 
      });
    }

    // Actualizar contraseña (se hashea automáticamente en el modelo)
    user.password = newPassword;
    await user.save();

    res.json({
      message: "✅ Contraseña actualizada exitosamente."
    });

  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 👥 ADMIN: Obtener todos los usuarios
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      message: "✅ Usuarios obtenidos correctamente.",
      users,
      total: users.length
    });

  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 👥 ADMIN: Actualizar rol de usuario
router.put("/users/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || !['admin', 'cliente'].includes(rol)) {
      return res.status(400).json({ 
        message: "Rol inválido. Debe ser 'admin' o 'cliente'." 
      });
    }

    // No permitir que un admin se quite sus propios privilegios
    if (id === req.user._id.toString() && rol !== 'admin') {
      return res.status(400).json({ 
        message: "No puedes quitarte tus propios privilegios de administrador." 
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { rol },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado." 
      });
    }

    res.json({
      message: `✅ Rol actualizado a '${rol}' para ${user.nombre}.`,
      user
    });

  } catch (error) {
    console.error("Error actualizando rol:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

// 👥 ADMIN: Activar/desactivar usuario
router.put("/users/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    // No permitir que un admin se desactive a sí mismo
    if (id === req.user._id.toString() && activo === false) {
      return res.status(400).json({ 
        message: "No puedes desactivar tu propia cuenta." 
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { activo },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado." 
      });
    }

    const estado = activo ? 'activada' : 'desactivada';
    res.json({
      message: `✅ Cuenta ${estado} para ${user.nombre}.`,
      user
    });

  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ 
      message: "Error interno del servidor." 
    });
  }
});

export default router;