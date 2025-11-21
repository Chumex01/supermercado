// src/pages/usuarios/index.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
import EmpleadoTable from "@/components/empleados/EmpleadoTable";
import EmpleadoForm from "@/components/empleados/empleadoForm";
import { Boton } from "@/components/botones/botonNav";

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  telefono: string;
  cargo: string;
  fecha_contratacion: string;
  estado: string;
  usuario: {
    id: number;
    correo: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
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

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const res = await api.get("/empleados/ListarEmpleados");
      setEmpleados(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

const crearEmpleado = async (data: unknown) => {
  try {
    const res = await api.post("/empleados/CrearEmpleado", data);
    alert("Empleado creado exitosamente");
    console.log(res.data);
    cargarEmpleados(); // refresca la tabla
  } catch (err: unknown) {
    console.error(err);
    alert("Error al crear empleado");
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
          Empleados
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
          label="Crear Nuevo Empleado"
          size="small"
          color="default"
          variant="contained"
          onClick={handleCreateUser}
        />

        {/* Formulario de usuario (fuera del modal) */}
        <EmpleadoForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearEmpleado}
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
                onClick={() => router.push("/sucursales")}
                fullWidth
              >
                Sucursales
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <EmpleadoTable empleados={empleados} />}
      </Box>
    </>
  );
}

