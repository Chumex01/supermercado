// src/articulo/articulo.module.ts
import { Module } from '@nestjs/common';
import { SolicitudesCompraController } from './solicitudes-compra.controller';
import { SolicitudesCompraService } from './solicitudes-compra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudCompra } from './solicitud-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudCompra])], // <<-- entidad aquí
  controllers: [SolicitudesCompraController],
  providers: [SolicitudesCompraService],
  exports: [SolicitudesCompraService], // opcional si otro módulo necesita el servicio
})
export class SolicitudesCompraModule {}
