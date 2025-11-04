import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { CreateVentaDto } from './dto/create-ventas.dto';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Empleado } from '../empleado/empleado.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  async createVenta(dto: CreateVentaDto) {
    const venta = this.ventaRepository.create({
      ...dto,
      sucursal: { id: dto.sucursal_id } as Sucursal,
      empleado_cajero: { id: dto.empleado_cajero_id } as Empleado,
    });

    return this.ventaRepository.save(venta);
  }

  async getVentas() {
    return this.ventaRepository.find({
      relations: ['sucursal', 'empleado_cajero'],
    });
  }
}
