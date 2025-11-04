import React from 'react';
import { Box } from '@mui/material';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';

const EstrellasCalificacion = ({ calificacion, tamaño = 'medium', readonly = false, onCambiarCalificacion }) => {
  const tamañoMap = {
    small: 20,
    medium: 24,
    large: 32
  };

  const iconTamaño = tamañoMap[tamaño] || 24;

  const manejarClick = (valor) => {
    if (!readonly && onCambiarCalificacion) {
      onCambiarCalificacion(valor);
    }
  };

  const renderEstrellas = () => {
    const estrellas = [];
    const calificacionRedondeada = Math.round(calificacion * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionRedondeada) {
        // Estrella llena
        estrellas.push(
          <Star
            key={i}
            sx={{
              fontSize: iconTamaño,
              color: '#FBBF24',
              cursor: readonly ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': readonly ? {} : { transform: 'scale(1.2)' }
            }}
            onClick={() => manejarClick(i)}
          />
        );
      } else if (i - 0.5 === calificacionRedondeada) {
        // Media estrella
        estrellas.push(
          <StarHalf
            key={i}
            sx={{
              fontSize: iconTamaño,
              color: '#FBBF24',
              cursor: readonly ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': readonly ? {} : { transform: 'scale(1.2)' }
            }}
            onClick={() => manejarClick(i - 0.5)}
          />
        );
      } else {
        // Estrella vacía
        estrellas.push(
          <StarBorder
            key={i}
            sx={{
              fontSize: iconTamaño,
              color: '#FBBF24',
              cursor: readonly ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': readonly ? {} : { transform: 'scale(1.2)' }
            }}
            onClick={() => manejarClick(i)}
          />
        );
      }
    }

    return estrellas;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {renderEstrellas()}
      {calificacion > 0 && (
        <Box
          component="span"
          sx={{
            ml: 1,
            fontSize: tamaño === 'small' ? '0.875rem' : '1rem',
            color: 'text.secondary',
            fontWeight: 600
          }}
        >
          {calificacion.toFixed(1)}
        </Box>
      )}
    </Box>
  );
};

export default EstrellasCalificacion;