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
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/home")}
        >
          Supermarket
        </Typography>

        {/* Botones de navegación */}
        <Box>
          <Boton
            label="Home"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/home")}
            className="mr-2"
          />

          <Boton
            label="Seguridad y Acceso"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/usuarios")}
            className="mr-2"
          />
          <Boton
            label="Catálogo"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/productos")}
            className="mr-2"
          />

          <Boton
            label="Comprar"
            size="small"
            color="default"
            variant="contained"
            onClick={() => router.push("/solicitudes")}
            className="mr-2"
          />

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
