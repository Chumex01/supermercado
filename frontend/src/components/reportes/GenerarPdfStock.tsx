"use client";

import { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Box } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import Navbar from "@/components/forms/Navbar";

// Tipos
export interface Sucursal { id: number; nombre: string; }
export interface Producto { nombre: string; }
export interface Categoria { nombre: string; }
export interface Proveedor { nombre: string; }
export interface Lote { producto: Producto & { categoria: Categoria; proveedor: Proveedor }; numero_lote: string; }
export interface Stock { id: number; lote: Lote; cantidad_disponible: string; ubicacion: string; }

export default function GenerarPdfStock() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarSucursales = async () => {
      setLoading(true);
      try {
        const res = await api.get<Sucursal[]>("/sucursales/ListarSucursal");
        console.log("Sucursales cargadas (Stock): ", res.data);
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

    console.log("Sucursal seleccionada (Stock):", sucursalSeleccionada);

    try {
      const res = await api.get<{ message: string; data: Stock[] }>('ventas/stock/disponible/' + sucursalSeleccionada);
      console.log("Stock obtenido:", res.data);

      const stocks = res.data.data;
      if (!stocks.length) {
        alert("No hay stock disponible para esta sucursal");
        return;
      }

      const doc = new jsPDF();
      const fechaActual = dayjs().format("DD/MM/YYYY HH:mm");

      doc.setFontSize(16);
      doc.text("Reporte de Stock Disponible por Sucursal", 14, 15);
      doc.setFontSize(10);
      doc.text(`Fecha: ${fechaActual}`, 14, 22);
      doc.text(`Sucursal: ${stocks[0]?.lote?.producto?.nombre || 'N/A'}`, 14, 27);

      const bodyData = stocks.map((s, i) => [
        i + 1,
        s.id,
        s.lote.producto.nombre,
        s.lote.numero_lote,
        s.cantidad_disponible,
        s.ubicacion,
        s.lote.producto.categoria?.nombre ?? "-",
        s.lote.producto.proveedor?.nombre ?? "-",
      ]);

      autoTable(doc, {
        head: [["Nro", "ID Stock", "Producto", "Lote", "Cantidad", "Ubicación", "Categoría", "Proveedor"]],
        body: bodyData,
        startY: 35,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`reporte_stock_sucursal_${sucursalSeleccionada}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error al generar reporte de stock");
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
          Generar Reporte de Stock
        </Button>
      </Box>
    </>
  );
}
