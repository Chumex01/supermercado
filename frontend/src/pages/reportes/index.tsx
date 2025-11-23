"use client";

import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import Navbar from "@/components/forms/Navbar";
import GenerarPdfVentas from "@/components/reportes/GenerarPdfVentas";
import GenerarPdfStock from "@/components/reportes/GenerarPdfStock";
import { Boton } from "@/components/botones/botonNav";
import VentaForm from "@/components/ventas/ventaForm";
import router from "next/router";
import { useState } from "react";

export default function ReportesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCreateLote = () => {
    setModalOpen(false); // Cierra el modal
    setShowForm(true); // Abre el formulario
  };
  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Ventas
        </Typography>

        <Boton
          label="Otros apartados"
          size="medium"
          color="default2"
          variant="contained"
          onClick={handleOpenModal}
          className="m-3"
        />
        <GenerarPdfVentas />
        <GenerarPdfStock />

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
              Opciones de Venta
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/ventas")}
                fullWidth
              >
                Ventas
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
