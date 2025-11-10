import Navbar from "@/components/forms/Navbar"; // Asegúrate de importar el formulario
import VentaForm from "@/components/ventas/ventaForm";
import VentaTable from "@/components/ventas/VentaTable";
import { api } from "@/lib/api";
import { Box, Typography, Button, Modal, Stack, CircularProgress } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

interface Venta {
  id: number;
  sucursal: {
    nombre: string;
  };
  empleado_cajero: {
    nombres: string;
    apellidos: string;
  };
  stock: {
    lote: {
      producto: {
        nombre: string;
        categoria: {
          nombre: string;
        };
        proveedor: {
          nombre: string;
        };
        precio_venta: number;
        unidad_medida: string;
      };
      numero_lote: string; // ← Cambié a string según tu entidad
    };
    cantidad_disponible: number; // Agregué esto para info del stock
  };
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  total: number; // ← Cambié a number (minúscula)
  fecha_venta: string;
  estado: string; // Agregué el estado
  metodo_pago: string; // ← Cambié a string (minúscula)
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

export default function VentasPage() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const res = await api.get("/ventas/ListarVentas");
            // Ajusta según la estructura real de tu API
            setVentas(res.data.data || res.data);
        } catch (err) {
            console.error(err);
            alert("Error al cargar ventas");
        } finally {
            setLoading(false);
        }
    };

    const crearVentas = async (data: unknown) => {
        try {
            const res = await api.post("/ventas/CrearVentas", data);
            alert("Venta creada exitosamente");
            console.log(res.data);
            cargarVentas(); // refresca la tabla
            setShowForm(false); // cierra el formulario
        } catch (err: unknown) {
            console.error(err);
            alert("Error al crear venta");
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
                    Ventas
                </Typography>

                <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
                    Otros apartados
                </Button>

                <Button variant="contained" onClick={handleCreateLote} sx={{ mb: 2 }} >
                    Crear Nuevo registro de Venta
                </Button>

                {/* Formulario de lote */}
                <VentaForm
                    open={showForm}
                    onClose={() => setShowForm(false)}
                    onCreate={crearVentas}
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
                            Opciones de Venta
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => router.push("/lotes")}
                                fullWidth
                            >
                                Reportes
                            </Button>
                        </Stack>
                        <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
                            Cerrar
                        </Button>
                    </Box>
                </Modal>

                {loading ? <CircularProgress /> : <VentaTable ventas={ventas} />}
            </Box>
        </>
    );
}