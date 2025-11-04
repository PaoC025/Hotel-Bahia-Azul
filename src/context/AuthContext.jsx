import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/Axios'; // 🔽 USAR LA MISMA INSTANCIA

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 🔽 ELIMINAR: No configurar axios aquí

  // Verificar token al cargar la app
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          console.log('🔐 Verificando token...');
          // 🔽 CORREGIR: Usar api en lugar de axios
          const response = await api.get('/auth/me');
          console.log('✅ Token válido:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('❌ Token inválido:', error.response?.data || error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login...');
      
      // 🔽 CORREGIR: Usar api en lugar de axios
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login exitoso:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken); // 🔽 GUARDAR EXPLÍCITAMENTE
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error en el login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('👤 Intentando registro...');
      
      // 🔽 CORREGIR: Usar api en lugar de axios
      const response = await api.post('/auth/register', userData);
      
      console.log('✅ Registro exitoso:', response.data);
      
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    console.log('✅ Sesión cerrada');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};