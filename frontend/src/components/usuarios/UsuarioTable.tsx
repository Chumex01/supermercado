// src/components/usuarios/UsuariosTable.tsx
"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

interface Usuario {
  id: number;
  correo: string;
  fecha_creacion: string;
}

interface Props {
  usuarios: Usuario[];
}

export default function UsuariosTable({ usuarios }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Fecha creación</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.correo}</TableCell>
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
