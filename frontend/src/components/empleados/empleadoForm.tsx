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
  onCreate: (data: any) => void;
}

interface Usuario {
  id: number;
  correo: string;
}

interface Sucursal {
  id: number;
  nombre: string;
}

export default function EmpleadoForm({ open, onClose, onCreate }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    usuario_id: "",
    sucursal_id: "",
    nombres: "",
    apellidos: "",
    documento_identidad: "",
    telefono: "",
    cargo: "",
    fecha_contratacion: "",
  });

  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

const cargarDatos = async () => {
  setLoading(true);
  try {
    const [usuariosRes, sucursalesRes] = await Promise.all([
      api.get("/usuarios/ListarUsuario"),  // 👈 cuidado con mayúsculas/minúsculas
      api.get("/sucursales/ListarSucursal"),
    ]);

    // ✅ Verificamos si hay data en diferentes formatos
    setUsuarios(
      usuariosRes.data.data || usuariosRes.data || []
    );
    setSucursales(
      sucursalesRes.data.data || sucursalesRes.data || []
    );
  } catch (err) {
    console.error(err);
    alert("Error al cargar usuarios o sucursales");
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
    usuario_id: Number(form.usuario_id),
    sucursal_id: Number(form.sucursal_id),
    telefono: form.telefono || null,
    fecha_contratacion: form.fecha_contratacion.split("T")[0] || form.fecha_contratacion, // formato ISO válido
  };

  console.log("Payload a enviar:", payload); // 👈 para verificar

  onCreate(payload);

  setForm({
    usuario_id: "",
    sucursal_id: "",
    nombres: "",
    apellidos: "",
    documento_identidad: "",
    telefono: "",
    cargo: "",
    fecha_contratacion: "",
  });
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nuevo Empleado</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Usuario"
              name="usuario_id"
              value={form.usuario_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {usuarios.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.correo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sucursal"
              name="sucursal_id"
              value={form.sucursal_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {sucursales.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nombres"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Apellidos"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Documento de Identidad"
              name="documento_identidad"
              value={form.documento_identidad}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Cargo"
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Fecha de Contratación"
              name="fecha_contratacion"
              type="date"
              value={form.fecha_contratacion}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
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
