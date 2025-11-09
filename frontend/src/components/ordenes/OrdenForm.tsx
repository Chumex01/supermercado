"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { api } from "@/lib/api";

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

interface Proveedor {
  id: number;
  nombre: string;
}

interface OrdenFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
  solicitud: Solicitud | null;
}

export default function OrdenForm({ open, onClose, onCreate, solicitud }: OrdenFormProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    proveedor_id: "",
    precio_unitario: "",
    nombre_orden: "",
  });

  useEffect(() => {
    if (open) {
      cargarProveedores();
      // Pre-llenar con datos de la solicitud
      if (solicitud) {
        setForm({
          proveedor_id: "",
          precio_unitario: "",
          nombre_orden: `Orden para ${solicitud.producto_id.nombre}`,
        });
      }
    }
  }, [open, solicitud]);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/proveedores/ListarProveedor");
      setProveedores(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🎯 handleSubmit EJECUTADO");
    
    if (!solicitud) {
      console.log("❌ No hay solicitud seleccionada");
      return;
    }

    // Validaciones
    if (!form.proveedor_id) {
      alert("Por favor selecciona un proveedor");
      return;
    }

    if (!form.precio_unitario || Number(form.precio_unitario) <= 0) {
      alert("Por favor ingresa un precio unitario válido");
      return;
    }

    if (!form.nombre_orden.trim()) {
      alert("Por favor ingresa un nombre para la orden");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        solicitud_id: solicitud.id,
        proveedor_id: Number(form.proveedor_id),
        nombre_orden: form.nombre_orden,
        precio_unitario: Number(form.precio_unitario),
        cantidad_ordenada: Number(solicitud.cantidad_solicitada),
      };

      console.log("📤 Payload a enviar:", payload);
      console.log("🔍 Tipos de datos:", {
        solicitud_id: typeof payload.solicitud_id,
        proveedor_id: typeof payload.proveedor_id,
        nombre_orden: typeof payload.nombre_orden,
        precio_unitario: typeof payload.precio_unitario,
        cantidad_ordenada: typeof payload.cantidad_ordenada,
      });
      
      // ✅ Esto debe ejecutarse
      await onCreate(payload);
      
      // Limpiar formulario después de éxito
      setForm({
        proveedor_id: "",
        precio_unitario: "",
        nombre_orden: "",
      });
      
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      proveedor_id: "",
      precio_unitario: "",
      nombre_orden: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Crear Orden de Compra
          {solicitud && (
            <Typography variant="subtitle2" color="text.secondary">
              Para: {solicitud.producto_id.nombre}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent>
          {/* Información de la solicitud aprobada */}
          {solicitud && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Solicitud Aprobada
              </Typography>
              <Typography><strong>Producto:</strong> {solicitud.producto_id.nombre}</Typography>
              <Typography><strong>Cantidad:</strong> {solicitud.cantidad_solicitada}</Typography>
              <Typography><strong>Solicitante:</strong> {solicitud.empleado_id.nombres} {solicitud.empleado_id.apellidos}</Typography>
              <Typography><strong>Sucursal:</strong> {solicitud.sucursal.nombre}</Typography>
              <Typography><strong>Justificación:</strong> {solicitud.justificacion}</Typography>
            </Box>
          )}

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress />
              <Typography sx={{ mt: 1 }}>Cargando proveedores...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nombre de la Orden"
                value={form.nombre_orden}
                onChange={(e) => setForm({ ...form, nombre_orden: e.target.value })}
                fullWidth
                required
                disabled={submitting}
              />

              <TextField
                select
                label="Proveedor"
                value={form.proveedor_id}
                onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}
                fullWidth
                required
                disabled={submitting}
                helperText="Selecciona un proveedor para este producto"
              >
                {proveedores.map((proveedor) => (
                  <MenuItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Precio Unitario"
                type="number"
                value={form.precio_unitario}
                onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })}
                fullWidth
                required
                disabled={submitting}
                inputProps={{ 
                  min: 0, 
                  step: "0.01",
                  onKeyDown: (e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }
                }}
                helperText="Precio por unidad del producto"
                error={form.precio_unitario !== "" && Number(form.precio_unitario) <= 0}
              />

              <TextField
                label="Cantidad"
                value={solicitud?.cantidad_solicitada || 0}
                fullWidth
                disabled
                helperText="Cantidad tomada de la solicitud aprobada"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!form.proveedor_id || !form.precio_unitario || !form.nombre_orden || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Crear Orden de Compra"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}