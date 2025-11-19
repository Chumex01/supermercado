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

interface OrdenCompra {
  id: number;
  // Puedes agregar más campos si los necesitas para mostrar
}

interface Producto {
  id: number;
  nombre: string;
  // Puedes agregar más campos si los necesitas
}

export default function LoteForm({ open, onClose, onCreate }: Props) {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    orden_compra_id: "",
    producto_id: "",
    numero_lote: "",
    fecha_vencimiento: "",
    cantidad_recibida: 0,
    costo_unitario: 0,
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      // Resetear formulario cuando se abre
      setForm({
        orden_compra_id: "",
        producto_id: "",
        numero_lote: "",
        fecha_vencimiento: "",
        cantidad_recibida: 0,
        costo_unitario: 0,
      });
    }
  }, [open]);

const cargarDatos = async () => {
  setLoading(true);
  try {
    const [ordenesRes, productosRes] = await Promise.all([
      api.get("/ordenes-compra/ultimo"),
      api.get("/productos/ListarProductos"),
    ]);

    setOrdenesCompra(
      ordenesRes.data.data ? [ordenesRes.data.data] : []
    );

    setProductos(
      productosRes.data.data || productosRes.data || []
    );

  } catch (err) {
    console.error(err);
    alert("Error al cargar órdenes o productos");
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name.includes('cantidad') || name.includes('costo') ? Number(value) : value 
    });
  };

  const handleSubmit = () => {
    const payload = {
      orden_compra_id: Number(form.orden_compra_id),
      producto_id: Number(form.producto_id),
      numero_lote: form.numero_lote,
      fecha_vencimiento: form.fecha_vencimiento,
      cantidad_recibida: Number(form.cantidad_recibida),
      costo_unitario: Number(form.costo_unitario),
    };

    console.log("Payload a enviar:", payload);
    onCreate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Lote</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Orden de Compra"
              name="orden_compra_id"
              value={form.orden_compra_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {ordenesCompra.map((orden) => (
                <MenuItem key={orden.id} value={orden.id}>
                  Orden #{orden.id}
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
              {productos.map((producto) => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre} (ID: {producto.id})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Número de Lote"
              name="numero_lote"
              value={form.numero_lote}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Fecha de Vencimiento"
              name="fecha_vencimiento"
              type="date"
              value={form.fecha_vencimiento}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Cantidad Recibida"
              name="cantidad_recibida"
              type="number"
              value={form.cantidad_recibida}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Costo Unitario"
              name="costo_unitario"
              type="number"
              value={form.costo_unitario}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.orden_compra_id || !form.producto_id || !form.numero_lote || !form.fecha_vencimiento}
        >
          Crear Lote
        </Button>
      </DialogActions>
    </Dialog>
  );
}