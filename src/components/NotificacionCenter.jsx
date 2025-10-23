// components/NotificationCenter.jsx
import { 
  Box, 
  IconButton, 
  Badge, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography,
  Button
} from '@mui/material';
import { 
  Notifications, 
  CheckCircle, 
  Error, 
  Info,
  Warning 
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadNotifications, markNotificationAsRead } = useAppContext();

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
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
            {unreadNotifications > 0 && ` (${unreadNotifications})`}
          </Typography>

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No hay notificaciones" />
              </ListItem>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <ListItem 
                  key={notification.id}
                  sx={{ 
                    opacity: notification.leida ? 0.6 : 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.tipo)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.titulo}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {notification.mensaje}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.fecha).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.leida && (
                    <Button 
                      size="small" 
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      Marcar
                    </Button>
                  )}
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
}