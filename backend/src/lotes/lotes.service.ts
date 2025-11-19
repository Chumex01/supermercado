import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from './lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { OrdenCompra } from '../ordenes-compra/orden-compra.entity';
import { Producto } from '../productos/producto.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async createLote(dto: CreateLoteDto) {
    const lote = this.loteRepository.create({
      ...dto,
      orden_compra: { id: dto.orden_compra_id } as OrdenCompra,
      producto: { id: dto.producto_id } as Producto,
    });
    return this.loteRepository.save(lote);
  }

  async getLotes() {
    return this.loteRepository.find({
      relations: ['orden_compra', 'producto'],
    });
  }

async getUltimoLote() {
  const lotes = await this.loteRepository.find({
    order: { id: 'DESC' },
    take: 1,
    relations: ['orden_compra', 'producto'],
  });

  return lotes[0] ?? null;
}


}
