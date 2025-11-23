// src/ventas/venta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Empleado } from '../empleado/empleado.entity';
import { Stock } from '../stock/stock.entity';
import { EstadoLote } from '../lotes/lote.entity'; // ← Importa el enum del Lote

export enum EstadoVenta {
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
  PENDIENTE = 'pendiente',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  MIXTO = 'mixto',
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  // Información básica
  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'empleado_cajero_id' })
  empleado_cajero: Empleado;

  // Relación con Stock (que contiene lote y producto)
  @ManyToOne(() => Stock, { eager: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  // Detalles de la venta
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Fechas y estado
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;

  @Column({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.PENDIENTE })
  estado: EstadoVenta;

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO })
  metodo_pago: MetodoPago;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ nullable: true })
  cuenta_contable: string;

  @Column({ nullable: true })
  codigo_transaccion: string;
  // Cálculos automáticos
  @BeforeInsert()
  @BeforeUpdate()
  calcularTotales() {
    this.subtotal = Number(this.cantidad) * Number(this.precio_unitario);
    this.total = this.subtotal;
  }

  // Métodos helper para acceder a la información de manera más fácil
  getProducto() {
    return this.stock?.lote?.producto;
  }

  getLote() {
    return this.stock?.lote;
  }

  getInfoProducto() {
    const producto = this.getProducto();
    const lote = this.getLote();

    return {
      producto: producto?.nombre || 'Producto no disponible',
      categoria: producto?.categoria?.nombre || 'N/A',
      proveedor: producto?.proveedor?.nombre || 'N/A',
      lote: lote?.numero_lote || 'N/A',
      fechaVencimiento: lote?.fecha_vencimiento || null,
      unidadMedida: producto?.unidad_medida || 'unidad',
    };
  }

  getInfoVenta() {
    return {
      id: this.id,
      ...this.getInfoProducto(),
      sucursal: this.sucursal?.nombre,
      cantidad: this.cantidad,
      precioUnitario: this.precio_unitario,
      subtotal: this.subtotal,
      total: this.total,
      empleado: `${this.empleado_cajero?.nombres} ${this.empleado_cajero?.apellidos}`,
      fecha: this.fecha_venta,
      estado: this.estado,
      metodoPago: this.metodo_pago,
    };
  }

  completarVenta() {
    this.estado = EstadoVenta.COMPLETADA;
    this.fecha_venta = new Date();
  }

  cancelarVenta() {
    this.estado = EstadoVenta.CANCELADA;
  }

  // Método para validar si hay stock suficiente antes de crear la venta
  validarStock(): boolean {
    return Number(this.stock?.cantidad_disponible) >= Number(this.cantidad);
  }

  // Método para obtener el costo del producto desde el lote
  getCostoUnitario(): number {
    return Number(this.stock?.lote?.costo_unitario) || 0;
  }

  // Calcular ganancia
  getGanancia(): number {
    const costoTotal = Number(this.cantidad) * this.getCostoUnitario();
    return this.total - costoTotal;
  }

  // Método para validar si el lote está activo (usando el enum correcto)
  validarLoteActivo(): boolean {
    return this.stock?.lote?.estado === EstadoLote.ACTIVO;
  }
}
