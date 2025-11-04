import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { Usuario } from '../usuarios/usuario.entity';
import { Sucursal } from '../sucursales/sucursal.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async createEmpleado(dtoEmpleado: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create({
      ...dtoEmpleado,
      usuario: { id: dtoEmpleado.usuario_id } as Usuario,
      sucursal: { id: dtoEmpleado.sucursal_id } as Sucursal,
    });

    return this.empleadoRepository.save(empleado);
  }

  async getEmpleados() {
    return this.empleadoRepository.find({
      relations: ['usuario', 'sucursal'],
    });
  }
}
