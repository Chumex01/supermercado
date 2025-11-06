// src/components/Navbar.tsx
"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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
          SuperMercado
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
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/compras")}>
            Módulo de Compras
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/productos")}>
            Inventario
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="inherit" variant="outlined" onClick={() => router.push("/productos")}>
            Módulo de Ventas
          </Button>
          <Button size="small" sx={{ mr: 2 }} color="error" variant="contained" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
