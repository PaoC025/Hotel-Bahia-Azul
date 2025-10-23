import { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../api/Axios';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [user, setUser] = useState(null);
  const [promociones, setPromociones] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);

  // 🔽 ELIMINADO: Los useRef para notificaciones automáticas

  // 🔽 SIMPLIFICADO: Efecto para detectar estado de conexión (sin notificaciones)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sincronizar silenciosamente cuando recupera conexión
      setTimeout(() => refreshData(false), 2000); // false = sin notificación
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 🔽 SIMPLIFICADO: Cargar datos iniciales SIN notificaciones
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPromociones(),
          fetchHabitaciones()
        ]);
        setLastSync(new Date());
        // 🔽 ELIMINADO: Notificación de "Sistema listo"
      } catch (error) {
        console.error('Error loading initial data:', error);
        // 🔽 ELIMINADO: Notificación de error inicial
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 🔽 SIMPLIFICADO: WebSockets SIN notificaciones automáticas
  useEffect(() => {
    if (!isOnline) return;

    const mockWebSocketUpdates = () => {
      // Simular nueva promoción (sin notificación)
      const promoInterval = setInterval(() => {
        if (Math.random() > 0.7 && isOnline) {
          const newPromo = {
            id: Date.now(),
            titulo: `Oferta Relámpago ${new Date().getHours()}:${new Date().getMinutes()}`,
            descuento: `${Math.floor(Math.random() * 15) + 10}%`,
            activa: true,
            expira: new Date(Date.now() + 2 * 60 * 60 * 1000)
          };
          
          setPromociones(prev => [newPromo, ...prev.slice(0, 4)]);
          // 🔽 ELIMINADO: Notificación de nueva promoción
        }
      }, Math.random() * 180000 + 120000);

      // Simular cambio de disponibilidad (sin notificación)
      const roomInterval = setInterval(() => {
        if (Math.random() > 0.8 && isOnline && habitaciones.length > 0) {
          const randomRoomIndex = Math.floor(Math.random() * habitaciones.length);
          const updatedRooms = [...habitaciones];
          updatedRooms[randomRoomIndex] = {
            ...updatedRooms[randomRoomIndex],
            disponible: Math.random() > 0.3,
            ultimaActualizacion: new Date()
          };
          
          setHabitaciones(updatedRooms);
          // 🔽 ELIMINADO: Notificación de disponibilidad actualizada
        }
      }, 30000);

      return () => {
        clearInterval(promoInterval);
        clearInterval(roomInterval);
      };
    };

    const cleanup = mockWebSocketUpdates();
    return cleanup;
  }, [isOnline, habitaciones.length]);

  // 🔽 MEJORADO: Cargar promociones SIN notificaciones automáticas
  const fetchPromociones = async (retryCount = 0) => {
    try {
      const response = await api.get('/promociones');
      setPromociones(response.data);
      return response.data;
    } catch (error) {
      console.error('Error cargando promociones:', error);
      
      const mockPromociones = [
        { 
          id: 1, 
          titulo: 'Verano 2024', 
          descuento: '15%', 
          activa: true,
          descripcion: 'Disfruta del verano con descuento especial',
          imagen: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        { 
          id: 2, 
          titulo: 'Luna de Miel', 
          descuento: '20%', 
          activa: true,
          descripcion: 'Paquetes especiales para lunamieleros',
          imagen: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ];
      
      setPromociones(mockPromociones.filter(p => p.activa));
      
      if (retryCount < 2) {
        setTimeout(() => fetchPromociones(retryCount + 1), 5000);
      }
      
      return mockPromociones;
    }
  };

  // 🔽 MEJORADO: Añadir reserva con notificaciones SOLO para reservas
  const addReserva = (reserva) => {
    // Validar datos de la reserva
    if (!reserva.nombre || !reserva.email || !reserva.telefono) {
      addNotification('Error en reserva', 'Faltan datos requeridos', 'error');
      return false;
    }

    const nuevaReserva = {
      ...reserva,
      id: Date.now(),
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
      codigo: `RES-${Date.now().toString().slice(-6)}`,
      notificada: false
    };

    setReservas(prev => [nuevaReserva, ...prev]);
    
    // 🔽 NOTIFICACIÓN SOLO PARA RESERVA EXITOSA
    addNotification(
      '¡Reserva enviada!', 
      `Código: ${nuevaReserva.codigo}. Nos contactaremos pronto.`, 
      'success'
    );

    // Simular envío al backend
    setTimeout(async () => {
      try {
        await api.post("/reservas", nuevaReserva);
        setReservas(prev => 
          prev.map(r => 
            r.id === nuevaReserva.id 
              ? { ...r, sincronizada: true } 
              : r
          )
        );
      } catch (error) {
        console.error('Error syncing reservation:', error);
        // 🔽 NOTIFICACIÓN SOLO PARA ERROR DE RESERVA
        addNotification('Error de sincronización', 'La reserva se guardó localmente', 'warning');
      }
    }, 1000);

    return true;
  };

  const removeReserva = (id) => {
    setReservas(prev => prev.filter(reserva => reserva.id !== id));
    // 🔽 NOTIFICACIÓN SOLO PARA ELIMINACIÓN DE RESERVA
    addNotification('Reserva eliminada', 'La reserva ha sido eliminada correctamente', 'info');
  };

  // 🔽 MEJORADO: Sistema de notificaciones (sin cambios)
  const addNotification = (titulo, mensaje, tipo = 'info', persistente = false) => {
    const nuevaNotificacion = {
      id: Date.now(),
      titulo,
      mensaje,
      tipo,
      fecha: new Date().toISOString(),
      leida: false,
      persistente,
      expira: persistente ? null : Date.now() + 10000
    };

    setNotifications(prev => {
      const nuevasNotificaciones = [nuevaNotificacion, ...prev];
      return nuevasNotificaciones.slice(0, 50);
    });

    if (!persistente) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== nuevaNotificacion.id));
      }, 10000);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearOldNotifications = () => {
    const unaHora = 60 * 60 * 1000;
    const ahora = Date.now();
    
    setNotifications(prev => 
      prev.filter(notif => {
        const fechaNotif = new Date(notif.fecha).getTime();
        return ahora - fechaNotif < unaHora;
      })
    );
  };

  const login = (userData) => {
    setUser(userData);
    // 🔽 NOTIFICACIÓN SOLO PARA LOGIN
    addNotification(
      `Bienvenido, ${userData.nombre}`, 
      'Has iniciado sesión correctamente', 
      'success',
      true
    );
  };

  const logout = () => {
    // 🔽 NOTIFICACIÓN SOLO PARA LOGOUT
    addNotification('Sesión cerrada', 'Has cerrado sesión exitosamente', 'info');
    setUser(null);
  };

  // 🔽 MEJORADO: Función refreshData con notificación opcional
  const refreshData = async (showNotification = true) => {
    if (!isOnline) {
      if (showNotification) {
        addNotification('Sin conexión', 'No se pueden actualizar los datos', 'warning');
      }
      return;
    }

    setLoading(true);
    
    if (showNotification) {
      addNotification('Sincronizando', 'Actualizando información...', 'info');
    }

    try {
      await Promise.all([
        fetchPromociones(),
        fetchHabitaciones()
      ]);
      
      setLastSync(new Date());
      
      if (showNotification) {
        addNotification('Datos actualizados', 'Información sincronizada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (showNotification) {
        addNotification('Error de sincronización', 'No se pudieron actualizar todos los datos', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔽 SIMPLIFICADO: Sincronizar reservas pendientes (sin notificación automática)
  const syncPendingReservations = async () => {
    const pendingReservations = reservas.filter(r => !r.sincronizada);
    
    if (pendingReservations.length === 0 || !isOnline) return;

    try {
      for (const reservation of pendingReservations) {
        await api.post("/reservas", reservation);
        setReservas(prev => 
          prev.map(r => 
            r.id === reservation.id ? { ...r, sincronizada: true } : r
          )
        );
      }
    } catch (error) {
      console.error('Error syncing reservations:', error);
    }
  };

  // Efecto para sincronización automática (silenciosa)
  useEffect(() => {
    if (isOnline) {
      syncPendingReservations();
    }
  }, [isOnline]);

  // Limpiar notificaciones antiguas
  useEffect(() => {
    const interval = setInterval(clearOldNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      // Estado
      reservas,
      user,
      promociones,
      habitaciones,
      notifications,
      loading,
      isOnline,
      lastSync,
      
      // Acciones
      addReserva,
      removeReserva,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      removeNotification,
      login,
      logout,
      refreshData,
      syncPendingReservations,
      
      // Utilidades
      reservasCount: reservas.length,
      unreadNotifications: notifications.filter(n => !n.leida).length,
      pendingSyncReservations: reservas.filter(r => !r.sincronizada).length,
      activePromotions: promociones.filter(p => p.activa).length,
      
      isUserLoggedIn: !!user,
      hasUnreadNotifications: notifications.some(n => !n.leida),
      getPromotionById: (id) => promociones.find(p => p.id === id),
      getReservationByCode: (code) => reservas.find(r => r.codigo === code)
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
};