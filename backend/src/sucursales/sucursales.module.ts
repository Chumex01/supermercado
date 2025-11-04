// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './sucursal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursal])], // <<-- entidad aquí
  controllers: [SucursalesController],
  providers: [SucursalesService],
  exports: [SucursalesService], // opcional si otro módulo necesita el servicio
})
export class SucursalModule {}
