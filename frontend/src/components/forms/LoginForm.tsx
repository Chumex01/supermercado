// src/components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que la página se recargue
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { correo, contrasena });

      // Guardamos usuario en cookie para saber que está logueado
      Cookies.set("usuario_id", res.data.usuario.id.toString(), { expires: 1 });
      Cookies.set("usuario_correo", res.data.usuario.correo, { expires: 1 });

      router.push("/home");
    } catch (err: unknown) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" align="center">
        Iniciar Sesión
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Contraseña"
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        fullWidth
        required
      />

      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </Button>
    </Box>
  );
}
