// src/inventario/lote.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { OrdenCompra } from '../ordenes-compra/orden-compra.entity';
import { Producto } from '../productos/producto.entity';
// import { Empleado } from '../empleados/empleado.entity';

export enum EstadoLote {
  ACTIVO = 'activo',
  AGOTADO = 'agotado',
  VENCIDO = 'vencido',
}

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdenCompra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orden_compra_id' })
  orden_compra: OrdenCompra;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_lote: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_recibida: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_recepcion: Date;

  @Column({ type: 'enum', enum: EstadoLote, default: EstadoLote.ACTIVO })
  estado: EstadoLote;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
