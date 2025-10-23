import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import { Water, Air, LocationOn, Refresh, Error as ErrorIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
// Asumo que tienes un contexto para notificaciones, si no, puedes eliminar la importación.
import { useAppContext } from '../context/AppContext'; 
import axios from 'axios';

// Aceptamos la nueva prop 'variant'
export default function WeatherWidget({ variant }) { 
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Usamos un mock si useAppContext no está disponible
  const appContext = typeof useAppContext === 'function' ? useAppContext() : { addNotification: () => {} };
  const { addNotification } = appContext;

  // Coordenadas de Isla de Margarita, Venezuela
  const MARGARITA_COORDS = { lat: 10.99, lon: -63.94 };
  const API_KEY = '799142bf2238e97fc1b2f98a4616976f'; 
  const MAX_RETRIES = 3;

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌦️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const getWeatherColor = () => {
    if (!weather) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const temp = weather.temp;
    if (temp > 30) return 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)';
    if (temp > 25) return 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)';
    if (temp > 20) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
  };
  
  const getWeatherRecommendation = () => {
    if (!weather) return '';
    
    const temp = weather.temp;
    const description = weather.description.toLowerCase();
    
    if (temp > 30) return 'Día perfecto para la piscina';
    if (temp > 25 && description.includes('sol')) return 'Excelente para playa';
    if (description.includes('lluvia')) return 'Ideal para spa bajo techo';
    if (temp < 22) return 'Perfecto para restaurante con vista';
    
    return 'Buen día para actividades al aire libre';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-VE', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Caracas'
    });
  };

  const fetchWeather = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      if (retryCount >= MAX_RETRIES) {
        throw new Error('Fallback to mock data');
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${MARGARITA_COORDS.lat}&lon=${MARGARITA_COORDS.lon}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      const weatherData = {
        temp: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        icon: response.data.weather[0].icon,
        city: response.data.name,
        feelsLike: Math.round(response.data.main.feels_like),
        pressure: response.data.main.pressure,
        visibility: response.data.visibility / 1000, 
        sunrise: new Date(response.data.sys.sunrise * 1000),
        sunset: new Date(response.data.sys.sunset * 1000)
      };

      setWeather(weatherData);
      setLastUpdated(new Date());
      setRetryCount(0);

      if (isRetry) {
        addNotification('Clima actualizado', 'Información del clima sincronizada', 'success');
      }

    } catch (err) {
      console.error('Weather API Error:', err);
      
      const mockWeather = {
        temp: 31,
        description: 'soleado y despejado',
        humidity: 65,
        windSpeed: 4.2,
        icon: '01d',
        city: 'Isla de Margarita',
        feelsLike: 32,
        pressure: 1011,
        visibility: 10,
        sunrise: new Date().setHours(6, 30, 0),
        sunset: new Date().setHours(18, 45, 0)
      };

      setWeather(mockWeather);
      setLastUpdated(new Date());
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setError(`Error cargando clima. Reintentando... (${retryCount + 1}/${MAX_RETRIES})`);
      } else {
        setError('Usando datos de demostración');
        addNotification('Clima offline', 'Mostrando información de demostración', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(() => {
      fetchWeather(true);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      fetchWeather(true);
    } else {
      setRetryCount(0);
      fetchWeather(true);
    }
  };

  // --- LÓGICA DE RENDERIZADO CONDICIONAL ---

  // 1. Vista de Carga Compacta (para el encabezado)
  if (loading && !weather && variant === 'compact') {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        px: 2,
        py: 1
      }}>
        <CircularProgress size={18} sx={{ color: 'white' }} />
        <Typography sx={{ color: 'white', fontSize: '0.75rem', opacity: 0.9, lineHeight: 1 }}>
          Cargando...
        </Typography>
      </Box>
    );
  }

  // 2. Vista Compacta (para el encabezado, cuando hay datos)
  if (weather && variant === 'compact') {
    return (
      <Tooltip 
          title={getWeatherRecommendation()} 
          arrow
          placement="bottom"
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          px: 2,
          py: 1,
          cursor: 'help' // Indicamos que es interactivo
        }}>
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.5rem' }}>
            {getWeatherIcon(weather.icon)}
          </Typography>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1 }}>
              {weather.temp}°C
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '0.75rem', opacity: 0.9, lineHeight: 1 }}>
              {weather.city}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    );
  }

  // 3. Vista de Carga Completa (tarjeta grande)
  if (loading && !weather) {
    return (
      <Card sx={{ maxWidth: 300, mx: 'auto', background: getWeatherColor(), color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={30} sx={{ color: 'white' }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Cargando clima...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 4. Vista Completa (tarjeta grande, es el código original)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Tooltip 
          title={
            <Box>
              <Typography variant="body2">
                {getWeatherRecommendation()}
              </Typography>
              {lastUpdated && (
                <Typography variant="caption">
                  Actualizado: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
              {error && (
                <Typography variant="caption" color="warning.main">
                  {error}
                </Typography>
              )}
            </Box>
          } 
          arrow
          placement="top"
        >
          <Card sx={{ 
            maxWidth: 300, 
            background: getWeatherColor(), 
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 2 }}>
              {/* Header con ubicación y botón de refresh */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {weather.city}
                  </Typography>
                </Box>
                
                <IconButton 
                  size="small" 
                  onClick={handleRetry}
                  sx={{ 
                    color: 'white',
                    p: 0.5,
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'rotate(180deg)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Refresh sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {/* Estado de error */}
              {error && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 1, 
                    py: 0,
                    '& .MuiAlert-message': { fontSize: '0.7rem', padding: '2px 0' }
                  }}
                  icon={<ErrorIcon sx={{ fontSize: 16 }} />}
                >
                  {error}
                </Alert>
              )}

              {/* Temperatura e icono */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1 }}>
                    {weather.temp}°C
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Sensación: {weather.feelsLike}°C
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontSize: '2.5rem' }}>
                  {getWeatherIcon(weather.icon)}
                </Typography>
              </Box>

              {/* Descripción */}
              <Chip 
                label={weather.description}
                size="small"
                sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  textTransform: 'capitalize',
                  fontSize: '0.7rem',
                  height: '20px',
                  mb: 1,
                  width: '100%',
                  justifyContent: 'center'
                }}
              />

              {/* Detalles del clima */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Water sx={{ fontSize: 14 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {weather.humidity}%
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8 }}>
                      Humedad
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Air sx={{ fontSize: 14 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {weather.windSpeed} m/s
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8 }}>
                      Viento
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Información adicional */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 0.5,
                borderTop: '1px solid rgba(255,255,255,0.2)',
                pt: 1
              }}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8 }}>
                    Amanecer
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                    {formatTime(weather.sunrise)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8 }}>
                    Atardecer
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                    {formatTime(weather.sunset)}
                  </Typography>
                </Box>
              </Box>

              {/* Recomendación rápida */}
              <Box sx={{ 
                mt: 1,
                pt: 1,
                borderTop: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="caption" sx={{ 
                  fontSize: '0.65rem', 
                  fontStyle: 'italic',
                  opacity: 0.9,
                  display: 'block',
                  textAlign: 'center'
                }}>
                  {getWeatherRecommendation()}
                </Typography>
              </Box>

              {/* Indicador de última actualización */}
              {lastUpdated && (
                <Typography variant="caption" sx={{ 
                  fontSize: '0.55rem', 
                  opacity: 0.6,
                  display: 'block',
                  textAlign: 'center',
                  mt: 0.5
                }}>
                  Actualizado: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
}