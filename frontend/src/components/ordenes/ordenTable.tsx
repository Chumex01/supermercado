"use client";

import { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { api } from "@/lib/api"; // Asegúrate de tener tu instancia de API

interface Orden {
  id: number;
  solicitud_id: {
    id: number;
    nombre_solicitud: string;
  };
  proveedor_id: {
    id: number;
    nombre: string;
  };
  nombre_orden: string;
  estado: string;
  precio_unitario: number;
  cantidad_ordenada: number;
  total: number;
  fecha_orden: string;
}

interface Props {
  ordenes: Orden[];
  onOrdenUpdate: () => void; // Función para actualizar la lista después de cambios
}

export default function OrdenTable({ ordenes, onOrdenUpdate }: Props) {
  const [loading, setLoading] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    ordenId: number | null;
    action: 'completar' | 'cancelar' | null;
    message: string;
  }>({
    open: false,
    ordenId: null,
    action: null,
    message: '',
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Función para manejar completar orden
  const handleCompletarOrden = async (ordenId: number) => {
    setLoading(ordenId);
    try {
      await api.patch(`/ordenes-compra/${ordenId}/estado`, {
        estado: "Completada"
      });
      
      setSnackbar({
        open: true,
        message: "✅ Orden completada exitosamente",
        severity: 'success'
      });
      
      onOrdenUpdate(); // Actualizar la lista
    } catch (error) {
      console.error("Error al completar orden:", error);
      setSnackbar({
        open: true,
        message: "❌ Error al completar la orden",
        severity: 'error'
      });
    } finally {
      setLoading(null);
      setConfirmDialog({ open: false, ordenId: null, action: null, message: '' });
    }
  };

  // Función para manejar cancelar orden
  const handleCancelarOrden = async (ordenId: number) => {
    setLoading(ordenId);
    try {
      await api.patch(`/ordenes-compra/${ordenId}/estado`, {
        estado: "Cancelada"
      });
      
      setSnackbar({
        open: true,
        message: "🛑 Orden cancelada exitosamente",
        severity: 'success'
      });
      
      onOrdenUpdate(); // Actualizar la lista
    } catch (error) {
      console.error("Error al cancelar orden:", error);
      setSnackbar({
        open: true,
        message: "❌ Error al cancelar la orden",
        severity: 'error'
      });
    } finally {
      setLoading(null);
      setConfirmDialog({ open: false, ordenId: null, action: null, message: '' });
    }
  };

  // Abrir diálogo de confirmación
  const openConfirmDialog = (ordenId: number, action: 'completar' | 'cancelar') => {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    const messages = {
      completar: `¿Estás seguro de que deseas marcar la orden "${orden.nombre_orden}" como COMPLETADA?`,
      cancelar: `¿Estás seguro de que deseas CANCELAR la orden "${orden.nombre_orden}"? Esta acción no se puede deshacer.`
    };

    setConfirmDialog({
      open: true,
      ordenId,
      action,
      message: messages[action]
    });
  };

  // Ejecutar acción confirmada
  const handleConfirmAction = () => {
    if (!confirmDialog.ordenId || !confirmDialog.action) return;

    if (confirmDialog.action === 'completar') {
      handleCompletarOrden(confirmDialog.ordenId);
    } else {
      handleCancelarOrden(confirmDialog.ordenId);
    }
  };

  // Cerrar diálogo de confirmación
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, ordenId: null, action: null, message: '' });
  };

  // Cerrar snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para obtener color del chip según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Completada":
        return "success";
      case "Pendiente":
        return "warning";
      case "Cancelada":
        return "error";
      default:
        return "default";
    }
  };

  // Verificar si una acción está disponible
  const isActionAvailable = (orden: Orden, action: 'completar' | 'cancelar') => {
    if (orden.estado === "Completada" || orden.estado === "Cancelada") {
      return false; // No se pueden modificar órdenes completadas o canceladas
    }
    return true;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Solicitud</TableCell>
              <TableCell>Fecha de Orden</TableCell>
              <TableCell>Nombre de Orden</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Cantidad Ordenada</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell>{orden.id}</TableCell>

                {/* Proveedor */}
                <TableCell>
                  <Box>
                    <div>
                      <strong>{orden.proveedor_id.nombre}</strong>
                    </div>
                  </Box>
                </TableCell>

                {/* Solicitud */}
                <TableCell>
                  <Box>
                    <div>
                      <strong>{orden.solicitud_id.nombre_solicitud}</strong>
                    </div>
                  </Box>
                </TableCell>

                {/* Fecha de Orden */}
                <TableCell>
                  {new Date(orden.fecha_orden).toLocaleDateString()}
                </TableCell>

                {/* Nombre de Orden */}
                <TableCell>{orden.nombre_orden}</TableCell>

                {/* Estado */}
                <TableCell>
                  <Chip
                    label={orden.estado}
                    color={getEstadoColor(orden.estado)}
                    size="small"
                  />
                </TableCell>

                {/* Precio Unitario */}
                <TableCell>${orden.precio_unitario}</TableCell>

                {/* Cantidad Ordenada */}
                <TableCell>{orden.cantidad_ordenada}</TableCell>

                {/* Total */}
                <TableCell>${orden.total}</TableCell>

                {/* Acciones */}
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success"
                      disabled={!isActionAvailable(orden, 'completar') || loading === orden.id}
                      onClick={() => openConfirmDialog(orden.id, 'completar')}
                    >
                      {loading === orden.id ? "Procesando..." : "Completar"}
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      disabled={!isActionAvailable(orden, 'cancelar') || loading === orden.id}
                      onClick={() => openConfirmDialog(orden.id, 'cancelar')}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Confirmación */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>
          Confirmar {confirmDialog.action === 'completar' ? 'Completar' : 'Cancelar'} Orden
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} disabled={loading !== null}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            color={confirmDialog.action === 'completar' ? 'success' : 'error'}
            disabled={loading !== null}
          >
            {loading !== null ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}