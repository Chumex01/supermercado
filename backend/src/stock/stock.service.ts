import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { Sucursal } from '../sucursales/sucursal.entity';
import { Lote } from '../lotes/lote.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async createStock(dto: CreateStockDto) {
    const stock = this.stockRepository.create({
      ...dto,
      sucursal: { id: dto.sucursal_id } as Sucursal,
      lote: { id: dto.lote_id } as Lote,
    });
    return this.stockRepository.save(stock);
  }

  async getStocks() {
    return this.stockRepository.find({
      relations: [
        'sucursal', 
        'lote', 
        'lote.producto', // ← AÑADE ESTO
        'lote.producto.categoria', // ← OPCIONAL
        'lote.producto.proveedor' // ← OPCIONAL
      ],
    });
  }
}