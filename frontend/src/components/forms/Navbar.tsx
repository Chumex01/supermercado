// src/components/Navbar.tsx
"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Boton } from "../botones/botonNav";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("usuario_id");
    Cookies.remove("usuario_correo");
    router.push("/");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo o título */}
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => router.push("/home")}>
          Supermarket
        </Typography>

        {/* Botones de navegación */}
        <Box>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/home")}>
            Home
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/usuarios")}>
            Seguridad y Acceso
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/categorias")}>
            Catálogo
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/solicitudes")}>
            Módulo de Compras
          </Button>

          <Boton
            label="Inventario"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/stock")}
            className="mr-2"
          />

          <Boton
            label="Vender"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/ventas")}
            className="mr-2"
          />

          <Boton
            label="Cerrar sesión"
            size="small"
            color="error"
            variant="contained"
            // className="mr-2"
            onClick={handleLogout}
          />

        </Box>
      </Toolbar>
    </AppBar>
  );
}
