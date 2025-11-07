import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../proveedores/proveedor.entity';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { OrdenCompra } from './orden-compra.entity';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
  ) {}

  async createOrdenCompra(dto: CreateOrdenCompraDto) {
    const ordenCompra = this.ordenCompraRepository.create({
      ...dto,
      solicitud_id: { id: dto.solicitud_id } as SolicitudCompra,
      proveedor_id: { id: dto.proveedor_id } as Proveedor,
    });
    return this.ordenCompraRepository.save(ordenCompra);
  }

  async getOrdenesCompra() {
    return this.ordenCompraRepository.find({
      relations: ['solicitud_id', 'proveedor_id'],
    });
  }
}
