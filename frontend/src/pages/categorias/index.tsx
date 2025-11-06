
import CategoriaForm from "@/components/categorias/categoriaForm";
import CategoriaTable from "@/components/categorias/CategoriaTable";
import Navbar from "@/components/forms/Navbar";
import { api } from "@/lib/api";
import { Box, Typography, Button, Modal, Stack, CircularProgress } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
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

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
      const [loading, setLoading] = useState(true);
      const [modalOpen, setModalOpen] = useState(false);
      const [showForm, setShowForm] = useState(false);

      useEffect(() => {
        cargarCategorias();
      }, []);
    
      const cargarCategorias = async () => {
        setLoading(true);
        try {
          const res = await api.get("/categorias/ListarCategorias");
          setCategorias(res.data);
        } catch (err) {
          console.error(err);
          alert("Error al cargar categorias");
        } finally {
          setLoading(false);
        }
      };

      const crearCategorias = async (nombre: string, descripcion: string) => {
        try {
          await api.post("/categorias/CrearCategoria", { nombre, descripcion });
          alert("Categoria creada con éxito ✅");
          cargarCategorias();
          setShowForm(false);
        } catch (err) {
          console.error(err);
          alert("Error al crear categoria");
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
          Categorias
        </Typography>

        <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
          Crear Nueva Categoria
        </Button>

        {/* Formulario de sucursal (fuera del modal) */}
        <CategoriaForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearCategorias}
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
                onClick={() => router.push("/proveedores")}
                fullWidth
              >
                Proveedores
              </Button>
            </Stack>
            <Button onClick={handleModalClose} sx={{ mt: 2 }} fullWidth>
              Cerrar
            </Button>
          </Box>
        </Modal>

        {loading ? <CircularProgress /> : <CategoriaTable categorias={categorias} />}
      </Box>
        </>
      )
}

