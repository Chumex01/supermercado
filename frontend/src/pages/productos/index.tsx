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
import ProductoForm from "@/components/productos/productosForm";
import ProductoTable from "@/components/productos/ProductoTable";

interface Producto {
  id: number;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  categoria: {
    id: number;
    nombre: string;
  };
  proveedor: {
    id: number;
    nombre: string;
  };
  precio_venta: number;
  unidad_medida: string;
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

export default function EmpleadosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/productos/ListarProductos");
      setProductos(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

const crearProducto = async (data: unknown) => {
  try {
    const res = await api.post("/productos/CrearProducto", data);
    alert("Producto creado exitosamente");
    console.log(res.data);
    cargarProductos(); // refresca la tabla
  } catch (err: unknown) {
    console.error(err);
    alert("Error al crear producto");
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
          Productos
        </Typography>

        <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, mr: 2 }}>
          Otros apartados
        </Button>

        <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
          Crear Nuevo Producto
        </Button>

        {/* Formulario de usuario (fuera del modal) */}
        <ProductoForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onCreate={crearProducto}
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
                onClick={() => router.push("/categorias")}
                fullWidth
              >
                Categorias
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

        {loading ? <CircularProgress /> : <ProductoTable productos={productos} />}
      </Box>
    </>
  );
}
