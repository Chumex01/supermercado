"use client";

import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from "@mui/material";

interface Detalle {
  producto_id: number;
  cantidad_solicitada: number;
  justificacion: string;
}

interface Solicitud {
  id: number;
  empleado_solicitante: { id: number; nombres?: string };
  sucursal: { id: number; nombre?: string };
  observaciones?: string;
  estado: string;
  detalles?: Detalle[];
}

interface Props {
  solicitudes: Solicitud[];
}

export default function SolicitudTable({ solicitudes }: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Solicitudes de Compra</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Empleado</TableCell>
            <TableCell>Sucursal</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Observaciones</TableCell>
            <TableCell>Detalles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.empleado_solicitante?.nombres || s.empleado_solicitante?.id}</TableCell>
              <TableCell>{s.sucursal?.nombre || s.sucursal?.id}</TableCell>
              <TableCell>{s.estado}</TableCell>
              <TableCell>{s.observaciones || "-"}</TableCell>
              <TableCell>
                {s.detalles?.map(d => (
                  <div key={d.producto_id}>
                    Producto {d.producto_id}: {d.cantidad_solicitada} ({d.justificacion})
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
