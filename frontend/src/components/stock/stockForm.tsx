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

interface Sucursal {
  id: number;
  nombre: string;
}

interface Lote {
  id: number;
  numero_lote: string;
}

export default function StockForm({ open, onClose, onCreate }: Props) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    sucursal_id: "",
    lote_id: "",
    cantidad_disponible: 0,
    cantidad_minima: 5, // Valor por defecto
    ubicacion: "",
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      setForm({
        sucursal_id: "",
        lote_id: "",
        cantidad_disponible: 0,
        cantidad_minima: 5,
        ubicacion: "",
      });
    }
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [sucursalesRes, lotesRes] = await Promise.all([
        api.get("/sucursales/ListarSucursal"),
        api.get("/lotes/ListarLotes"),
      ]);

      // ✅ Estructura CORRECTA basada en tus APIs
      setSucursales(
        sucursalesRes.data.data || 
        sucursalesRes.data || 
        []
      );

      setLotes(
        lotesRes.data.data || 
        lotesRes.data || 
        []
      );

    } catch (err) {
      console.error(err);
      alert("Error al cargar sucursales o lotes");
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
      sucursal_id: Number(form.sucursal_id),
      lote_id: Number(form.lote_id),
      cantidad_disponible: Number(form.cantidad_disponible),
      cantidad_minima: Number(form.cantidad_minima),
      ubicacion: form.ubicacion,
    };

    console.log("Payload a enviar:", payload);
    onCreate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Stock</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Sucursal"
              name="sucursal_id"
              value={form.sucursal_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {sucursales.map((sucursal) => (
                <MenuItem key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Lote"
              name="lote_id"
              value={form.lote_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {lotes.map((lote) => (
                <MenuItem key={lote.id} value={lote.id}>
                  Lote #{lote.numero_lote} (ID: {lote.id})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Cantidad Disponible"
              name="cantidad_disponible"
              type="number"
              value={form.cantidad_disponible}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Cantidad Mínima"
              name="cantidad_minima"
              type="number"
              value={form.cantidad_minima}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
              helperText="Alerta cuando el stock baje de esta cantidad"
            />

            <TextField
              label="Ubicación"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              fullWidth
              placeholder="Ej: Pasillo 1, Estante 2"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.sucursal_id || !form.lote_id || form.cantidad_disponible <= 0}
        >
          Crear Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
}