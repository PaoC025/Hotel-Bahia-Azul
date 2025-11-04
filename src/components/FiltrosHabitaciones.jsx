import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  Clear,
  Search
} from '@mui/icons-material';

const FiltrosHabitaciones = ({ habitaciones, onFiltrar, loading }) => {
  const [filtros, setFiltros] = useState({
    precioMin: 0,
    precioMax: 1000,
    categorias: [],
    comodidades: [],
    personas: 1,
    disponible: true
  });

  // Extraer opciones únicas de las habitaciones
  const categoriasUnicas = [...new Set(habitaciones.map(h => h.categoria).filter(Boolean))];
  const todasComodidades = habitaciones.flatMap(h => h.comodidades || []);
  const comodidadesUnicas = [...new Set(todasComodidades)].sort();

  // Precios máximos y mínimos reales
  const precios = habitaciones.map(h => h.precio);
  const precioMinReal = Math.min(...precios);
  const precioMaxReal = Math.max(...precios);

  const handlePrecioChange = (event, newValue) => {
    setFiltros(prev => ({
      ...prev,
      precioMin: newValue[0],
      precioMax: newValue[1]
    }));
  };

  const handleCategoriaChange = (categoria) => {
    setFiltros(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria]
    }));
  };

  const handleComodidadChange = (comodidad) => {
    setFiltros(prev => ({
      ...prev,
      comodidades: prev.comodidades.includes(comodidad)
        ? prev.comodidades.filter(c => c !== comodidad)
        : [...prev.comodidades, comodidad]
    }));
  };

  const handlePersonasChange = (event) => {
    setFiltros(prev => ({
      ...prev,
      personas: event.target.value
    }));
  };

  const handleDisponibleChange = (event) => {
    setFiltros(prev => ({
      ...prev,
      disponible: event.target.checked
    }));
  };

  const aplicarFiltros = () => {
    onFiltrar(filtros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpiados = {
      precioMin: precioMinReal,
      precioMax: precioMaxReal,
      categorias: [],
      comodidades: [],
      personas: 1,
      disponible: true
    };
    setFiltros(filtrosLimpiados);
    onFiltrar(filtrosLimpiados);
  };

  // Contador de filtros activos
  const filtrosActivos = [
    filtros.precioMin > precioMinReal,
    filtros.precioMax < precioMaxReal,
    filtros.categorias.length > 0,
    filtros.comodidades.length > 0,
    filtros.personas > 1,
    !filtros.disponible
  ].filter(Boolean).length;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          Filtros
          {filtrosActivos > 0 && (
            <Chip 
              label={filtrosActivos} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        
        <Button 
          startIcon={<Clear />} 
          onClick={limpiarFiltros}
          disabled={filtrosActivos === 0}
          size="small"
        >
          Limpiar
        </Button>
      </Box>

      {/* Rango de Precio */}
      <Accordion defaultExpanded sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight="600">
            Precio por Noche
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={[filtros.precioMin, filtros.precioMax]}
              onChange={handlePrecioChange}
              valueLabelDisplay="auto"
              min={precioMinReal}
              max={precioMaxReal}
              step={10}
              valueLabelFormat={(value) => `$${value}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ${filtros.precioMin}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${filtros.precioMax}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Número de Personas */}
      <Accordion defaultExpanded sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight="600">
            Huéspedes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            select
            fullWidth
            size="small"
            value={filtros.personas}
            onChange={handlePersonasChange}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <MenuItem key={num} value={num}>
                {num} {num === 1 ? 'persona' : 'personas'}
              </MenuItem>
            ))}
          </TextField>
        </AccordionDetails>
      </Accordion>

      {/* Categorías */}
      {categoriasUnicas.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="600">
              Categorías
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {categoriasUnicas.map(categoria => (
                <FormControlLabel
                  key={categoria}
                  control={
                    <Checkbox
                      checked={filtros.categorias.includes(categoria)}
                      onChange={() => handleCategoriaChange(categoria)}
                      size="small"
                    />
                  }
                  label={categoria}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Comodidades */}
      {comodidadesUnicas.length > 0 && (
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="600">
              Comodidades
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup sx={{ maxHeight: 200, overflow: 'auto' }}>
              {comodidadesUnicas.map(comodidad => (
                <FormControlLabel
                  key={comodidad}
                  control={
                    <Checkbox
                      checked={filtros.comodidades.includes(comodidad)}
                      onChange={() => handleComodidadChange(comodidad)}
                      size="small"
                    />
                  }
                  label={comodidad}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Disponibilidad */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight="600">
            Disponibilidad
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={filtros.disponible}
                onChange={handleDisponibleChange}
                size="small"
              />
            }
            label="Mostrar solo habitaciones disponibles"
          />
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Botón Aplicar Filtros */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<Search />}
        onClick={aplicarFiltros}
        disabled={loading}
        sx={{
          py: 1,
          background: 'linear-gradient(45deg, #1E40AF 30%, #3B82F6 90%)',
          fontWeight: 600
        }}
      >
        {loading ? 'Aplicando...' : 'Aplicar Filtros'}
      </Button>
    </Paper>
  );
};

export default FiltrosHabitaciones;