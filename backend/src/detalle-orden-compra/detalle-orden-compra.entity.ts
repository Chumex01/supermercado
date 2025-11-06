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

@Entity('detalle_orden_compra')
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdenCompra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orden_compra_id' })
  orden_compra: OrdenCompra;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_ordenada: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
