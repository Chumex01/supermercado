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
  Chip 
} from "@mui/material";

interface Lote {
  id: number;
  orden_compra: {
    id: number;
  };
  producto: {
    id: number;
  };
  numero_lote: string;
  fecha_vencimiento: string;
  cantidad_recibida: number;
  costo_unitario: number;
  fecha_recepcion: string;
  estado: string;
  fecha_creacion: string;
}

interface Props {
  lotes: Lote[];
}

export default function LoteTable({ lotes }: Props) {
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'error';
      case 'vencido':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Orden Compra ID</TableCell>
            <TableCell>Producto ID</TableCell>
            <TableCell>Número Lote</TableCell>
            <TableCell>Fecha Vencimiento</TableCell>
            <TableCell>Cantidad Recibida</TableCell>
            <TableCell>Costo Unitario</TableCell>
            <TableCell>Fecha Recepción</TableCell>
            <TableCell>Estado</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {lotes.map((lote) => (
            <TableRow key={lote.id}>
              <TableCell>{lote.id}</TableCell>
              <TableCell>{lote.orden_compra.id}</TableCell>
              <TableCell>{lote.producto.id}</TableCell>
              <TableCell>{lote.numero_lote}</TableCell>
              <TableCell>{new Date(lote.fecha_vencimiento).toLocaleDateString()}</TableCell>
              <TableCell>{lote.cantidad_recibida}</TableCell>
              <TableCell>${lote.costo_unitario}</TableCell>
              <TableCell>{new Date(lote.fecha_recepcion).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip 
                  label={lote.estado}
                  size="small"
                />
              </TableCell>
              {/* <TableCell>
                <Button size="small" sx={{ mr: 1 }}>
                  Editar
                </Button>
                <Button size="small" >
                  Eliminar
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}