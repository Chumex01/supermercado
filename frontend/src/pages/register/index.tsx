import UsuarioForm from "@/components/usuarios/usuarioForm";
import { api } from "@/lib/api";
import { Button } from "@mui/material";
import { useState } from "react";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function RegisterPage() {
    const [showForm, setShowForm] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const crearUsuarios = async (correo: string, contrasena: string) => {
        try {
            await api.post("/usuarios", { correo, contrasena });
            alert("Usuario creado con éxito ✅");
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Error al crear usuario ❌");
        }
    };

    const handleCreateUser = () => {
        setModalOpen(false); // Cierra el modal
        setShowForm(true); // Abre el formulario
    };
    
    return (
        <>
            <h1>Crea tu Usuario</h1>

            <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
                Crear Usuario
            </Button>

            <UsuarioForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearUsuarios}
            />
        </>
    )
}