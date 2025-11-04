// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { DetalleOrdenCompraController } from './detalle-orden-compra.controller';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleOrdenCompra])], // <<-- entidad aquí
  controllers: [DetalleOrdenCompraController],
  providers: [DetalleOrdenCompraService],
  exports: [DetalleOrdenCompraService], // opcional si otro módulo necesita el servicio
})
export class DetalleOrdenCompraModule {}
