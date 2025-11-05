// src/components/usuarios/UsuarioForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (nombre: string, direccion: string, telefono: string) => void;
}

export default function SucursalForm({ open, onClose, onCreate }: Props) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = () => {
    onCreate(nombre, direccion, telefono);
    setNombre("");
    setDireccion("");
    setTelefono("")
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nueva Sucursal</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Nombre de Sucursal"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
        />
        <TextField
          label="Dirección de Sucursal"
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          fullWidth
        />
        <TextField
          label="Telefono de Sucursal"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          fullWidth
        />
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
