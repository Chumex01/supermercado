// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { LotesController } from './lotes.controller';
import { LotesService } from './lotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote])], // <<-- entidad aquí
  controllers: [LotesController],
  providers: [LotesService],
  exports: [LotesService], // opcional si otro módulo necesita el servicio
})
export class LoteModule {}
