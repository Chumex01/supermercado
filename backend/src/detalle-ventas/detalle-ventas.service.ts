import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle-ventas.sto';
import { Lote } from '../lotes/lote.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetalleVentasService {
    constructor(
        @InjectRepository(DetalleVenta)
        private readonly detalleVentaRepository: Repository<DetalleVenta>,
    ){}

    async createDetalleVenta(dto: CreateDetalleVentaDto){
        const DetalleVenta = this.detalleVentaRepository.create({
            ...dto,
            venta: {id: dto.venta_id } as DetalleVenta,
            lote: {id: dto.lote_id } as Lote,
        });
        return this.detalleVentaRepository.save(DetalleVenta);
    }

    async getDetalleVenta(){
        return this.detalleVentaRepository.find({
            relations: ['venta', 'lote'],
        });
    }
}
