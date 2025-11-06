"use client";

import { useState } from "react";
import { Box, Button, TextField, Stack, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { api } from "@/lib/api";

interface Detalle {
  producto_id: number | "";
  cantidad_solicitada: number | "";
  justificacion: string;
}

interface Props {
  onSubmitSuccess: () => void;
}

export default function SolicitudForm({ onSubmitSuccess }: Props) {
  const [empleadoId, setEmpleadoId] = useState<number | "">("");
  const [sucursalId, setSucursalId] = useState<number | "">("");
  const [observaciones, setObservaciones] = useState("");
  const [detalles, setDetalles] = useState<Detalle[]>([{ producto_id: "", cantidad_solicitada: "", justificacion: "" }]);

  const handleAddDetalle = () => setDetalles([...detalles, { producto_id: "", cantidad_solicitada: "", justificacion: "" }]);
  const handleRemoveDetalle = (index: number) => setDetalles(detalles.filter((_, i) => i !== index));
  const handleDetalleChange = (index: number, field: keyof Detalle, value: unknown) => {
    const newDetalles = [...detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    setDetalles(newDetalles);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        empleado_solicitante_id: Number(empleadoId),
        sucursal_id: Number(sucursalId),
        observaciones,
        detalles: detalles.map(d => ({
          producto_id: Number(d.producto_id),
          cantidad_solicitada: Number(d.cantidad_solicitada),
          justificacion: d.justificacion,
        })),
      };

      await api.post("/solicitudes-compra/with-detalles", payload);
      alert("Solicitud creada exitosamente");
      onSubmitSuccess();

      // reset form
      setEmpleadoId("");
      setSucursalId("");
      setObservaciones("");
      setDetalles([{ producto_id: "", cantidad_solicitada: "", justificacion: "" }]);
    } catch (error) {
      console.error(error);
      alert("Error al crear la solicitud");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Crear Nueva Solicitud</Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField label="Empleado ID" fullWidth value={empleadoId} onChange={e => setEmpleadoId(Number(e.target.value))} />
        <TextField label="Sucursal ID" fullWidth value={sucursalId} onChange={e => setSucursalId(Number(e.target.value))} />
        <TextField label="Observaciones" fullWidth value={observaciones} onChange={e => setObservaciones(e.target.value)} />
      </Stack>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Detalles</Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {detalles.map((d, i) => (
          <Box key={i} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1, position: "relative" }}>
            <Stack spacing={2}>
              <TextField
                label="Producto ID"
                value={d.producto_id}
                onChange={e => handleDetalleChange(i, "producto_id", e.target.value)}
                fullWidth
              />
              <TextField
                label="Cantidad"
                value={d.cantidad_solicitada}
                onChange={e => handleDetalleChange(i, "cantidad_solicitada", e.target.value)}
                fullWidth
              />
              <TextField
                label="Justificación"
                value={d.justificacion}
                onChange={e => handleDetalleChange(i, "justificacion", e.target.value)}
                fullWidth
              />
            </Stack>
            <IconButton
              color="error"
              onClick={() => handleRemoveDetalle(i)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Stack>

      <Button variant="outlined" startIcon={<Add />} onClick={handleAddDetalle} sx={{ mb: 2 }}>
        Agregar Detalle
      </Button>

      <Button variant="contained" onClick={handleSubmit}>Guardar Solicitud</Button>
    </Box>
  );
}
