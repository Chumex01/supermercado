// src/lib/api.ts
import axios from "axios";

const API_BASE = "http://localhost:3000"; // tu backend NestJS

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Endpoints de autenticación ----
export const login = (data: { correo: string; contrasena: string }) =>
  api.post("/auth/login", data);

export const register = (data: { correo: string; contrasena: string }) =>
  api.post("/usuarios", data);

