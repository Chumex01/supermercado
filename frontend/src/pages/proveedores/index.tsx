"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import ProveedorForm from "@/components/proveedores/proveedorForm";
import ProveedorTable from "@/components/proveedores/ProveedorTable";
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Modal,
    Stack,
} from "@mui/material";
import Navbar from "@/components/forms/Navbar";
import router from "next/router";

interface Proveedor {
    id: number;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: string;
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

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/proveedores/ListarProveedor");
      setProveedores(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

const crearProveedores = async (nombre: string, telefono: string, correo: string, direccion: string) => {
  try {
    await api.post("/proveedores/CrearProveedor", { nombre, telefono, correo, direccion });
    alert("Proveedor creado conxito ✅");
    cargarProveedores();
    setShowForm(false);
  } catch (err) {
    console.error(err);
    alert("Error al crear proveedor");
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
          Proveedores
        </Typography>

        <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
          Crear Nuevo Proveedor
        </Button>

        {/* Formulario de usuario (fuera del modal) */}
        <ProveedorForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearProveedores}
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
              Opciones de Catálogo
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/productos")}
                fullWidth
              >
                Productos
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push("/categorias")}
                fullWidth
              >
                Categorias
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <ProveedorTable proveedores={proveedores} />}
      </Box>
    </>
  );
}