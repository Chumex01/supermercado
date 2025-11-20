// src/components/usuarios/UsuariosTable.tsx
"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  telefono: string;
  cargo: string;
  fecha_contratacion: string;
  estado: string;
  usuario: {
    id: number;
    correo: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
}

interface Props {
  empleados: Empleado[];
}

export default function EmpleadoTable({ empleados }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombres</TableCell>
            <TableCell>Apellidos</TableCell>
            <TableCell>Documento de Identidad</TableCell>
            <TableCell>Telefono</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Fecha de Contratación</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Usuario (Correo)</TableCell>
            <TableCell>Sucursal</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {empleados.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.nombres}</TableCell>
              <TableCell>{e.apellidos}</TableCell>
              <TableCell>{e.documento_identidad}</TableCell>
              <TableCell>{e.telefono}</TableCell>
              <TableCell>{e.cargo}</TableCell>
              <TableCell>{new Date(e.fecha_contratacion).toLocaleDateString()}</TableCell>
              <TableCell>{e.estado}</TableCell>
              <TableCell>{e.usuario?.correo || "—"}</TableCell>
              <TableCell>{e.sucursal?.nombre || "—"}</TableCell>
              {/* <TableCell><Button>Editar</Button>
              <Button>Eliminar</Button></TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
