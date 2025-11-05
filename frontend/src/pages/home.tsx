import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Navbar from "@/components/forms/Navbar";
import { Box, Typography } from "@mui/material";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const id = Cookies.get("usuario_id");
    if (!id) router.push("/login"); // redirige si no está logueado
  }, [router]);

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido al Home
        </Typography>
        <Typography variant="body1">
          Has iniciado sesión correctamente.
        </Typography>
      </Box>
    </>
  );
}
