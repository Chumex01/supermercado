// src/inventario/stock.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Lote } from '../lotes/lote.entity';

@Entity('stock')
@Unique(['sucursal', 'lote'])
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sucursal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Lote, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lote_id' })
  lote: Lote;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_disponible: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 5 })
  cantidad_minima: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fecha_actualizacion: Date;
}
