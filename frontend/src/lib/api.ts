// // src/lib/api.ts
// import axios from "axios";

// const API_BASE = "http://localhost:3000"; // tu backend NestJS

// export const api = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ---- Endpoints de autenticación ----
// export const login = (data: { correo: string; contrasena: string }) =>
//   api.post("/auth/login", data);

// export const register = (data: { correo: string; contrasena: string }) =>
//   api.post("/usuarios", data);

// src/lib/api.ts
import axios from "axios";

// Usa la variable de entorno o fallback a localhost para desarrollo
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

console.log('API Base URL:', API_BASE); // Para debug

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 Importantísimo para cookies/sessions
});

// ---- Endpoints de autenticación ----
export const login = (data: { correo: string; contrasena: string }) =>
  api.post("/auth/login", data);

export const register = (data: { correo: string; contrasena: string }) =>
  api.post("/usuarios", data);