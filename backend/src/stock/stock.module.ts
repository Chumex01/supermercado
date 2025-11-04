// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])], // <<-- entidad aquí
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService], // opcional si otro módulo necesita el servicio
})
export class StockModule {}
