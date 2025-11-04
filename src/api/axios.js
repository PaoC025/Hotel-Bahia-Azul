import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTOR PARA AGREGAR TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 [AXIOS] Token agregado a:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR PARA MANEJAR ERRORES DE AUTENTICACIÓN
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔐 [AXIOS] Error 401 - Limpiando token');
      localStorage.removeItem('token');
      // No redirigir automáticamente, dejar que el componente maneje
    }
    return Promise.reject(error);
  }
);

export default api;