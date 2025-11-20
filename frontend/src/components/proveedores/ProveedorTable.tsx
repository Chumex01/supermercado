"use client";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

interface Proveedor {
    id: number;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: string;
}

interface Props {
    proveedores: Proveedor[];
}

export default function ProveedorTable({ proveedores }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teelfono</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Estado</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.telefono}</TableCell>
              <TableCell>{u.correo}</TableCell>
              <TableCell>{u.direccion}</TableCell>
              <TableCell>{u.estado}</TableCell>
              {/* <TableCell><Button>Editar</Button>
              <Button>Eliminar</Button></TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}