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
} from "@mui/material";

interface Solicitud {
  id: number;
  empleado_id: {
    id: number;
    nombres: string;
    apellidos: string;
  };
  producto_id: {
    id: number;
    nombre: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
  nombre_solicitud: string;
  cantidad_solicitada: number;
  justificacion: string;
  estado: string;
  fecha_solicitud: string;
}

interface Props {
  solicitudes: Solicitud[];
}

export default function SolicitudTable({ solicitudes }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Empleado</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Sucursal</TableCell>
            <TableCell>Nombre Solicitud</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Justificación</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map((solicitud) => (
            <TableRow key={solicitud.id}>
              <TableCell>{solicitud.id}</TableCell>

              {/* Empleado - COLUMNA SEPARADA */}
              <TableCell>
                <Box>
                  <div>
                    <strong>
                      {solicitud.empleado_id?.nombres} {solicitud.empleado_id?.apellidos}
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    {/* ID: {solicitud.empleado_solicitante?.id} */}
                  </div>
                </Box>
              </TableCell>

              {/* Producto - COLUMNA SEPARADA */}
              <TableCell>
                <Box>
                  <div>
                    <strong>{solicitud.producto_id?.nombre}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    {/* ID: {solicitud.producto?.id} */}
                  </div>
                </Box>
              </TableCell>

              {/* Sucursal - COLUMNA SEPARADA */}
              <TableCell>
                <Box>
                  <div>
                    <strong>{solicitud.sucursal?.nombre}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    {/* ID: {solicitud.sucursal?.id} */}
                  </div>
                </Box>
              </TableCell>

              {/* Nombre de Solicitud - COLUMNA SEPARADA */}
              <TableCell>
                {solicitud.nombre_solicitud}
              </TableCell>

              {/* Cantidad Solicitada - COLUMNA SEPARADA */}
              <TableCell>
                {solicitud.cantidad_solicitada}
              </TableCell>

              {/* Justificación - COLUMNA SEPARADA */}
              <TableCell>
                {solicitud.justificacion}
              </TableCell>

              {/* Estado - COLUMNA SEPARADA */}
              <TableCell>
                <Chip
                  label={solicitud.estado}
                  color={
                    solicitud.estado === "Aprobada"  // ← Ajusta según tus estados reales
                      ? "success"
                      : solicitud.estado === "Rechazada"
                      ? "error"
                      : "warning"  // Para "Pendiente"
                  }
                  size="small"
                />
              </TableCell>

              {/* Fecha - COLUMNA SEPARADA */}
              <TableCell>
                {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                  Aprobar
                </Button>
                <Button size="small" variant="outlined" color="error">
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}