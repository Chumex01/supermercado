"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SucursalForm from "@/components/sucursales/sucursalForm";
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
import SucursalesTable from "@/components/sucursales/SucursalTable";

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: string;
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

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sucursales/ListarSucursal");
      setSucursales(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar sucursales");
    } finally {
      setLoading(false);
    }
  };

  const crearSucursales = async (nombre: string, direccion: string, telefono: string) => {
    try {
      await api.post("/sucursales/CrearSucursal", { nombre, direccion, telefono });
      alert("Sucursal creada con éxito ✅");
      cargarSucursales();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear sucursal ❌");
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
          Sucursales
        </Typography>

        <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
          Crear Nueva Sucursal
        </Button>

        {/* Formulario de sucursal (fuera del modal) */}
        {/* <SucursalForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearSucursales}
        /> */}
        <SucursalForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearSucursales}
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
                onClick={() => router.push("/usuarios")}
                fullWidth
              >
                Usuarios
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

        {loading ? <CircularProgress /> : <SucursalesTable sucursales={sucursales} />}
      </Box>
    </>
  );
}
