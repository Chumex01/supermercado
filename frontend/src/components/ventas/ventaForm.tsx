"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Box,
    Typography,
    Alert,
} from "@mui/material";
import { api } from "@/lib/api";
import axios from "axios";
import { on } from "events";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (data: unknown) => void;
}

interface Sucursal {
    id: number;
    nombre: string;
}

interface Empleado {
    id: number;
    nombres: string;
    apellidos: string;
    cargo: string;
}

interface Stock {
    id: number;
    cantidad_disponible: string;
    cantidad_minima: string;
    ubicacion: string;
    sucursal: {
        id: number;
        nombre: string;
    };
    lote: {
        id: number;
        numero_lote: string;
        fecha_vencimiento: string;
        cantidad_recibida: string;
        costo_unitario: string;
        estado: string;
        producto?: { // ← Mantenemos como opcional por seguridad
            id: number;
            codigo_barras?: string;
            nombre: string;
            descripcion?: string;
            precio_venta: string;
            unidad_medida: string;
            categoria?: {
                id: number;
                nombre: string;
            };
            proveedor?: {
                id: number;
                nombre: string;
            };
            estado: string;
        };
    };
}

export default function VentaForm({ open, onClose, onCreate }: Props) {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [todosLosStocks, setTodosLosStocks] = useState<Stock[]>([]);
    const [stocksFiltrados, setStocksFiltrados] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSucursal, setSelectedSucursal] = useState<number | "">("");
    const [errorStock, setErrorStock] = useState("");

    const [form, setForm] = useState({
        sucursal_id: "",
        empleado_cajero_id: "",
        stock_id: "",
        cantidad: 0,
        precio_unitario: 0,
        metodo_pago: "efectivo",
    });

    useEffect(() => {
        if (open) {
            cargarDatos();
            setForm({
                sucursal_id: "",
                empleado_cajero_id: "",
                stock_id: "",
                cantidad: 0,
                precio_unitario: 0,
                metodo_pago: "efectivo",
            });
            setSelectedSucursal("");
            setErrorStock("");
            setStocksFiltrados([]);
        }
    }, [open]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [sucursalesRes, empleadosRes, stocksRes] = await Promise.all([
                api.get("/sucursales/ListarSucursal"),
                api.get("/empleados/ListarEmpleados"),
                api.get("/stock/ListarStocks")
            ]);

            console.log("Respuesta completa de stocks:", stocksRes.data);

            // Sucursales
            setSucursales(sucursalesRes.data || []);

            // Empleados
            const empleadosData = empleadosRes.data?.data || empleadosRes.data || [];
            const cajeros = empleadosData.filter((emp: Empleado) =>
                emp.cargo === 'cajero' || emp.cargo?.toLowerCase().includes('cajero')
            );
            setEmpleados(cajeros);

            // Stocks - según tu API viene con { total, data }
            const stocksData = stocksRes.data?.data || stocksRes.data || [];
            setTodosLosStocks(stocksData);

            // Debug: verificar qué stocks tienen producto
            console.log("Stocks con información de productos:", stocksData.map((stock: Stock) => ({
                id: stock.id,
                tieneProducto: !!stock.lote?.producto,
                productoNombre: stock.lote?.producto?.nombre || 'SIN PRODUCTO',
                lote: stock.lote?.numero_lote
            })));

        } catch (err) {
            console.error("Error al cargar datos:", err);
            alert("Error al cargar los datos iniciales");
        } finally {
            setLoading(false);
        }
    };

    const filtrarStocksPorSucursal = (sucursalId: number) => {
        setErrorStock("");

        if (sucursalId) {
            const filtrados = todosLosStocks.filter((stock: Stock) =>
                stock.sucursal.id === sucursalId &&
                parseFloat(stock.cantidad_disponible) > 0
            );

            setStocksFiltrados(filtrados);

            if (filtrados.length === 0) {
                setErrorStock("No hay stock disponible en esta sucursal");
            }
        } else {
            setStocksFiltrados([]);
        }
    };

    const handleSucursalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sucursalId = e.target.value;
        setForm({
            ...form,
            sucursal_id: sucursalId,
            stock_id: "",
            cantidad: 0,
            precio_unitario: 0,
        });
        setSelectedSucursal(Number(sucursalId));

        if (sucursalId) {
            filtrarStocksPorSucursal(Number(sucursalId));
        } else {
            setStocksFiltrados([]);
            setErrorStock("");
        }
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stockId = e.target.value;
        const selectedStock = stocksFiltrados.find(stock => stock.id === Number(stockId));

        // Verificación segura del precio_venta
        const precioSugerido = selectedStock?.lote?.producto?.precio_venta
            ? parseFloat(selectedStock.lote.producto.precio_venta)
            : 0;

        setForm({
            ...form,
            stock_id: stockId,
            precio_unitario: precioSugerido,
            cantidad: 0, // Resetear cantidad al cambiar producto
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name.includes("cantidad") || name.includes("precio_unitario")
                ? Number(value)
                : value,
        });
    };

const handleSubmit = async () => {
// Validaciones básicas
if (!form.sucursal_id || !form.empleado_cajero_id || !form.stock_id) {
alert("Por favor selecciona sucursal, empleado y producto");
return;
}

const selectedStock = stocksFiltrados.find(s => s.id === Number(form.stock_id));
const stockDisponible = selectedStock ? parseFloat(selectedStock.cantidad_disponible) : 0;
if (form.cantidad > stockDisponible) {
    alert("Cantidad supera el stock disponible");
    return;
}

// Preparar payload local inicial con valores por defecto
const payloadLocal: any = {
    sucursal_id: Number(form.sucursal_id),
    empleado_cajero_id: Number(form.empleado_cajero_id),
    stock_id: Number(form.stock_id),
    cantidad: Number(form.cantidad),
    precio_unitario: Number(form.precio_unitario),
    metodo_pago: form.metodo_pago,
    cuenta_contable: "000000",       // valor por defecto
    codigo_transaccion: "000000",    // valor por defecto
};

// Calcular monto total
const montoTotal = Number(form.cantidad) * Number(form.precio_unitario);
const fechaVenta = new Date().toISOString();

const payloadConta = { CodigoEmpresa: 7, Fecha: fechaVenta, Monto: montoTotal };
const payloadTransaccion = {
    codigo: 7,
    codoperacion: Math.floor(Math.random() * 1000) + 1,
    fecha: fechaVenta,
    montototal: montoTotal,
    detalle: {
        codproducto: Number(form.stock_id),
        cantidad: Number(form.cantidad),
        description: "Venta de producto",
        monto: Number(form.precio_unitario),
    },
};

try {
    const respuestaConta = await axios.post("http://192.168.43.20:3000/api/cuenta", payloadConta);
    if (respuestaConta?.data?.success && respuestaConta.data.data?.cuenta_contable) {
        payloadLocal.cuenta_contable = respuestaConta.data.data.cuenta_contable;
    }
    console.log("Venta enviada a contabilidad:", respuestaConta.data);
} catch (err) {
    console.log("No se puede realizar la venta, contabilidad no responde. Se asigna 000000:", err);
}

try {
    const respuestaTransaccion = await axios.post("http://192.168.43.20:3000/api/transaccion", payloadTransaccion);
    if (respuestaTransaccion?.data?.success && respuestaTransaccion.data.data?.codigo_transaccion) {
        payloadLocal.codigo_transaccion = respuestaTransaccion.data.data.codigo_transaccion;
    }
    console.log("Venta enviada a transacciones:", respuestaTransaccion.data);
} catch (err) {
    console.log("No se puede realizar la venta, transacciones no responde. Se asigna 000000:", err);
}

// Guardar localmente con los valores ya asignados (reales o por defecto)
onCreate(payloadLocal);

};




    const selectedStock = stocksFiltrados.find(stock => stock.id === Number(form.stock_id));
    const stockDisponible = selectedStock ? parseFloat(selectedStock.cantidad_disponible) : 0;
    const hayStockSuficiente = form.cantidad <= stockDisponible;

    // Información del producto seleccionado - CON VERIFICACIONES SEGURAS
    const producto = selectedStock?.lote?.producto;
    const productoNombre = producto?.nombre || `Producto Lote ${selectedStock?.lote?.numero_lote || 'N/A'}`;
    const numeroLote = selectedStock?.lote?.numero_lote || "N/A";
    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ py: 1.5, fontSize: "1rem" }}>Crear Nueva Venta</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 0.5 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}> <CircularProgress size={20} />
                    <Typography sx={{ ml: 1, fontSize: "0.875rem" }}>Cargando datos...</Typography> </Box>
            ) : (
                <> <TextField
                    select
                    label="Sucursal"
                    name="sucursal_id"
                    value={form.sucursal_id}
                    onChange={handleSucursalChange}
                    fullWidth
                    size="small"
                >
                    {sucursales.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)} </TextField>

                    <TextField
                        select
                        label="Empleado Cajero"
                        name="empleado_cajero_id"
                        value={form.empleado_cajero_id}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    >
                        {empleados.map(e => <MenuItem key={e.id} value={e.id}>{e.nombres} {e.apellidos}</MenuItem>)}
                    </TextField>

                    <TextField
                        select
                        label="Producto en Stock"
                        name="stock_id"
                        value={form.stock_id}
                        onChange={handleStockChange}
                        fullWidth
                        size="small"
                        disabled={!form.sucursal_id}
                        helperText={errorStock || "Selecciona un producto disponible"}
                        error={!!errorStock}
                    >
                        {stocksFiltrados.length === 0 ? (
                            <MenuItem disabled value="">
                                {form.sucursal_id ? "No hay stock disponible" : "Selecciona una sucursal primero"}
                            </MenuItem>
                        ) : (
                            stocksFiltrados.map(stock => {
                                const producto = stock.lote?.producto;
                                const nombre = producto?.nombre || `Producto Lote ${stock.lote?.numero_lote || 'N/A'}`;
                                const lote = stock.lote?.numero_lote || 'N/A';
                                const disponible = stock.cantidad_disponible;
                                return <MenuItem key={stock.id} value={stock.id}>{`${nombre} | Lote: ${lote} | Stock: ${disponible}`}</MenuItem>;
                            })
                        )}
                    </TextField>

                    {selectedStock && (
                        <Alert severity="info" sx={{ py: 0.5, fontSize: "0.75rem" }}>
                            {productoNombre} | Stock: {stockDisponible} | Lote: {numeroLote}
                        </Alert>
                    )}

                    <TextField
                        label="Cantidad a Vender"
                        name="cantidad"
                        type="number"
                        value={form.cantidad}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        inputProps={{ min: 1, max: stockDisponible }}
                        helperText={!hayStockSuficiente && "Stock insuficiente"}
                        error={!hayStockSuficiente}
                    />

                    <TextField
                        label="Precio Unitario"
                        name="precio_unitario"
                        type="number"
                        value={form.precio_unitario}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "0.01" }}
                    />

                    <TextField
                        select
                        label="Método de Pago"
                        name="metodo_pago"
                        value={form.metodo_pago}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="efectivo">Efectivo</MenuItem>
                        <MenuItem value="tarjeta">Tarjeta</MenuItem>
                        <MenuItem value="transferencia">Transferencia</MenuItem>
                        <MenuItem value="mixto">Mixto</MenuItem>
                    </TextField>
                </>
            )}
        </DialogContent>

        <DialogActions sx={{ py: 1 }}>
            <Button onClick={onClose} size="small">Cancelar</Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                size="small"
                disabled={!form.sucursal_id || !form.empleado_cajero_id || !form.stock_id || form.cantidad <= 0 || !hayStockSuficiente}
            >
                Crear Venta
            </Button>
        </DialogActions>
    </Dialog>
    );
};
