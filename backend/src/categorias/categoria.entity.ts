import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoCategoria {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoCategoria,
    default: EstadoCategoria.ACTIVO,
  })
  estado: EstadoCategoria;
}
