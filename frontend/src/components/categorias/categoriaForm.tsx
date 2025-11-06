"use client";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (nombre: string, descripcion: string) => void;
}

export default function CategoriaForm({ open, onClose, onCreate }: Props) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = () => {
        onCreate(nombre, descripcion);
        setNombre("");
        setDescripcion("");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Crear Nueva Categoria</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Nombre de Categoria"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Descripcion de Categoria"
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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