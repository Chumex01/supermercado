// src/compras/detalle-solicitud-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { Producto } from '../productos/producto.entity';

@Entity('detalle_solicitud_compra')
export class DetalleSolicitudCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SolicitudCompra, (solicitud) => solicitud.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'solicitud_compra_id' })
  solicitud_compra: SolicitudCompra;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_solicitada: number;

  @Column({ type: 'text', nullable: true })
  justificacion: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
