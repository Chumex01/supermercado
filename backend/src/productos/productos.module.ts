// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])], // <<-- entidad aquí
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService], // opcional si otro módulo necesita el servicio
})
export class ProductosModule {}
