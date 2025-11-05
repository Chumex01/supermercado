// src/components/usuarios/UsuarioForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (correo: string, contrasena: string) => void;
}

export default function UsuarioForm({ open, onClose, onCreate }: Props) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = () => {
    onCreate(correo, contrasena);
    setCorreo("");
    setContrasena("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
