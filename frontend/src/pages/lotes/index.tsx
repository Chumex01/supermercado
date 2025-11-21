import { Boton } from "@/components/botones/botonNav";
import Navbar from "@/components/forms/Navbar";
import LoteTable from "@/components/lotes/LoteTable";
import LoteForm from "@/components/lotes/loteForm"; // Asegúrate de importar el formulario
import { api } from "@/lib/api";
import { Box, Typography, Button, Modal, Stack, CircularProgress } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

interface Lote {
  id: number;
  orden_compra: {
    id: number;
  };
  producto: {
    id: number;
  };
  numero_lote: string;
  fecha_vencimiento: string;
  cantidad_recibida: number;
  costo_unitario: number;
  fecha_recepcion: string;
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

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarLotes();
  }, []);

  const cargarLotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lotes/ListarLotes");
      // Ajusta según la estructura real de tu API
      setLotes(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar lotes");
    } finally {
      setLoading(false);
    }
  };

  const crearLote = async (data: unknown) => {
    try {
      const res = await api.post("/lotes/CrearLote", data);
      alert("Lote creado exitosamente");
      console.log(res.data);
      cargarLotes(); // refresca la tabla
      setShowForm(false); // cierra el formulario
    } catch (err: unknown) {
      console.error(err);
      alert("Error al crear lote");
    }
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
          Lotes
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
          label="Crear Nuevo Lote"
          size="small"
          color="default"
          variant="contained"
          onClick={handleCreateLote}
          className="mr-2"
        />

        {/* Formulario de lote */}
        <LoteForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearLote}
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
              Opciones de Inventario
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/stock")}
                fullWidth
              >
                Stock
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <LoteTable lotes={lotes} />}
      </Box>
    </>
  );
}