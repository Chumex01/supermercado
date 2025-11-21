"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
} from "@mui/material";

interface Venta {
  id: number;
  sucursal: {
    nombre: string;
  };
  empleado_cajero: {
    nombres: string;
    apellidos: string;
  };
  stock: {
    lote: {
      producto: {
        nombre: string;
        categoria: {
          nombre: string;
        };
        proveedor: {
          nombre: string;
        };
        precio_venta: number;
        unidad_medida: string;
      };
      numero_lote: string; // ← Cambié a string según tu entidad
    };
    cantidad_disponible: number; // Agregué esto para info del stock
  };
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  total: number; // ← Cambié a number (minúscula)
  fecha_venta: string;
  estado: string; // Agregué el estado
  metodo_pago: string; // ← Cambié a string (minúscula)
}

interface Props {
  ventas: Venta[];
  onVentaUpdate?: () => void; // Para actualizar después de cancelar
}

export default function VentaTable({ ventas, onVentaUpdate }: Props) {
  // Función para obtener color del chip según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completada":
        return "success";
      case "cancelada":
        return "error";
      case "pendiente":
        return "warning";
      default:
        return "default";
    }
  };

  // Función para obtener color del método de pago
  const getMetodoPagoColor = (metodo: string) => {
    switch (metodo) {
      case "efectivo":
        return "success";
      case "tarjeta":
        return "primary";
      case "transferencia":
        return "secondary";
      case "mixto":
        return "warning";
      default:
        return "default";
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear moneda
  const formatMoneda = (monto: number) => {
    return `$${monto.toFixed(2)}`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell >ID</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Sucursal</TableCell>
            <TableCell>Empleado</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio Unitario</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Fecha Venta</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Método Pago</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell>{venta.id}</TableCell>

              {/* Información del Producto */}
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {venta.stock.lote.producto.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lote: {venta.stock.lote.numero_lote}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Categoría: {venta.stock.lote.producto.categoria.nombre}
                  </Typography>
                </Box>
              </TableCell>

              {/* Sucursal */}
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {venta.sucursal.nombre}
                  </Typography>
                </Box>
              </TableCell>

              {/* Empleado */}
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    {venta.empleado_cajero.nombres} {venta.empleado_cajero.apellidos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cajero
                  </Typography>
                </Box>
              </TableCell>

              {/* Cantidad */}
              <TableCell>
                <Box textAlign="center">
                  <Typography variant="body1" fontWeight="bold">
                    {venta.cantidad}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {venta.stock.lote.producto.unidad_medida}
                  </Typography>
                </Box>
              </TableCell>

              {/* Precio Unitario */}
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {venta.precio_unitario}
                </Typography>
              </TableCell>

              {/* Total */}
              <TableCell>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {venta.total}
                </Typography>
              </TableCell>

              {/* Fecha de Venta */}
              <TableCell>
                <Typography variant="body2">
                  {formatFecha(venta.fecha_venta)}
                </Typography>
              </TableCell>

              {/* Estado */}
              <TableCell>
                <Chip
                  label={venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                  color={getEstadoColor(venta.estado)}
                  size="small"
                />
              </TableCell>

              {/* Método de Pago */}
              <TableCell>
                <Chip
                  label={venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1)}
                  color={getMetodoPagoColor(venta.metodo_pago)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}