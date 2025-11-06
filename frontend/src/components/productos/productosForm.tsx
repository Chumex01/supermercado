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
// import { Description } from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

export default function ProductoForm({ open, onClose, onCreate }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoria_id: "",
    proveedor_id: "",
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    precio_venta: "",
    unidad_medida: "",
  });

  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

const cargarDatos = async () => {
  setLoading(true);
  try {
    const [categoriasRes, proveedoresRes] = await Promise.all([
      api.get("/categorias/ListarCategorias"),  // 👈 cuidado con mayúsculas/minúsculas
      api.get("/proveedores/ListarProveedores"),
    ]);

    // ✅ Verificamos si hay data en diferentes formatos
    setCategorias(
      categoriasRes.data.data || categoriasRes.data || []
    );
    setProveedores(
      proveedoresRes.data.data || proveedoresRes.data || []
    );
  } catch (err) {
    console.error(err);
    alert("Error al cargar categorias o proveedores");
  } finally {
    setLoading(false);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = () => {
  const payload = {
    ...form,
    categoria_id: Number(form.categoria_id),
    proveedor_id: Number(form.proveedor_id),
    codigo_barras: form.codigo_barras || null,
    nombre: form.nombre || null,
    descripcion: form.descripcion || null,
    precio_venta: form.precio_venta || null,
    unidad_medida: form.unidad_medida || null,
    // fecha_contratacion: form.fecha_contratacion.split("T")[0] || form.fecha_contratacion, // formato ISO válido
  };

  console.log("Payload a enviar:", payload); // 👈 para verificar

  onCreate(payload);

  setForm({
    categoria_id: "",
    proveedor_id: "",
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    precio_venta: "",
    unidad_medida: "",
  });
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nuevo Producto</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Categoria"
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {categorias.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Proveedor"
              name="proveedor_id"
              value={form.proveedor_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {proveedores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Código de Barras"
              name="codigo_barras"
              value={form.codigo_barras}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Precio de Venta"
              name="precio_venta"
              value={form.precio_venta}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Unidad de Medición"
              name="unidad_medida"
              value={form.unidad_medida}
              onChange={handleChange}
              fullWidth
            />

            {/* <TextField
              label="Fecha de Contratación"
              name="fecha_contratacion"
              type="date"
              value={form.fecha_contratacion}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            /> */}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          variant="contained"
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
