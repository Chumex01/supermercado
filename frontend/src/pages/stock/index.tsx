import Navbar from "@/components/forms/Navbar"; // Asegúrate de importar el formulario
import StockForm from "@/components/stock/stockForm";
import StockTable from "@/components/stock/StockTable";
import { api } from "@/lib/api";
import { Box, Typography, Button, Modal, Stack, CircularProgress } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

interface Stock {
  id: number;
  sucursal: {
    id: number;
    nombre: string;
  };
  lote: {
    id: number;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_recibida: number;
    costo_unitario: number;
    estado: string;
  };
  cantidad_disponible: number;
  cantidad_minima: number;
  ubicacion: string;
  fecha_creacion: string;     // ← Agregar estos campos
  fecha_actualizacion: string; // ← Agregar estos campos
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

export default function StockPage() {
  const [stocks, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarStocks();
  }, []);

  const cargarStocks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/stock/ListarStocks");
      // Ajusta según la estructura real de tu API
      setStock(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar stocks");
    } finally {
      setLoading(false);
    }
  };

  const crearStock = async (data: unknown) => {
    try {
      const res = await api.post("/stock/CrearStock", data);
      alert("Stock creado exitosamente");
      console.log(res.data);
      cargarStocks(); // refresca la tabla
      setShowForm(false); // cierra el formulario
    } catch (err: unknown) {
      console.error(err);
      alert("Error al crear stock");
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
          Stock
        </Typography>

        <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateLote} sx={{ mb: 2 }} >
          Crear Nuevo registro de Lote
        </Button>

        {/* Formulario de lote */}
        <StockForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearStock}
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
                onClick={() => router.push("/lotes")}
                fullWidth
              >
                Lotes
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <StockTable stocks={stocks} />}
      </Box>
    </>
  );
}