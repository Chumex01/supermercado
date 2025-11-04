import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudCompra } from './solicitud-compra.entity';
import { Empleado } from '../empleado/empleado.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { CreateSolicitudCompraDto } from './dto/create-solicitudes-compra.dto';

@Injectable()
export class SolicitudesCompraService {
  constructor(
    @InjectRepository(SolicitudCompra)
    private readonly solicitudCompraRepository: Repository<SolicitudCompra>,
  ) {}

  async createSolicitudCompra(dto: CreateSolicitudCompraDto) {
    const solicitudCompra = this.solicitudCompraRepository.create({
      ...dto,
      empleado_solicitante: { id: dto.empleado_solicitante_id } as Empleado,
      sucursal: { id: dto.sucursal_id } as Sucursal,
    });
    return this.solicitudCompraRepository.save(solicitudCompra);
  }

  async getSolicitudesCompra() {
    return this.solicitudCompraRepository.find({
      relations: ['empleado_solicitante', 'sucursal'],
    });
  }
}
