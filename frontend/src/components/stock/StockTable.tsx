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

interface Stock {
  id: number;
  sucursal: {
    id: number;
    nombre: string;
  };
  lote: {
    id: number;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_recibida: number;
    costo_unitario: number;
    estado: string;
  };
  cantidad_disponible: number;
  cantidad_minima: number;
  ubicacion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface Props {
  stocks: Stock[]; // ← Cambiado de 'lotes' a 'stocks'
}

export default function StockTable({ stocks }: Props) {
  const getStockStatusText = (
    cantidadDisponible: number,
    cantidadMinima: number
  ) => {
    // Convertir a números por si acaso vienen como strings
    const disponible = Number(cantidadDisponible);
    const minima = Number(cantidadMinima);

    if (disponible === 0) {
      return "Sin Stock";
    } else if (disponible <= minima) {
      return "Stock Bajo";
    } else {
      return "Disponible";
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Sucursal</TableCell>
            <TableCell>Número de Lote</TableCell>
            <TableCell>Fecha Vencimiento</TableCell>
            <TableCell>Cantidad Disponible</TableCell>
            <TableCell>Cantidad Mínima</TableCell>
            <TableCell>Estado Stock</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Costo Unitario</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell>{stock.id}</TableCell>

              {/* Sucursal */}
              <TableCell>
                <Box>
                  <div>
                    <strong>{stock.sucursal.nombre}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    ID: {stock.sucursal.id}
                  </div>
                </Box>
              </TableCell>

              {/* Lote */}
              <TableCell>
                <Box>
                  <div>
                    <strong>{stock.lote.numero_lote}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Lote ID: {stock.lote.id}
                  </div>
                </Box>
              </TableCell>

              {/* Fecha Vencimiento */}
              <TableCell>
                {new Date(stock.lote.fecha_vencimiento).toLocaleDateString()}
              </TableCell>

              {/* Cantidades */}
              <TableCell>
                <Box
                  sx={{
                    fontWeight:
                      stock.cantidad_disponible <= stock.cantidad_minima
                        ? "bold"
                        : "normal",
                    color:
                      stock.cantidad_disponible <= stock.cantidad_minima
                        ? "#f57c00"
                        : "inherit",
                  }}
                >
                  {stock.cantidad_disponible}
                </Box>
              </TableCell>

              <TableCell>{stock.cantidad_minima}</TableCell>

              {/* Estado del Stock */}
              <TableCell>
                <Chip
                  label={getStockStatusText(
                    stock.cantidad_disponible,
                    stock.cantidad_minima
                  )}
                  size="small"
                />
              </TableCell>

              {/* Ubicación */}
              <TableCell>{stock.ubicacion || "No especificada"}</TableCell>

              {/* Costo Unitario */}
              <TableCell>
                ${parseFloat(stock.lote.costo_unitario.toString()).toFixed(2)}
              </TableCell>

              {/* Acciones
              <TableCell>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                  Editar
                </Button>
                <Button size="small" variant="outlined" color="error">
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
