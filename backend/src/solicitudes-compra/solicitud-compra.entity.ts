// src/compras/solicitud-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Producto } from '../productos/producto.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'Pendiente',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

@Entity('solicitudes_compra')
export class SolicitudCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empleado_id' })
  empleado_id: Empleado;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto_id: Producto;

  @ManyToOne(() => Sucursal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @Column({ type: 'varchar', length: 100 })
  nombre_solicitud: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_solicitada: number;

  @Column({ type: 'text', nullable: true })
  justificacion: string;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE,
  })
  estado: EstadoSolicitud;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_solicitud: Date;
}
