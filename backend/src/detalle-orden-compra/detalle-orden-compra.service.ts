import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from '../ordenes-compra/orden-compra.entity';
import { Producto } from '../productos/producto.entity';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalle-orden-compra.dto';

@Injectable()
export class DetalleOrdenCompraService {
  constructor(
    @InjectRepository(DetalleOrdenCompra)
    private readonly detalleOrdenCompraRepository: Repository<DetalleOrdenCompra>,
  ) {}

  async createDetalleOrdenCompra(dto: CreateDetalleOrdenCompraDto) {
    const detalle = this.detalleOrdenCompraRepository.create({
      cantidad_ordenada: dto.cantidad_ordenada,
      precio_unitario: dto.precio_unitario,
      subtotal: dto.subtotal,
      orden_compra: { id: dto.orden_compra_id } as OrdenCompra,
      producto: { id: dto.producto_id } as Producto,
    });

    return this.detalleOrdenCompraRepository.save(detalle);
  }

  async getDetallesOrdenCompra() {
    return this.detalleOrdenCompraRepository.find({
      relations: ['orden_compra', 'producto'],
    });
  }
}
