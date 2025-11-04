// src/productos/producto.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

export enum UnidadMedida {
  UNIDAD = 'unidad',
  KG = 'kg',
  LITRO = 'litro',
  PAQUETE = 'paquete',
}

export enum EstadoProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo_barras: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // 🔹 Relación con Categoría
  @ManyToOne(() => Categoria, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  // 🔹 Relación con Proveedor
  @ManyToOne(() => Proveedor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta: number;

  @Column({ type: 'enum', enum: UnidadMedida, default: UnidadMedida.UNIDAD })
  unidad_medida: UnidadMedida;

  @Column({
    type: 'enum',
    enum: EstadoProducto,
    default: EstadoProducto.ACTIVO,
  })
  estado: EstadoProducto;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fecha_actualizacion: Date;
}
