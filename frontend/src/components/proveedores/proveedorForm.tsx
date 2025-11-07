"use client";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (nombre: string, telefono: string, correo: string, direccion: string) => void;
}

export default function ProveedorForm({ open, onClose, onCreate }: Props) {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");

    const handleSubmit = () => {
        onCreate(nombre, telefono, correo, direccion);
        setNombre("");
        setTelefono("");
        setCorreo("");
        setDireccion("");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Nombre de Proveedor"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Telefono de Proveedor"
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Correo de Proveedor"
                    type="text"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Dirección de Proveedor"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Crear</Button>
            </DialogActions>
        </Dialog>
    );
}