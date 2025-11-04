// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta])], // <<-- entidad aquí
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService], // opcional si otro módulo necesita el servicio
})
export class VentasModule {}
