import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoProveedor {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity()
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @Column()
  direccion: string;

  @Column({
    type: 'enum',
    enum: EstadoProveedor,
    default: EstadoProveedor.ACTIVO,
  })
  estado: EstadoProveedor;
}
