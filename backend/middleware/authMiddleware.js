import jwt from 'jsonwebtoken';
import User from '../models/usuarios.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Middleware - Verificando token...');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Acceso denegado. Token requerido.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('🔐 Usuario ID del token:', decoded.id);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('❌ Usuario no encontrado en la base de datos');
      return res.status(401).json({ 
        message: 'Token inválido o usuario inactivo.' 
      });
    }

    if (!user.activo) {
      console.log('❌ Usuario inactivo:', user.email);
      return res.status(401).json({ 
        message: 'Token inválido o usuario inactivo.' 
      });
    }

    console.log('✅ Usuario autenticado:', {
      email: user.email,
      rol: user.rol,
      id: user._id
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    return res.status(403).json({ 
      message: 'Token inválido o expirado.' 
    });
  }
};
export const requireAdmin = (req, res, next) => {
  console.log('👮 Verificando admin - Rol actual:', req.user?.rol);
  
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado.' 
    });
  }

  if (req.user.rol !== 'admin') {
    console.log('❌ Acceso denegado - Rol incorrecto. Rol actual:', req.user.rol);
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren privilegios de administrador.' 
    });
  }
  
  console.log('✅ Acceso concedido - Es admin');
  next();
};

export const adminAuth = [authenticateToken, requireAdmin];