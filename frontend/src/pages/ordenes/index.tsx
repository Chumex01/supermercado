import Navbar from "@/components/forms/Navbar";
import OrdenTable from "@/components/ordenes/ordenTable";
import { api } from "@/lib/api";
import { 
  Box, 
  Typography, 
  Button, 
  Modal, 
  Stack, 
  CircularProgress,
  Badge,
  Chip
} from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

interface Orden {
  id: number;
  solicitud_id: {
    id: number;
    nombre_solicitud: string;
  };
  proveedor_id: {
    id: number;
    nombre: string;
  };
  nombre_orden: string;
  estado: string;
  precio_unitario: number;
  cantidad_ordenada: number;
  total: number;
  fecha_orden: string;
}

interface SolicitudPendiente {
  id: number;
  estado: string;
  // Puedes agregar más campos si los necesitas
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

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    cargarOrdenes();
    cargarSolicitudesPendientes();
  }, [refreshKey]);

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ordenes-compra/ListarOrdenesCompra");
      console.log("📦 Respuesta completa de la API:", res.data);
      setOrdenes(res.data.ordenesCompra || res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ Error al cargar órdenes:", err);
      alert("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  const cargarSolicitudesPendientes = async () => {
    setLoadingSolicitudes(true);
    try {
      const res = await api.get("/solicitudes-compra/ListarSolicitudesCompra");
      console.log("📋 Todas las solicitudes:", res.data);
      
      // Filtrar solo las solicitudes pendientes
      const todasSolicitudes = res.data.solicitudesCompra || res.data.data || res.data || [];
      const pendientes = todasSolicitudes.filter((solicitud: any) => 
        solicitud.estado === "Pendiente" || solicitud.estado === "pendiente"
      );
      
      console.log("⏳ Solicitudes pendientes:", pendientes);
      setSolicitudesPendientes(pendientes);
    } catch (err) {
      console.error("❌ Error al cargar solicitudes pendientes:", err);
      // No mostrar alerta para no molestar al usuario
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  // Función para actualizar todo
  const handleOrdenUpdate = () => {
    console.log("🔄 Actualizando lista de órdenes y solicitudes...");
    setRefreshKey(prev => prev + 1);
  };

  // Función para redirigir a solicitudes pendientes
  const handleIrASolicitudesPendientes = () => {
    router.push("/solicitudes"); // Ajusta la ruta según tu aplicación
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Órdenes de Compra
          </Typography>
          
          {/* Botón/Badge de solicitudes pendientes */}
          <Badge 
            badgeContent={loadingSolicitudes ? "..." : solicitudesPendientes.length} 
            color="error"
            overlap="circular"
          >
            <Button
              variant={solicitudesPendientes.length > 0 ? "contained" : "outlined"}
              color={solicitudesPendientes.length > 0 ? "warning" : "primary"}
              onClick={handleIrASolicitudesPendientes}
              startIcon={
                loadingSolicitudes ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: solicitudesPendientes.length > 0 ? 'error.main' : 'success.main',
                      animation: solicitudesPendientes.length > 0 ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      }
                    }}
                  />
                )
              }
              sx={{
                minWidth: 200,
                position: 'relative',
                ...(solicitudesPendientes.length > 0 && {
                  animation: 'gentlePulse 2s infinite',
                  '@keyframes gentlePulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)' },
                  }
                })
              }}
            >
              {loadingSolicitudes ? (
                "Cargando..."
              ) : (
                `Solicitudes Pendientes`
              )}
            </Button>
          </Badge>
        </Box>

        {/* Información adicional */}
        {solicitudesPendientes.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ Tienes <strong>{solicitudesPendientes.length}</strong> solicitud(es) pendiente(s) de revisión
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleOpenModal} 
            sx={{ mb: 2, mr: 2 }}
          >
            Otros apartados
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setRefreshKey(prev => prev + 1)}
            sx={{ mb: 2 }}
            startIcon={<Box component="span">🔄</Box>}
          >
            Actualizar Lista
          </Button>
        </Box>

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
                onClick={() => router.push("/solicitudes")}
                fullWidth
                startIcon={
                  <Badge badgeContent={solicitudesPendientes.length} color="error" sx={{ mr: 1 }}>
                    <Box component="span">📋</Box>
                  </Badge>
                }
              >
                Solicitudes de Compra
                {solicitudesPendientes.length > 0 && (
                  <Chip 
                    label={`${solicitudesPendientes.length} pendientes`} 
                    size="small" 
                    color="warning" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/proveedores")}
                fullWidth
                startIcon="🏢"
              >
                Proveedores
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/stock")}
                fullWidth
                startIcon="📦"
              >
                Gestión de Stock
              </Button>
            </Stack>
            <Button 
              onClick={handleModalClose} 
              sx={{ mt: 2 }} 
              fullWidth
              variant="outlined"
            >
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {ordenes.length} órdenes
              </Typography>
            </Box>
            <OrdenTable 
              ordenes={ordenes} 
              onOrdenUpdate={handleOrdenUpdate}
            />
          </>
        )}
      </Box>
    </>
  );
}