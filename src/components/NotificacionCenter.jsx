// components/NotificationCenter.jsx - VERSIÓN COMPLETA
import { 
  Box, IconButton, Badge, Popover, List, ListItem, 
  ListItemText, ListItemIcon, Typography, Button,
  Chip, Divider, MenuItem, Menu
} from '@mui/material';
import { 
  Notifications, CheckCircle, Error, Info, Warning,
  ClearAll, MarkEmailRead, Settings
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const { notifications, unreadNotifications, markNotificationAsRead, markAllNotificationsAsRead, removeNotification } = useAppContext();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      default: return 'info.main';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.leida;
    return notif.tipo === filter;
  });

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleClearAll = () => {
    notifications.forEach(notif => removeNotification(notif.id));
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadNotifications} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ width: 400, maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Notificaciones
                {unreadNotifications > 0 && (
                  <Chip 
                    label={unreadNotifications} 
                    size="small" 
                    color="error" 
                    sx={{ ml: 1, height: 20 }} 
                  />
                )}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={handleMarkAllAsRead}
                  disabled={unreadNotifications === 0}
                  title="Marcar todas como leídas"
                >
                  <MarkEmailRead />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  title="Limpiar todas"
                >
                  <ClearAll />
                </IconButton>
              </Box>
            </Box>

            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['all', 'unread', 'success', 'error', 'warning', 'info'].map((filtro) => (
                <Chip
                  key={filtro}
                  label={
                    filtro === 'all' ? 'Todas' :
                    filtro === 'unread' ? 'No leídas' :
                    filtro === 'success' ? 'Éxito' :
                    filtro === 'error' ? 'Error' :
                    filtro === 'warning' ? 'Advertencia' : 'Info'
                  }
                  size="small"
                  variant={filter === filtro ? "filled" : "outlined"}
                  onClick={() => setFilter(filtro)}
                  color={
                    filtro === 'success' ? 'success' :
                    filtro === 'error' ? 'error' :
                    filtro === 'warning' ? 'warning' :
                    filtro === 'info' ? 'info' : 'primary'
                  }
                />
              ))}
            </Box>
          </Box>

          {/* Lista de Notificaciones */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay notificaciones
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredNotifications.slice(0, 10).map((notification, index) => (
                  <ListItem 
                    key={notification.id}
                    sx={{ 
                      opacity: notification.leida ? 0.7 : 1,
                      borderBottom: index < filteredNotifications.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      backgroundColor: notification.leida ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.tipo)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={notification.leida ? "normal" : "bold"}
                          >
                            {notification.titulo}
                          </Typography>
                          {!notification.leida && (
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: getNotificationColor(notification.tipo) 
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {notification.mensaje}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.fecha).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {!notification.leida && (
                        <IconButton 
                          size="small" 
                          onClick={() => markNotificationAsRead(notification.id)}
                          title="Marcar como leída"
                        >
                          <MarkEmailRead fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small" 
                        onClick={() => removeNotification(notification.id)}
                        title="Eliminar notificación"
                      >
                        <ClearAll fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <Button 
                size="small" 
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Limpiar todas las notificaciones
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}