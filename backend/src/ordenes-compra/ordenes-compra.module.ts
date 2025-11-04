// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { OrdenesCompraController } from './ordenes-compra.controller';
import { OrdenesCompraService } from './ordenes-compra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './orden-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenCompra])], // <<-- entidad aquí
  controllers: [OrdenesCompraController],
  providers: [OrdenesCompraService],
  exports: [OrdenesCompraService], // opcional si otro módulo necesita el servicio
})
export class OrdenesCompraModule {}
