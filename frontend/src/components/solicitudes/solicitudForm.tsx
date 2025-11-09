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
  CircularProgress,
} from "@mui/material";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
}

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
}

interface Producto {
  id: number;
  nombre: string;
}

interface Sucursal {
  id: number;
  nombre: string;
}

export default function SolicitudForm({ open, onClose, onCreate }: Props) {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    empleado_id: "",
    producto_id: "",
    sucursal_id: "",
    nombre_solicitud: "",
    cantidad_solicitada: 0, // Valor por defecto
    justificacion: "",
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      setForm({
        empleado_id: "",
        producto_id: "",
        sucursal_id: "",
        nombre_solicitud: "",
        cantidad_solicitada: 0,
        justificacion: "",
      });
    }
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [empleadosRes, productosRes, sucursalesRes] = await Promise.all([
        api.get("/empleados/ListarEmpleados"),
        api.get("/productos/ListarProductos"),
        api.get("/sucursales/ListarSucursal"),
      ]);

      // ✅ Estructura CORRECTA basada en tus APIs
      setEmpleados(empleadosRes.data.data || empleadosRes.data || []);

      setProductos(productosRes.data.data || productosRes.data || []);

      setSucursales(sucursalesRes.data.data || sucursalesRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar productos o sucursales");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name.includes("cantidad") ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    const payload = {
      empleado_id: Number(form.empleado_id),
      producto_id: Number(form.producto_id),
      sucursal_id: Number(form.sucursal_id),
      nombre_solicitud: String(form.nombre_solicitud),
      cantidad_solicitada: Number(form.cantidad_solicitada),
      justificacion: String(form.justificacion),
    };

    console.log("Payload a enviar:", payload);
    onCreate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nueva Solicitud</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Empleado"
              name="empleado_id"
              value={form.empleado_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {empleados.map((empleado) => (
                <MenuItem key={empleado.id} value={empleado.id}>
                  {empleado.nombres } {empleado.apellidos}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Producto"
              name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {productos.map((productos) => (
                <MenuItem key={productos.id} value={productos.id}>
                  {productos.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sucursales"
              name="sucursal_id"
              value={form.sucursal_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {sucursales.map((sucursal) => (
                <MenuItem key={sucursal.id} value={sucursal.id}>
                  Sucursal <div id={sucursal.nombre}></div> (ID: {sucursal.id})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nombre Solicitud"
              name="nombre_solicitud"
              //   type="text"
              value={form.nombre_solicitud}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Cantidad Solicitada"
              name="cantidad_solicitada"
              type="number"
              value={form.cantidad_solicitada}
              onChange={handleChange}
              fullWidth
              required
              //   inputProps={{ min: 0 }}
              //   helperText="Alerta cuando el stock baje de esta cantidad"
            />

            <TextField
              label="Justiificación"
              name="justificacion"
              value={form.justificacion}
              onChange={handleChange}
              fullWidth
              placeholder="Ya no hay productos suficientes en la sucursal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !form.producto_id ||
            !form.sucursal_id ||
            form.cantidad_solicitada <= 0
          }
        >
          Crear Solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
}
