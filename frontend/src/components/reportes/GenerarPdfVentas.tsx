"use client";

import { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Box } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import Navbar from "@/components/forms/Navbar";

// Tipos
export interface Sucursal {
  id: number;
  nombre: string;
}
export interface EmpleadoCajero { nombres: string; apellidos: string; }
export interface Producto { nombre: string; }
export interface Lote { producto: Producto; }
export interface Stock { lote: Lote; }
export interface Venta {
  id: number;
  sucursal: Sucursal;
  empleado_cajero: EmpleadoCajero;
  stock: Stock;
  cantidad: string;
  precio_unitario: string;
  total: string;
  metodo_pago: string;
  cuenta_contable?: string;
  codigo_transaccion?: string;
}

export default function GenerarPdfVentas() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarSucursales = async () => {
      setLoading(true);
      try {
        const res = await api.get<Sucursal[]>("/sucursales/ListarSucursal");
        console.log("Sucursales cargadas: ", res.data);
        setSucursales(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar sucursales");
      } finally {
        setLoading(false);
      }
    };
    cargarSucursales();
  }, []);

  const generarPdf = async () => {
    if (!sucursalSeleccionada) {
      alert("Selecciona una sucursal");
      return;
    }

    console.log("Sucursal seleccionada:", sucursalSeleccionada);

    try {
      const res = await api.get<{ message: string; data: Venta[] }>('/ventas/sucursal/' + sucursalSeleccionada);
      console.log("Ventas obtenidas:", res.data);

      const ventas = res.data.data;
      if (!ventas.length) {
        alert("No hay ventas para esta sucursal");
        return;
      }

      const doc = new jsPDF();
      const fechaActual = dayjs().format("DD/MM/YYYY HH:mm");

      doc.setFontSize(16);
      doc.text("Reporte de Ventas por Sucursal", 14, 15);
      doc.setFontSize(10);
      doc.text(`Fecha: ${fechaActual}`, 14, 22);
      doc.text(`Sucursal: ${ventas[0].sucursal.nombre}`, 14, 27);

      const bodyData = ventas.map((v, i) => [
        i + 1,
        v.id,
        `${v.empleado_cajero.nombres} ${v.empleado_cajero.apellidos}`,
        v.stock.lote.producto.nombre,
        v.cantidad,
        v.precio_unitario,
        v.total,
        v.metodo_pago,
        v.cuenta_contable ?? "000000",
        v.codigo_transaccion ?? "000000",
      ]);

      autoTable(doc, {
        head: [["Nro", "ID Venta", "Empleado", "Producto", "Cantidad", "Precio Unitario", "Total", "Método Pago", "Cuenta", "Código Tx"]],
        body: bodyData,
        startY: 35,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`reporte_ventas_sucursal_${sucursalSeleccionada}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error al generar reporte de ventas");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
        <TextField
          select
          label="Sucursal"
          value={sucursalSeleccionada}
          onChange={(e) => setSucursalSeleccionada(Number(e.target.value))}
          sx={{ minWidth: 200 }}
          disabled={loading}
        >
          {sucursales.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.nombre}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={generarPdf} disabled={loading}>
          Generar Reporte de Ventas
        </Button>
      </Box>
    </>
  );
}
