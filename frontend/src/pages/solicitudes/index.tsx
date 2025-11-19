import SolicitudForm from "@/components/solicitudes/solicitudForm";
import Navbar from "@/components/forms/Navbar";
import { api } from "@/lib/api";
import {
  Box,
  Typography,
  Button,
  Modal,
  Stack,
  CircularProgress,
} from "@mui/material";
// import router from "next/router";
import { useEffect, useState } from "react";
import SolicitudTable from "@/components/solicitudes/SolicitudTable";
import router, { useRouter } from "next/router";
import Cookies from "js-cookie";

interface Solicitud {
  id: number;
  empleado_id: {
    id: number;
    nombres: string;
    apellidos: string;
  };
  producto_id: {
    id: number;
    nombre: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
  nombre_solicitud: string;
  cantidad_solicitada: number;
  justificacion: string;
  estado: string;
  fecha_solicitud: string;
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

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
      const router = useRouter();
    
      useEffect(() => {
        const id = Cookies.get("usuario_id");
        if (!id) router.push("/login"); // redirige si no está logueado
      }, [router]);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/solicitudes-compra/ListarSolicitudesCompra");
      // Ajusta según la estructura real de tu API
      setSolicitudes(res.data.solicitudesCompra || res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const crearSolicitud = async (data: unknown) => {
    try {
      const res = await api.post("/solicitudes-compra/CrearSolicitudCompra", data);
      alert("Solicitud creado exitosamente");
      console.log(res.data);
      cargarSolicitudes(); // refresca la tabla
      setShowForm(false); // cierra el formulario
    } catch (err: unknown) {
      console.error(err);
      alert("Error al crear solicitud");
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
          Solicitudes
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{ mb: 2, mr: 2 }}
        >
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateLote} sx={{ mb: 2 }}>
          Crear Nueva Solicitud
        </Button>

        {/* Formulario de lote */}
        <SolicitudForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearSolicitud}
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
              Opciones de Compras
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push("/ordenes")}
                fullWidth
              >
                Ordenes
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? (
          <CircularProgress />
        ) : (
          <SolicitudTable
            solicitudes={solicitudes}
            onSolicitudUpdate={cargarSolicitudes} // ← Agregar esta prop
          />
        )}
      </Box>
    </>
  );
}
