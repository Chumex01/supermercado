// src/pages/usuarios/index.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import UsuariosTable from "@/components/usuarios/UsuarioTable";
import UsuarioForm from "@/components/usuarios/usuarioForm";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Modal,
  Stack,
} from "@mui/material";
import Navbar from "@/components/forms/Navbar";
import router, { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Boton } from "@/components/botones/botonNav";

interface Usuario {
  id: number;
  correo: string;
  fecha_creacion: string;
}

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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const id = Cookies.get("usuario_id");
      if (!id) router.push("/login"); // redirige si no está logueado
    }, [router]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios/ListarUsuario");
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const crearUsuarios = async (correo: string, contrasena: string) => {
    try {
      await api.post("/usuarios", { correo, contrasena });
      alert("Usuario creado con éxito ✅");
      cargarUsuarios();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario ❌");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCreateUser = () => {
    setModalOpen(false); // Cierra el modal
    setShowForm(true); // Abre el formulario
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>

        <Boton
          label="Otros apartados"
          size="medium"
          color="default2"
          variant="contained"
          onClick={handleOpenModal}
          className="m-3"
        />

        <Boton
          label="Crear Nuevo Usuario"
          size="small"
          color="default"
          variant="contained"
          onClick={() => setShowForm(true)}
        />

        {/* Formulario de usuario (fuera del modal) */}
        <UsuarioForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearUsuarios}
        />

        {/* Modal principal con botones */}
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Opciones de Acceso y Seguridad
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/sucursales")}
                fullWidth
              >
                Sucursales
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push("/empleados")}
                fullWidth
              >
                Empleados
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <UsuariosTable usuarios={usuarios} />}
      </Box>
    </>
  );
}
