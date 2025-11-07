"use client";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
}

interface Props {
    categorias: Categoria[];
}

export default function CategoriaTable({ categorias }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categorias.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.descripcion}</TableCell>
              <TableCell>{u.estado}</TableCell>
              <TableCell><Button>Editar</Button>
              <Button>Eliminar</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}