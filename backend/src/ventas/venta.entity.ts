// src/ventas/venta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Empleado } from '../empleado/empleado.entity';

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

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'empleado_cajero_id' })
  empleado_cajero: Empleado;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.COMPLETADA })
  estado: EstadoVenta;

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO })
  metodo_pago: MetodoPago;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
