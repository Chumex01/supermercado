// src/compras/orden-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,

  //   UpdateDateColumn,
} from 'typeorm';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

export enum EstadoOrdenCompra {
  PENDIENTE = 'Pendiente',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada',
}

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SolicitudCompra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitud_id' })
  solicitud_id: SolicitudCompra;

  @ManyToOne(() => Proveedor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor_id: Proveedor;

  @Column({ type: 'varchar', length: 100 })
  nombre_orden: string;

  @Column({
    type: 'enum',
    enum: EstadoOrdenCompra,
    default: EstadoOrdenCompra.PENDIENTE,
  })
  estado: EstadoOrdenCompra;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad_ordenada: number; // ← Duplicada de la solicitud

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_orden: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    this.total = this.cantidad_ordenada * this.precio_unitario;
  }
}
