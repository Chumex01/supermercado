// src/compras/orden-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,

  //   UpdateDateColumn,
} from 'typeorm';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

export enum EstadoOrdenCompra {
  PENDIENTE = 'pendiente',
  PARCIAL = 'parcial',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SolicitudCompra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitud_compra_id' })
  solicitud_compra: SolicitudCompra;

  @ManyToOne(() => Proveedor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column({
    type: 'enum',
    enum: EstadoOrdenCompra,
    default: EstadoOrdenCompra.PENDIENTE,
  })
  estado: EstadoOrdenCompra;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_orden: Date;
}
