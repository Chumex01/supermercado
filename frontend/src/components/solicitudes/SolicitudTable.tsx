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
  Typography,
} from "@mui/material";
import { api } from "@/lib/api";
import OrdenForm from "../ordenes/OrdenForm"; // ← Importar el componente

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
  onSolicitudUpdate: () => void;
}

export default function SolicitudTable({
  solicitudes,
  onSolicitudUpdate,
}: Props) {
  const [showOrdenForm, setShowOrdenForm] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<Solicitud | null>(null);

  // Aprobar solicitud
  const aprobarSolicitud = async (solicitud: Solicitud) => {
    try {
      // Solo abrir formulario, sin cambiar estado todavía
      setSolicitudSeleccionada(solicitud);
      setShowOrdenForm(true);
      console.log("📋 Formulario abierto para solicitud:", solicitud.id);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al preparar la orden");
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (solicitudId: number) => {
    if (confirm("¿Estás seguro de rechazar esta solicitud?")) {
      try {
        await api.patch(`/solicitudes-compra/${solicitudId}/estado`, {
          estado: "Rechazada",
        });
        onSolicitudUpdate();
        alert("Solicitud rechazada exitosamente");
      } catch (error) {
        console.error("Error al rechazar solicitud:", error);
        alert("Error al rechazar la solicitud");
      }
    }
  };

const crearOrdenCompra = async (datosOrden: any) => {
  try {
    console.log("📨 Recibiendo datos en crearOrdenCompra:", datosOrden);
    
    // Validar y convertir datos
    const datosValidados = {
      solicitud_id: Number(datosOrden.solicitud_id),
      proveedor_id: Number(datosOrden.proveedor_id),
      nombre_orden: String(datosOrden.nombre_orden),
      cantidad_ordenada: Number(datosOrden.cantidad_ordenada),
      precio_unitario: Number(datosOrden.precio_unitario),
    };

    console.log("✅ Datos validados:", datosValidados);

    // Verificar que todos los campos sean válidos
    if (datosValidados.cantidad_ordenada <= 0 || !Number.isInteger(datosValidados.cantidad_ordenada)) {
      throw new Error('La cantidad debe ser un número entero mayor a 0');
    }

    if (datosValidados.precio_unitario <= 0) {
      throw new Error('El precio unitario debe ser mayor a 0');
    }

    if (!datosValidados.proveedor_id) {
      throw new Error('El proveedor es requerido');
    }

    // 1. Crear la orden
    console.log("🚀 Enviando request al servidor...");
    const response = await api.post("/ordenes-compra/CrearOrdenCompra", datosValidados);
    console.log("✅ Respuesta del servidor:", response.data);
    
    // 2. Cambiar estado de la solicitud a "Aprobada"
    await api.patch(`/solicitudes-compra/${datosValidados.solicitud_id}/estado`, {
      estado: "Aprobada"
    });
    
    setShowOrdenForm(false);
    setSolicitudSeleccionada(null);
    onSolicitudUpdate();
    alert("✅ Orden de compra creada exitosamente");
    
  } catch (error: any) {
    console.error("❌ Error completo en crearOrdenCompra:", error);
    console.error("❌ Respuesta del error:", error.response?.data);
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Error al crear la orden de compra";
    
    alert(`Error: ${errorMessage}`);
    throw error; // Re-lanzar el error para que el formulario lo maneje
  }
};
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Justificación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              {/* <TableCell>Acciones</TableCell>  */}
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell>{solicitud.id}</TableCell>
                <TableCell>
                  {solicitud.empleado_id?.nombres}{" "}
                  {solicitud.empleado_id?.apellidos}
                </TableCell>
                <TableCell>{solicitud.producto_id?.nombre}</TableCell>
                <TableCell>{solicitud.sucursal?.nombre}</TableCell>
                <TableCell>{solicitud.nombre_solicitud}</TableCell>
                <TableCell>{solicitud.cantidad_solicitada}</TableCell>
                <TableCell>{solicitud.justificacion}</TableCell>
                <TableCell>
                  <Chip
                    label={solicitud.estado}
                    color={
                      solicitud.estado === "Aprobada"
                        ? "success"
                        : solicitud.estado === "Rechazada"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                  >
                    {solicitud.estado === "Pendiente" && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => aprobarSolicitud(solicitud)}
                          fullWidth
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => rechazarSolicitud(solicitud.id)}
                          fullWidth
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {solicitud.estado !== "Pendiente" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        {solicitud.estado}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Formulario de Orden como componente separado */}
      <OrdenForm
        open={showOrdenForm}
        onClose={() => setShowOrdenForm(false)}
        onCreate={crearOrdenCompra}
        solicitud={solicitudSeleccionada}
      />
    </>
  );
}
