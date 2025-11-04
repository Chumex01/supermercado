// src/empleados/empleado.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Sucursal } from '../sucursales/sucursal.entity';

export enum Cargo {
  GERENTE = 'gerente',
  CAJERO = 'cajero',
  ALMACEN = 'almacen',
  COMPRAS = 'compras',
}

export enum EstadoEmpleado {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Relación 1:1 con Usuario (un usuario puede ser empleado)
  @OneToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' }) // Esto crea la columna usuario_id
  usuario: Usuario;

  // 🔹 Relación con Sucursal (muchos empleados por sucursal)
  @ManyToOne(() => Sucursal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  documento_identidad: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'enum', enum: Cargo })
  cargo: Cargo;

  @Column({ type: 'date', nullable: true })
  fecha_contratacion: Date;

  @Column({
    type: 'enum',
    enum: EstadoEmpleado,
    default: EstadoEmpleado.ACTIVO,
  })
  estado: EstadoEmpleado;
}
