import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,

  //   CreateDateColumn,
} from 'typeorm';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
