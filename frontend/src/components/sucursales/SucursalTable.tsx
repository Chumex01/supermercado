// src/components/usuarios/UsuariosTable.tsx
"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: string;
  fecha_creacion: string;
}

interface Props {
  sucursales: Sucursal[];
}

export default function SucursalesTable({ sucursales }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Direccion</TableCell>
            <TableCell>Telefono</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha creación</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {sucursales.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.direccion}</TableCell>
              <TableCell>{u.telefono}</TableCell>
              <TableCell>{u.estado}</TableCell>
              <TableCell>{new Date(u.fecha_creacion).toLocaleDateString()}</TableCell>
              {/* <TableCell><Button>Editar</Button>
              <Button>Eliminar</Button></TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
