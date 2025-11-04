import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSolicitudCompra } from './detalle-solicitud-compra.entity';
import { Producto } from '../productos/producto.entity';
import { SolicitudCompra } from '../solicitudes-compra/solicitud-compra.entity';
import { CreateDetalleSolicitudCompraDto } from './dto/create-detalle-solicitud-compra.dto';

@Injectable()
export class DetallesSolicitudCompraService {
  constructor(
    @InjectRepository(DetalleSolicitudCompra)
    private readonly detallesSolicitudCompraRepository: Repository<DetalleSolicitudCompra>,
  ) {}

  async createDetalleSolicitudCompra(dto: CreateDetalleSolicitudCompraDto) {
    const detalleSolicitudCompra =
      this.detallesSolicitudCompraRepository.create({
        ...dto,
        solicitud_compra: { id: dto.solicitud_compra_id } as SolicitudCompra,
        producto: { id: dto.producto_id } as Producto,
      });
    return this.detallesSolicitudCompraRepository.save(detalleSolicitudCompra);
  }

  async getDetallesSolicitudCompra() {
    return this.detallesSolicitudCompraRepository.find({
      relations: ['solicitud_compra', 'producto'],
    });
  }
}
