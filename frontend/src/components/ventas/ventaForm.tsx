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
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import { api } from "@/lib/api";

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

    const handleSubmit = () => {
        const payload = {
            sucursal_id: Number(form.sucursal_id),
            empleado_cajero_id: Number(form.empleado_cajero_id),
            stock_id: Number(form.stock_id),
            cantidad: Number(form.cantidad),
            precio_unitario: Number(form.precio_unitario),
            metodo_pago: form.metodo_pago,
        };

        console.log("Payload a enviar:", payload);
        onCreate(payload);
    };

    const selectedStock = stocksFiltrados.find(stock => stock.id === Number(form.stock_id));
    const stockDisponible = selectedStock ? parseFloat(selectedStock.cantidad_disponible) : 0;
    const hayStockSuficiente = form.cantidad <= stockDisponible;
    
    // Información del producto seleccionado - CON VERIFICACIONES SEGURAS
    const producto = selectedStock?.lote?.producto;
    const productoNombre = producto?.nombre || `Producto Lote ${selectedStock?.lote?.numero_lote || 'N/A'}`;
    const numeroLote = selectedStock?.lote?.numero_lote || "N/A";
    const fechaVencimiento = selectedStock?.lote?.fecha_vencimiento;
    const ubicacion = selectedStock?.ubicacion;
    const precioSugerido = producto?.precio_venta ? parseFloat(producto.precio_venta) : 0;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Crear Nueva Venta</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {/* Columna izquierda - Formulario */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Sucursal"
                                    name="sucursal_id"
                                    value={form.sucursal_id}
                                    onChange={handleSucursalChange}
                                    fullWidth
                                    required
                                    disabled={sucursales.length === 0}
                                >
                                    {sucursales.length === 0 ? (
                                        <MenuItem disabled value="">
                                            No hay sucursales disponibles
                                        </MenuItem>
                                    ) : (
                                        sucursales.map((sucursal) => (
                                            <MenuItem key={sucursal.id} value={sucursal.id}>
                                                {sucursal.nombre}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>

                                <TextField
                                    select
                                    label="Empleado Cajero"
                                    name="empleado_cajero_id"
                                    value={form.empleado_cajero_id}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled={!form.sucursal_id || empleados.length === 0}
                                    sx={{ mt: 2 }}
                                >
                                    {empleados.length === 0 ? (
                                        <MenuItem disabled value="">
                                            No hay empleados cajeros disponibles
                                        </MenuItem>
                                    ) : (
                                        empleados.map((empleado) => (
                                            <MenuItem key={empleado.id} value={empleado.id}>
                                                {empleado.nombres} {empleado.apellidos}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>

                                <TextField
                                    select
                                    label="Seleccionar Producto en Stock"
                                    name="stock_id"
                                    value={form.stock_id}
                                    onChange={handleStockChange}
                                    fullWidth
                                    required
                                    disabled={!form.sucursal_id}
                                    helperText={errorStock || "Selecciona un producto del stock disponible"}
                                    error={!!errorStock}
                                    sx={{ mt: 2 }}
                                >
                                    {stocksFiltrados.length === 0 ? (
                                        <MenuItem disabled value="">
                                            {form.sucursal_id ? "No hay stock disponible" : "Selecciona una sucursal primero"}
                                        </MenuItem>
                                    ) : (
                                        stocksFiltrados.map((stock) => {
                                            // VERIFICACIÓN SEGURA DEL PRODUCTO
                                            const producto = stock.lote?.producto;
                                            const productoNombre = producto?.nombre || `Producto Lote ${stock.lote?.numero_lote || 'N/A'}`;
                                            const precioVenta = producto?.precio_venta ? parseFloat(producto.precio_venta) : 0;
                                            
                                            return (
                                                <MenuItem key={stock.id} value={stock.id}>
                                                    <Box sx={{ width: '100%', py: 1 }}>
                                                        {/* NOMBRE DEL PRODUCTO PRINCIPAL */}
                                                        <Typography variant="body1" fontWeight="bold" color="primary">
                                                            🏷️ {productoNombre}
                                                        </Typography>
                                                        
                                                        {/* INFORMACIÓN SECUNDARIA */}
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                📦 Lote: {stock.lote?.numero_lote || 'N/A'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                📊 Stock: {stock.cantidad_disponible}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        {/* PRECIO Y CATEGORÍA */}
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                            {precioVenta > 0 && (
                                                                <Typography variant="caption" fontWeight="medium" color="success.main">
                                                                    💰 ${precioVenta}
                                                                </Typography>
                                                            )}
                                                            {producto?.categoria && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    🗂️ {producto.categoria.nombre}
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {/* DESCRIPCIÓN Y UBICACIÓN */}
                                                        {producto?.descripcion && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                📝 {producto.descripcion}
                                                            </Typography>
                                                        )}
                                                        {stock.ubicacion && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                📍 {stock.ubicacion}
                                                            </Typography>
                                                        )}

                                                        {/* ALERTA SI NO HAY PRODUCTO ASOCIADO */}
                                                        {!producto && (
                                                            <Typography variant="caption" color="warning.main" display="block">
                                                                ⚠️ Producto no disponible en sistema
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </MenuItem>
                                            );
                                        })
                                    )}
                                </TextField>

                                {selectedStock && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            ✅ Producto seleccionado: {productoNombre}
                                        </Typography>
                                        <Typography variant="body2">
                                            Stock disponible: <strong>{stockDisponible} unidades</strong>
                                            {precioSugerido > 0 && (
                                                <> | Precio sugerido: <strong>${precioSugerido}</strong></>
                                            )}
                                        </Typography>
                                    </Alert>
                                )}

                                <TextField
                                    label="Cantidad a Vender"
                                    name="cantidad"
                                    type="number"
                                    value={form.cantidad}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ 
                                        min: 1, 
                                        max: stockDisponible,
                                        step: "1"
                                    }}
                                    error={!hayStockSuficiente && form.cantidad > 0}
                                    helperText={
                                        !hayStockSuficiente 
                                            ? `❌ Stock insuficiente. Disponible: ${stockDisponible}`
                                            : `✅ Máximo disponible: ${stockDisponible} unidades`
                                    }
                                    sx={{ mt: 2 }}
                                />

                                <TextField
                                    label="Precio Unitario de Venta"
                                    name="precio_unitario"
                                    type="number"
                                    value={form.precio_unitario}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0, step: "0.01" }}
                                    helperText="Precio de venta por unidad"
                                    sx={{ mt: 2 }}
                                />

                                <TextField
                                    select
                                    label="Método de Pago"
                                    name="metodo_pago"
                                    value={form.metodo_pago}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mt: 2 }}
                                >
                                    <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                                    <MenuItem value="tarjeta">💳 Tarjeta</MenuItem>
                                    <MenuItem value="transferencia">📲 Transferencia</MenuItem>
                                    <MenuItem value="mixto">🔀 Mixto</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Columna derecha - Información del producto seleccionado */}
                            <Grid item xs={12} md={6}>
                                {selectedStock ? (
                                    <Card variant="outlined" sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                📦 Información del Producto Seleccionado
                                            </Typography>
                                            
                                            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                                    {productoNombre}
                                                </Typography>
                                                {producto?.descripcion && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        {producto.descripcion}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        🔢 Número de Lote:
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {numeroLote}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        📊 Stock Disponible:
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="medium" color={stockDisponible < 10 ? "error" : "success"}>
                                                        {stockDisponible} unidades
                                                    </Typography>
                                                </Grid>
                                                
                                                {fechaVencimiento && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            📅 Fecha Vencimiento:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {new Date(fechaVencimiento).toLocaleDateString()}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                
                                                {ubicacion && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            📍 Ubicación:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {ubicacion}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {producto?.categoria && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            🗂️ Categoría:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {producto.categoria.nombre}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {producto?.proveedor && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            🏢 Proveedor:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {producto.proveedor.nombre}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {precioSugerido > 0 && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            💰 Precio Sugerido:
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="bold" color="primary">
                                                            ${precioSugerido}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {selectedStock.lote?.costo_unitario && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            💸 Costo Unitario:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            ${selectedStock.lote.costo_unitario}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {producto?.unidad_medida && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            ⚖️ Unidad de Medida:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {producto.unidad_medida}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {producto?.codigo_barras && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            📟 Código Barras:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {producto.codigo_barras}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>

                                            {/* Resumen de la venta */}
                                            {form.cantidad > 0 && form.precio_unitario > 0 && (
                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        💰 Resumen de Venta
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Cantidad: <strong>{form.cantidad} {producto?.unidad_medida || 'unidades'}</strong>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Precio unitario: <strong>${form.precio_unitario}</strong>
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="bold" color="success.dark" sx={{ mt: 1 }}>
                                                        Total: ${(form.cantidad * form.precio_unitario).toFixed(2)}
                                                    </Typography>
                                                    {selectedStock.lote?.costo_unitario && (
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            Ganancia estimada: <strong>${(form.cantidad * (form.precio_unitario - parseFloat(selectedStock.lote.costo_unitario))).toFixed(2)}</strong>
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                                        <CardContent>
                                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                                👈 Selecciona un producto del stock para ver la información detallada
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                        !form.sucursal_id || 
                        !form.empleado_cajero_id || 
                        !form.stock_id || 
                        form.cantidad <= 0 || 
                        form.precio_unitario <= 0 ||
                        !form.metodo_pago ||
                        !hayStockSuficiente
                    }
                    size="large"
                >
                    🧾 Crear Venta
                </Button>
            </DialogActions>
        </Dialog>
    );
}