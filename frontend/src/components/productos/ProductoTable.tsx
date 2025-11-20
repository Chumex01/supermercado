import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box
} from '@mui/material';

interface Producto {
  id: number;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  categoria: {
    id: number;
    nombre: string;
  };
  proveedor: {
    id: number;
    nombre: string;
  };
  precio_venta: number;
  unidad_medida: string;
  estado: string;
}

interface Props {
  productos: Producto[];
}

// Función para asignar colores según la categoría
const getCategoryColor = (categoriaNombre: string): string => {
  const colorMap: { [key: string]: string } = {
    'Electrónicos': '#2196f3',
    'Ropa': '#ff9800',
    'Alimentos': '#4caf50',
    'Limpieza': '#9c27b0',
    'Deportes': '#f44336',
    'Bebidas Alcoholicas': '#ffeb3b',
    'Libros': '#795548',
    'Salud': '#00bcd4',
    'Automotriz': '#607d8b',
    'Jardín': '#8bc34a'
  };
  
  return colorMap[categoriaNombre] || '#757575'; // Color por defecto
};

export default function ProductoTable({ productos }: Props) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {productos.map((producto) => {
        const borderColor = getCategoryColor(producto.categoria.nombre);
        
        return (
          <Card 
            key={producto.id}
            sx={{ 
              minWidth: 275,
              borderLeft: `4px solid ${borderColor}`,
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              {/* Línea de color de categoría */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1 
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: borderColor,
                    mr: 1
                  }}
                />
                <Typography 
                  gutterBottom 
                  sx={{ 
                    color: 'text.secondary', 
                    fontSize: 14,
                    mb: 0
                  }}
                >
                  {producto.categoria.nombre}
                </Typography>
              </Box>

              {/* Nombre del producto */}
              <Typography variant="h5" component="div">
                {producto.nombre}
              </Typography>

              {/* Código de barras */}
              <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                Código: {producto.codigo_barras}
              </Typography>

              {/* Descripción */}
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                {producto.descripcion}
              </Typography>

              {/* Información adicional */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Proveedor:</strong> {producto.proveedor.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Precio:</strong> ${producto.precio_venta}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Unidad:</strong> {producto.unidad_medida}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: producto.estado === 'Activo' ? 'error.main' : 'success.main',
                    fontWeight: 'bold'
                  }}
                >
                  <strong>Estado:</strong> {producto.estado}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              {/* <Button size="small">Ver Detalles</Button> */}
              {/* <Button size="small">Eliminar</Button>
              <Button size="small">Editar</Button> */}
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
}