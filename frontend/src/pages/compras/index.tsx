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
import SolicitudTable from "@/components/compras/SolicitudTable";
import SolicitudForm from "@/components/compras/SolicitudForm";

// Tipos TypeScript
export interface Detalle {
  id: number;
  producto_id: number;
  cantidad_solicitada: number;
  justificacion: string;
  fecha_creacion: string;
}

export interface Solicitud {
  id: number;
  empleado_solicitante: { id: number; nombre: string; apellidos: string };
  sucursal: { id: number; nombre: string };
  observaciones?: string;
  estado: string;
  fecha_solicitud: string;
  detalles: Detalle[];
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SolicitudesPage() {
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Fetch seguro tipado
  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/solicitudes-compra/ListarSolicitudesCompra");

      const solicitudesData: Solicitud[] = (res.data.solicitudes ?? []).map(
        (s: Record<string, unknown>) => ({
          id: s.id as number,
          empleado_solicitante: s.empleado_solicitante as {
            id: number;
            nombre: string;
            apellidos: string;
          },
          sucursal: s.sucursal as { id: number; nombre: string },
          observaciones: (s.observaciones as string) ?? "",
          estado: s.estado as string,
          fecha_solicitud: s.fecha_solicitud as string,
          detalles: (s.detalles as Detalle[]) ?? [],
        })
      );

      setSolicitudes(solicitudesData);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenForm = () => setFormOpen(true);
  const handleCloseForm = () => setFormOpen(false);

  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    fetchSolicitudes(); // recarga datos
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Solicitudes de Compra
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" onClick={handleOpenModal}>
            Otros apartados
          </Button>
          <Button variant="contained" onClick={handleOpenForm}>
            Crear Nueva Solicitud
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SolicitudTable solicitudes={solicitudes} />
        )}

        {/* Modal opciones */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Opciones de Compras
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/ordenes-compra")}
                fullWidth
              >
                Ordenes de Compra
              </Button>
            </Stack>
            <Button onClick={handleCloseModal} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {/* Modal formulario */}
        <Modal open={formOpen} onClose={handleCloseForm}>
          <Box sx={modalStyle}>
            <SolicitudForm onSubmitSuccess={handleFormSubmitSuccess} />
          </Box>
        </Modal>
      </Box>
    </>
  );
}
